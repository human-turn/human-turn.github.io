// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
export default defineConfig({
	site: 'https://human-turn.github.io',
	// GFM (таблицы и т.п.) Astro 6 не прокидывает в .mdx — добавляем явно, чтобы MDX унаследовал.
	markdown: { remarkPlugins: [remarkGfm] },
	integrations: [
		starlight({
			title: 'HumanTurn',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			plugins: [starlightClientMermaid()],
			sidebar: [
				{ label: 'Старт', items: [{ autogenerate: { directory: 'start' } }] },
				{ label: 'Инфраструктура', items: [{ autogenerate: { directory: 'infra' } }] },
				{ label: 'Инструменты', items: [{ autogenerate: { directory: 'tools' } }] },
				{ label: 'Концепты и практики', items: [{ autogenerate: { directory: 'concepts' } }] },
				{ label: 'Библиотека', items: [{ autogenerate: { directory: 'library' } }] },
			],
		}),
	],
});
