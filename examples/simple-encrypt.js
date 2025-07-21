// demo.js
const { encrypt, decrypt } = require("../src/index");

const password = "mySecret123";
const message = "Hello, Emoji Crypto!";

// Encrypt:
const { raw, emoji } = encrypt(message, password, {
	onProgress: (bytes) => console.log(`Encrypted ${bytes} bytes…`),
});
console.log("Hex payload:", raw);
console.log("Emoji payload:", emoji);

// Decrypt:
const recovered = decrypt(emoji, password, {
	onProgress: (bytes) => console.log(`Decrypted ${bytes} bytes…`),
});
console.log("Recovered:", recovered);
