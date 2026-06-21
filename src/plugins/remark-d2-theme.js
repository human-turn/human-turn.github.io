/**
 * Remark plugin: prepend Gzhel theme vars to every ```d2 code block.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { visit } from 'unist-util-visit';

const __dirname = dirname(fileURLToPath(import.meta.url));
const themePath = resolve(__dirname, '../styles/d2-gzhel-theme.d2');

let themeVars = null;

export default function remarkD2Theme() {
	return (tree) => {
		if (themeVars === null) {
			themeVars = readFileSync(themePath, 'utf-8');
		}

		visit(tree, 'code', (node) => {
			if (node.lang === 'd2' && !node.value.includes('vars:')) {
				node.value = `${themeVars}\n${node.value}`;
			}
		});
	};
}
