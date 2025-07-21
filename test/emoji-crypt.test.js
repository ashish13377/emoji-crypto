const {
	encrypt,
	decrypt,
	configure,
	ValidationError,
	AuthenticationError,
} = require("../emoji-crypto");

describe("emoji-crypt", () => {
	const password = "test-pass";
	const message = "Hello, Emoji Crypto!";

	test("encrypt/decrypt roundtrip", () => {
		const { emoji } = encrypt(message, password);
		const result = decrypt(emoji, password);
		expect(result).toBe(message);
	});

	test("invalid emoji input", () => {
		expect(() => decrypt("🚫🚫🚫", password)).toThrow(ValidationError);
	});

	test("wrong password fails auth", () => {
		const { emoji } = encrypt(message, password);
		expect(() => decrypt(emoji, "wrong")).toThrow(AuthenticationError);
	});

	test("custom config works", () => {
		const custom = configure({ keyDerivation: { iterations: 200000 } });
		const { emoji } = custom.encrypt(message, password);
		expect(custom.decrypt(emoji, password)).toBe(message);
	});
});
