// -- src/errors.js ----------------------------------------------------------
class EmojiCryptoError extends Error {}
class ValidationError extends EmojiCryptoError {}
class AuthenticationError extends EmojiCryptoError {}

module.exports = {
	EmojiCryptoError,
	ValidationError,
	AuthenticationError,
};
