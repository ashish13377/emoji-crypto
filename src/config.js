// -- src/config.js ----------------------------------------------------------
const GraphemeSplitter = require("grapheme-splitter");
const emojiData = require("unicode-emoji-json");

const splitter = new GraphemeSplitter();
const allEmojis = Object.keys(emojiData);
const singleGrapheme = allEmojis.filter(
	(e) => splitter.splitGraphemes(e).length === 1
);

if (singleGrapheme.length < 256) {
	throw new Error(
		`Not enough single‑grapheme emoji in library: found ${singleGrapheme.length}`
	);
}

const DEFAULT_EMOJI_MAP = singleGrapheme.slice(0, 256);

module.exports = {
	DEFAULT: {
		algorithm: "aes-256-gcm",
		ivBytes: 12,
		keyDerivation: {
			saltBytes: 16,
			iterations: 100_000,
			hash: "sha256",
			keyLen: 32,
		},
		emojiMap: DEFAULT_EMOJI_MAP,
	},
};
