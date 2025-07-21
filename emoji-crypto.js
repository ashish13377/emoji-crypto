const { defaultInstance, EmojiCrypto } = require("./src/EmojiCrypto");

module.exports = {
	encrypt: (text, password, opts) =>
		defaultInstance.encrypt(text, password, opts),
	decrypt: (emojiText, password, opts) =>
		defaultInstance.decrypt(emojiText, password, opts),
	configure: (cfg) => new EmojiCrypto(cfg),
	EmojiCrypto,
};