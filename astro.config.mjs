// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{ slug: 'getting-started', label: 'Начало работы' },
				{ label: 'Туториалы', items: [{ autogenerate: { directory: 'tutorials' } }] },
				{ label: 'Руководства', items: [{ autogenerate: { directory: 'guides' } }] },
				{ label: 'Справочник', items: [{ autogenerate: { directory: 'reference' } }] },
				{ label: 'Концепции', items: [{ autogenerate: { directory: 'explanation' } }] },
			],
		}),
	],
});
