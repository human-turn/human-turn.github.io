// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
export default defineConfig({
	site: 'https://human-turn.github.io',
	// Фиксированный порт dev-сервера; strictPort — падать при занятом порте, а не брать соседний.
	server: { port: 4321 },
	vite: { server: { strictPort: true } },
	// GFM (таблицы и т.п.) Astro 6 не прокидывает в .mdx — добавляем явно, чтобы MDX унаследовал.
	// Astro 6.4: top-level markdown.remarkPlugins deprecated (удалят в 8.0) — плагины теперь в unified().
	markdown: { processor: unified({ remarkPlugins: [remarkGfm] }) },
	integrations: [
		starlight({
			title: 'HumanTurn',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			plugins: [starlightClientMermaid()],
			customCss: ['./src/styles/gzhel.css'],
			// Тема только светлая: ThemeProvider форсирует light, ThemeSelect убирает переключатель.
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			sidebar: [
				{ label: 'Claude Code', items: [{ autogenerate: { directory: 'start' } }] },
				{ label: 'Харнесс-менеджмент', items: [{ autogenerate: { directory: 'tools' } }] },
				{
					label: 'Инфраструктура: модели и доступ',
					items: [{ autogenerate: { directory: 'infra' } }],
				},
				{
					label: 'Процессы команды',
					items: [{ autogenerate: { directory: 'concepts/processes' } }],
				},
				{
					label: 'Прочие возможности агентов',
					items: [{ autogenerate: { directory: 'concepts/architecture' } }],
				},
				{
					label: 'Продвинутый Claude Code',
					items: [{ autogenerate: { directory: 'claude-code' } }],
				},
				{ label: 'Библиотека блоков', items: [{ autogenerate: { directory: 'library' } }] },
			],
		}),
	],
});
