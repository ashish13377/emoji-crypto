# emoji‑crypto

<div align="center" >
  <img src="https://res.cloudinary.com/diyncva2v/image/upload/v1753081544/ygulghdwsx0zxooo1liv.png" target="_blank" alt="Ezhire App" style="max-width: 20%; height: 25px; border-radius: 15px;" />
</div>

---

**emoji‑crypto** is a playful yet powerful Node.js library that turns raw ciphertext into walls of 📙😃🔑 emojis while keeping the underlying security rock‑solid with **AES‑256‑GCM** and **PBKDF2‑SHA‑256**. Use it to build fun chat experiences, obfuscate logs, or teach modern symmetric‑key cryptography step‑by‑step.

## ✨ Features


| Feature                             | Details                                                               |
| ----------------------------------- | --------------------------------------------------------------------- |
| 🔐**Strong encryption**             | AES‑256‑GCM for confidentiality**and**integrity                     |
| 🏋️‍♀️**Robust key derivation** | PBKDF2 (SHA‑256) with configurable salt & iterations                 |
| 🧩**Emoji framing**                 | 256‑emoji map → 1‑to‑1 byte representation                        |
| 🚀**Stream friendly**               | Transform streams so you can pipe buffers in and encrypted‑emoji out |
| ☑️**Typed**                       | Full TypeScript type declarations included                            |
| 🛠**Hackable**                      | Swap out the emoji map, KDF params, IV length, etc. via`configure()`  |

## 📦 Installation

```bash
npm install emoji-crypto
# or
yarn add emoji-crypto
```

## ⚡ Quick Start

```js
import { EmojiCrypto } from 'emoji-crypto';

// 1. Create an instance (passphrase or raw key)
const crypto = new EmojiCrypto('correct horse battery staple');

// 2. Encrypt text → emoji wall
const secret = crypto.encrypt('Hello, world!');
console.log(secret); // 🥳🔒🤖🌟…

// 3. Decrypt emoji back → text
console.log(crypto.decrypt(secret)); // "Hello, world!"
```

## 🛠 Customising with `configure()`

Need a different security posture or branded emojis? Create your own **factory** using `configure(overrides)`:

```js
import { configure } from 'emoji-crypto';

// Bring your own 256‑emoji array (✅ must be *single‑grapheme* emojis)
import my256EmojiArray from './myEmojiBank.js';

// 1️⃣ Build a custom constructor
const CustomCrypto = configure({
  // 🔑 Key‑derivation tweaks (⬆️ default: 100k iterations, 16‑byte salt)
  keyDerivation: {
    iterations: 500_000,
    saltBytes: 32,      // bigger random salt
  },
  // 🖼 Custom emoji alphabet
  emojiMap: my256EmojiArray,
});

// 2️⃣ Use like the default class
const crypto = new CustomCrypto('sup3rs3cret');
const msg = crypto.encrypt('🔒 personalised & stronger!');
```

> **Heads‑up**: Under the hood the call above just merges your `overrides` onto the defaults exported from **`src/config.js`**. See code snippet below.

### Default Configuration (from [`src/config.js`](https://chatgpt.com/c/src/config.js))

```js
const DEFAULT = {
  algorithm: 'aes-256-gcm',
  ivBytes: 12,               // 96‑bit IV (recommended for GCM)
  keyDerivation: {
    saltBytes: 16,
    iterations: 100_000,
    hash: 'sha256',
    keyLen: 32,             // 256‑bit key
  },
  emojiMap: DEFAULT_EMOJI_MAP, // first 256 single‑grapheme emojis
};
```

`configure()` simply does:

```js
module.exports.configure = (overrides = {}) =>
  class EmojiCryptoCustom extends EmojiCrypto {
    static CONFIG = deepMerge(DEFAULT, overrides);
  };
```

## 📚 API Reference


| Method                                       | Description                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| \`new EmojiCrypto(password                   | key[, options])\`                                                                           |
| `encrypt(plaintext[, encoding])`             | Returns emoji string. Optional`encoding`(utf8/hex/b64) treated as plaintext input encoding. |
| `decrypt(emojiCiphertext[, outputEncoding])` | Returns decrypted text (default**utf8**).                                                   |
| `static configure(overrides)`                | **Preferred**helper to produce a tailored subclass.                                         |

## 🔬 How it works

1. **Derive key** — PBKDF2‑SHA‑256 → 256‑bit key (configurable iterations/salt length).
2. **Encrypt** — AES‑256‑GCM with random IV (12 bytes by default).
3. **Map bytes → emojis** — Each ciphertext byte (0‑255) indexes into the 256‑emoji map.
4. **Append auth tag & IV** — Also converted to emoji and concatenated.

Because emojis are multibyte UTF‑8 characters, ciphertext expands \~4× in size, but stays printable, share‑friendly, and—most importantly—fun.

## 🖼 Choosing a custom emoji map

* Exactly **256 distinct single‑grapheme emojis**.
* Avoid skin‑tone variants and multi‑character sequences (flags, ❤️‍🔥, etc.).
* Check with the supplied helper:

```js
import { validateEmojiSet } from 'emoji-crypto/tools';
validateEmojiSet(my256EmojiArray); // throws if not valid
```

## 📝 License

This project is licensed under the [MIT License](https://github.com/ashish13377/Intellido?tab=MIT-1-ov-file)
