/**
 * Type definitions for emoji-crypt
 */

export interface KeyDerivationOptions {
	saltBytes?: number;
	iterations?: number;
	hash?: string;
	keyLen?: number;
}

export interface ConfigOverrides {
	algorithm?: string;
	ivBytes?: number;
	keyDerivation?: KeyDerivationOptions;
	emojiMap?: string[];
}

export type ProgressCallback = (bytesProcessed: number) => void;

export class EmojiCrypto {
	constructor(config?: ConfigOverrides);
	encrypt(
		text: string,
		password: string,
		opts?: { onProgress?: ProgressCallback }
	): { raw: string; emoji: string };
	decrypt(
		emojiText: string,
		password: string,
		opts?: { onProgress?: ProgressCallback }
	): string;
	encryptStream(
		input: NodeJS.ReadableStream,
		password: string
	): NodeJS.ReadableStream;
	decryptStream(
		input: NodeJS.ReadableStream,
		password: string
	): NodeJS.ReadableStream;
}

export function encrypt(
	text: string,
	password: string,
	opts?: { onProgress?: ProgressCallback }
): { raw: string; emoji: string };

export function decrypt(
	emojiText: string,
	password: string,
	opts?: { onProgress?: ProgressCallback }
): string;

export function configure(overrides: ConfigOverrides): EmojiCrypto;

export class EmojiCryptoError extends Error {}
export class ValidationError extends EmojiCryptoError {}
export class AuthenticationError extends EmojiCryptoError {}
