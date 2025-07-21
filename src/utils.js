// -- src/utils.js -----------------------------------------------------------
const crypto = require("crypto");
const GraphemeSplitter = require("grapheme-splitter");
const { ValidationError } = require("./errors");

const splitter = new GraphemeSplitter();

function deriveKey(password, salt, opts) {
	return crypto.pbkdf2Sync(
		password,
		salt,
		opts.iterations,
		opts.keyLen,
		opts.hash
	);
}

function bufToEmoji(buffer, map) {
	return buffer.reduce((s, b) => s + map[b], "");
}

function emojiToBuf(text, emojiMap, keyDerivation, ivBytes) {
	const emojis = splitter.splitGraphemes(text);
	const headerLen = keyDerivation.saltBytes + ivBytes + 16;
	if (emojis.length < headerLen) {
		throw new ValidationError("Ciphertext too short");
	}
	const bytes = emojis.map((emo) => {
		const idx = emojiMap.indexOf(emo);
		if (idx < 0) throw new ValidationError("Invalid emoji");
		return idx;
	});
	return Buffer.from(bytes);
}

module.exports = {
	deriveKey,
	bufToEmoji,
	emojiToBuf,
};
