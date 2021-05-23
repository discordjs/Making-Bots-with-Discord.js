import path from 'path'
import { defineUserConfig } from 'vuepress-vite'
import type { DefaultThemeOptions, ViteBundlerOptions } from 'vuepress-vite'
import sidebar from './sidebar'

export default defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
	bundler: '@vuepress/vite',
	lang: 'en-US',
	title: 'Discord.js Guide',
	description: 'A guide made by the community of discord.js for its users.',
	head: [
		['meta', { charset: 'utf-8' }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'theme-color', content: '#42b983' }],
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { name: 'og:title', content: 'Discord.js Guide' }],
		['meta', { name: 'og:description', content: 'A guide made by the community of discord.js for its users.' }],
		['meta', { name: 'og:type', content: 'website' }],
		['meta', { name: 'og:url', content: 'https://discordjs.guide/' }],
		['meta', { name: 'og:locale', content: 'en_US' }],
		['meta', { name: 'og:image', content: '/meta-image.png' }],
	],
	themeConfig: {
		sidebar,
		repo: 'discordjs/guide',
		docsDir: 'docs',
		docsBranch: 'guide',
		sidebarDepth: 3,
		editLinks: true,
		lastUpdated: true,
		navbar: [
			{
				text: 'Commando',
				link: '/commando/',
			},
			{
				text: 'Documentation',
				link: 'https://discord.js.org/#/docs/main/stable/general/welcome',
			},
		],
	},
	// plugins: [
	// 	['@vuepress/plugin-search'],
	// ],
})