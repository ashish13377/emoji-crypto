import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: {
			ecmaVersion: "latest",
		},
	},
	{
		files: ["**/*.js"],
		languageOptions: {
			sourceType: "commonjs",
		},
	},
	{
		files: ["test/**/*.js", "**/*.test.js"],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
		},
	},
	{
		files: ["examples/**/*.js"], // ⬅️ NEW BLOCK for your example scripts
		languageOptions: {
			globals: {
				...globals.node, // enables `console`, `process`, `Buffer`, etc.
			},
		},
	},
]);
