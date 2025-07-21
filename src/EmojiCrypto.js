// -- src/EmojiCrypto.js -----------------------------------------------------
const crypto = require("crypto");
const { Transform } = require("stream");
const { DEFAULT } = require("./config");
const { deriveKey, bufToEmoji, emojiToBuf } = require("./utils");
const { ValidationError, AuthenticationError } = require("./errors");

class EmojiCrypto {
	constructor(config = {}) {
		this.config = {
			algorithm: config.algorithm || DEFAULT.algorithm,
			ivBytes: config.ivBytes ?? DEFAULT.ivBytes,
			keyDerivation: {
				...DEFAULT.keyDerivation,
				...(config.keyDerivation || {}),
			},
			emojiMap: config.emojiMap || DEFAULT.emojiMap,
		};

		if (this.config.emojiMap.length !== 256) {
			throw new ValidationError("emojiMap must contain exactly 256 emojis");
		}

		this.emojiToByte = new Map(
			this.config.emojiMap.map((emo, idx) => [emo, idx])
		);
	}

	encrypt(plaintext, password, opts = {}) {
		const { keyDerivation, ivBytes, algorithm, emojiMap } = this.config;
		const { onProgress } = opts;

		const salt = crypto.randomBytes(keyDerivation.saltBytes);
		const iv = crypto.randomBytes(ivBytes);
		const key = deriveKey(password, salt, keyDerivation);

		const cipher = crypto.createCipheriv(algorithm, key, iv);
		const chunks = [];
		let processed = 0;

		cipher.on("data", (chunk) => {
			processed += chunk.length;
			if (onProgress) onProgress(processed);
			chunks.push(chunk);
		});

		cipher.write(Buffer.from(plaintext, "utf8"));
		cipher.end();

		const ct = Buffer.concat(chunks);
		const tag = cipher.getAuthTag();
		const payload = Buffer.concat([salt, iv, tag, ct]);
		const emoji = bufToEmoji(payload, emojiMap);

		return { raw: payload.toString("hex"), emoji };
	}

	decrypt(emojiText, password, opts = {}) {
		const { keyDerivation, ivBytes, algorithm, emojiMap } = this.config;
		const { onProgress } = opts;

		const payload = emojiToBuf(emojiText, emojiMap, keyDerivation, ivBytes);
		const saltLen = keyDerivation.saltBytes;
		const salt = payload.slice(0, saltLen);
		const iv = payload.slice(saltLen, saltLen + ivBytes);
		const tag = payload.slice(saltLen + ivBytes, saltLen + ivBytes + 16);
		const ct = payload.slice(saltLen + ivBytes + 16);

		const key = deriveKey(password, salt, keyDerivation);
		const decipher = crypto.createDecipheriv(algorithm, key, iv);
		decipher.setAuthTag(tag);

		try {
			const plainBuf = Buffer.concat([decipher.update(ct), decipher.final()]);
			if (onProgress) onProgress(plainBuf.length);
			return plainBuf.toString("utf8");
		} catch (err) {
			throw new AuthenticationError(
				"Decryption failed: authentication tag mismatch"
			);
		}
	}

	encryptStream(input, password) {
		const { keyDerivation, ivBytes, algorithm, emojiMap } = this.config;
		const salt = crypto.randomBytes(keyDerivation.saltBytes);
		const iv = crypto.randomBytes(ivBytes);
		const key = deriveKey(password, salt, keyDerivation);

		const cipher = crypto.createCipheriv(algorithm, key, iv);
		const transform = new Transform({
			transform(chunk, _, cb) {
				try {
					cb(null, bufToEmoji(chunk, emojiMap));
				} catch (err) {
					cb(err);
				}
			},
		});

		input.pipe(cipher).pipe(transform);
		return transform;
	}

	decryptStream(input, password) {
		let buffer = "";
		const self = this;
		return new Transform({
			transform(chunk, encoding, callback) {
				buffer += chunk.toString("utf8");
				try {
					const pt = self.decrypt(buffer, password);
					callback(null, pt);
				} catch {
					callback();
				}
			},
		});
	}
}

const defaultInstance = new EmojiCrypto();

module.exports = {
	EmojiCrypto,
	defaultInstance,
};
