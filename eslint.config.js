// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';

export default [
	{ ignores: ['dist/**', '.astro/**', '.playwright-mcp/**'] },
	js.configs.recommended,
	// Node-окружение для конфигов и скриптов сборки.
	{ files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: { ...globals.node } } },
	// TS-правила и парсер — только для TS-файлов, чтобы не цеплять .js/.mjs/.astro.
	...tseslint.configs.recommended.map((config) => ({ ...config, files: ['**/*.ts', '**/*.tsx'] })),
	...eslintPluginAstro.configs.recommended,
	// a11y-набор (eslint-plugin-jsx-a11y) пока не поддерживает ESLint 10 — вернуть, когда догонит (issue #1075).
	// Должен идти последним: отключает правила, конфликтующие с Prettier.
	prettier,
];
