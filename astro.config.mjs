// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';
import starlightLlmsTxt from '@rttnd/starlight-llms-txt';
import starlightAutoSidebar from 'starlight-auto-sidebar';
import remarkGfm from 'remark-gfm';
import remarkD2Theme from './src/plugins/remark-d2-theme.js';
import astroD2 from 'astro-d2';

// https://astro.build/config
export default defineConfig({
	site: 'https://human-turn.github.io',
	// Фиксированный порт dev-сервера; strictPort — падать при занятом порте, а не брать соседний.
	server: { port: 4321 },
	vite: { server: { strictPort: true } },
	// GFM (таблицы и т.п.) Astro 6 не прокидывает в .mdx — добавляем явно, чтобы MDX унаследовал.
	// Astro 6.4: top-level markdown.remarkPlugins deprecated (удалят в 8.0) — плагины теперь в unified().
	markdown: { gfm: true, processor: unified({ remarkPlugins: [remarkGfm, remarkD2Theme] }) },
	integrations: [
		astroD2({
			layout: 'elk',
			pad: 20,
			skipGeneration: false,
			inline: true,
		}),
		starlight({
			title: 'HumanTurn',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			plugins: [
				starlightClientMermaid(),
				starlightAutoSidebar(),
				starlightLlmsTxt({
					projectName: 'HumanTurn',
					description:
						'Документация по AI-разработке: агенты (Claude Code, Pi), скиллы и MCP, инфраструктура инференса, практика внедрения в командах.',
					// Форк отдаёт по .md на каждую страницу (доступна по URL страницы с .md).
					generatePageMarkdown: true,
					markdownFilePattern: 'replace', // /start.md, а не /start.html.md
					// Нарезка по разделам сайдбара — для больших объёмов LLM тянет нужный кусок,
					// а не весь llms-full.txt.
					customSets: [
						{ label: 'Хронология', paths: ['chronology/**'] },
						{ label: 'Агенты разработки', paths: ['agents/**'] },
						{ label: 'Скиллы', paths: ['skills/**'] },
						{ label: 'MCP', paths: ['mcp/**'] },
						{ label: 'Инфраструктура', paths: ['infra/**'] },
						{ label: 'Прочее', paths: ['misc/**'] },
						{ label: 'Практика внедрения', paths: ['processes/**'] },
						{ label: 'Библиотека блоков', paths: ['library/**'] },
					],
				}),
			],
			customCss: ['./src/styles/gzhel.css'],
			// Тема только светлая: ThemeProvider форсирует light, ThemeSelect убирает переключатель.
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			sidebar: [
				{ slug: 'index' },
				{
					label: 'Хронология',
					items: [{ autogenerate: { directory: 'chronology' } }],
				},
				{
					label: 'Агенты разработки',
					collapsed: false,
					items: [
						{ slug: 'agents' },
						{
							label: 'Claude Code',
							items: [{ autogenerate: { directory: 'agents/claude-code' } }],
						},
						{
							label: 'Pi Coding Agent',
							items: [{ autogenerate: { directory: 'agents/pi' } }],
						},
						{
							label: 'Продвинутые техники',
							items: [{ autogenerate: { directory: 'agents/advanced' } }],
						},
					],
				},
				{
					label: 'Скиллы',
					items: [{ autogenerate: { directory: 'skills' } }],
				},
				{
					label: 'MCP',
					items: [{ autogenerate: { directory: 'mcp' } }],
				},
				{
					label: 'Инфраструктура',
					items: [{ autogenerate: { directory: 'infra' } }],
				},
				{
					label: 'Прочее',
					items: [{ autogenerate: { directory: 'misc' } }],
				},
				{
					label: 'Практика внедрения',
					items: [{ autogenerate: { directory: 'processes' } }],
				},
				{
					label: 'Библиотека блоков',
					items: [{ autogenerate: { directory: 'library' } }],
				},
			],
		}),
	],
});
