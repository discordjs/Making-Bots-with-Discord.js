import path from 'path';
import { defineUserConfig } from 'vuepress-vite';
import type { DefaultThemeOptions, ViteBundlerOptions } from 'vuepress-vite';
import sidebar from './sidebar';
import container from 'markdown-it-container';

const config = defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
	bundler: '@vuepress/vite',
	templateDev: path.join(__dirname, 'templates', 'index.dev.html'),
	templateSSR: path.join(__dirname, 'templates', 'index.ssr.html'),
	lang: 'en-US',
	title: 'discord.js Guide',
	description: 'Imagine a guide... that explores the many possibilities for your discord.js bot.',
	head: [
		['meta', { charset: 'utf-8' }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'theme-color', content: '#3eaf7c' }],
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { property: 'og:title', content: 'discord.js Guide' }],
		['meta', { property: 'og:description', content: 'Imagine a guide... that explores the many possibilities for your discord.js bot.' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:url', content: 'https://discordjs.guide/' }],
		['meta', { property: 'og:locale', content: 'en_US' }],
		['meta', { property: 'og:image', content: '/meta-image.png' }],
	],
	theme: path.join(__dirname, 'theme', 'index.ts'),
	themeConfig: {
		contributors: false,
		sidebar,
		repo: 'discordjs/guide',
		docsDir: 'guide',
		sidebarDepth: 3,
		editLinks: true,
		lastUpdated: true,
		navbar: [
			{
				text: 'Voice',
				link: '/voice/',
			},
			{
				text: 'Documentation',
				link: 'https://discord.js.org/docs/packages/discord.js/stable',
			},
		],
		themePlugins: {
			mediumZoom: false,
		},
	},
	plugins: [],
	extendsMarkdown: md => {
		console.log('hello');
		md.use(container, 'typescript-tip', {
			render: (tokens: { info: string, nesting: number }[], idx: number) => {
				const token = tokens[idx];
				const info = token.info.trim().slice('typescript-tip'.length).trim();
				const content = info || 'TYPESCRIPT';
				if (token.nesting === 1) {
					return `<div class="typescript-tip custom-block"><p class="custom-block-title">${content}</p>\n`;
				}
				return `</div>\n`;
			},
		});
	}
});

const { ALGOLIA_DOCSEARCH_API_KEY, ALGOLIA_DOCSEARCH_APP_ID, GOOGLE_ANALYTICS_ID, NODE_ENV } = process.env;

if (NODE_ENV === 'production' && ALGOLIA_DOCSEARCH_API_KEY && GOOGLE_ANALYTICS_ID) {
	config.plugins.push(
		[
			'@vuepress/plugin-docsearch',
			{
				appId: ALGOLIA_DOCSEARCH_APP_ID,
				apiKey: ALGOLIA_DOCSEARCH_API_KEY,
				indexName: 'discordjs',
				placeholder: 'Search guide',
			},
		],
		[
			'@vuepress/plugin-google-analytics',
			{ id: GOOGLE_ANALYTICS_ID },
		],
	);
}

export default config;
