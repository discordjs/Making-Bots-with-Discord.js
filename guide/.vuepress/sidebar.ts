export default {
	'/voice/': [
		{
			text: 'Home',
			children: [
				'/',
				'/requesting-more-content.md',
				'/whats-new.md',
			],
		},
		{
			text: 'Getting Started',
			children: [
				'/voice/',
			],
		},
		{
			text: 'Library',
			children: [
				'/voice/life-cycles.md',
				'/voice/voice-connections.md',
				'/voice/audio-player.md',
				'/voice/audio-resources.md',
			],
		},
	],
	'/': [
		{
			text: 'Home',
			children: [
				'/',
				'/requesting-more-content.md',
				'/whats-new.md',
			],
		},
		{
			text: 'Installations & Preparations',
			children: [
				'/preparations/',
				'/preparations/setting-up-a-linter.md',
				'/preparations/setting-up-a-bot-application.md',
				'/preparations/adding-your-bot-to-servers.md',
			],
		},
		{
			text: 'Creating Your Bot',
			children: [
				'/creating-your-bot/',
				'/creating-your-bot/main-file.md',
				'/creating-your-bot/slash-commands.md',
				'/creating-your-bot/command-handling.md',
				'/creating-your-bot/command-deployment.md',
				'/creating-your-bot/event-handling.md',
			],
		},
		{
			text: 'Additional Features',
			children: [
				'/additional-features/cooldowns.md',
				'/additional-features/reloading-commands.md',
			]
		},
		{
			text: 'Slash Commands',
			children: [
				'/slash-commands/response-methods.md',
				'/slash-commands/advanced-creation.md',
				'/slash-commands/parsing-options.md',
				'/slash-commands/permissions.md',
				'/slash-commands/autocomplete.md',
				'/slash-commands/deleting-commands.md'
			]
		},
		{
			text: 'Message Components',
			children: [
				'/message-components/action-rows.md',
				'/message-components/buttons.md',
				'/message-components/select-menus.md',
				'/message-components/interactions.md',
			]
		},
		{
			text: 'Other Interactions',
			children: [
				'/interactions/modals.md',
				'/interactions/context-menus.md',
			]
		},
		{
			text: 'Popular Topics',
			children: [
				'/popular-topics/faq.md',
				'/popular-topics/audit-logs.md',
				'/popular-topics/canvas.md',
				'/popular-topics/collectors.md',
				'/popular-topics/embeds.md',
				'/popular-topics/errors.md',
				'/popular-topics/formatters.md',
				'/popular-topics/intents.md',
				'/popular-topics/partials.md',
				'/popular-topics/permissions.md',
				'/popular-topics/permissions-extended.md',
				'/popular-topics/reactions.md',
				'/popular-topics/threads.md',
				'/popular-topics/webhooks.md',
			],
		},
		{
			text: 'Miscellaneous',
			children: [
				'/miscellaneous/cache-customization.md',
				'/miscellaneous/useful-packages.md',
			],
		},
		{
			text: 'Databases',
			children: [
				'/sequelize/',
				'/sequelize/currency.md',
				'/keyv/',
			],
		},
		{
			text: 'Sharding',
			children: [
				'/sharding/',
				'/sharding/additional-information.md',
				'/sharding/extended.md',
			],
		},
		{
			text: 'OAuth2',
			children: [
				'/oauth2/',
			],
		},
		{
			text: 'Improving Your Dev Environment',
			children: [
				'/improving-dev-environment/pm2.md',
				'/improving-dev-environment/package-json-scripts.md',
			],
		},
		{
			text: 'Additional Information',
			children: [
				'/additional-info/notation.md',
				'/additional-info/es6-syntax.md',
				'/additional-info/collections.md',
				'/additional-info/async-await.md',
				'/additional-info/rest-api.md',
				'/additional-info/updating-from-v14.md',
			],
		},
	],
};
