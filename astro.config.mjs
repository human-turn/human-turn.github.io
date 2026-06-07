// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'HumanTurn',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{ label: 'Старт', items: [{ autogenerate: { directory: 'start' } }] },
				{ label: 'Инфраструктура', items: [{ autogenerate: { directory: 'infra' } }] },
				{ label: 'Инструменты', items: [{ autogenerate: { directory: 'tools' } }] },
				{ label: 'Концепты и практики', items: [{ autogenerate: { directory: 'concepts' } }] },
			],
		}),
	],
});
