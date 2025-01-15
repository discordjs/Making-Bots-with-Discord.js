# Event handling

Node.js uses an event-driven architecture, making it possible to execute code when a specific event occurs. The discord.js library takes full advantage of this. You can visit the <DocsLink path="Client:Class" /> documentation to see the full list of events.

::: tip
This page assumes you've followed the guide up to this point, and created your `index.js` and individual slash commands according to those pages.
:::

At this point, your `index.js` file has listeners for two events: `ClientReady` and `InteractionCreate`.

:::: code-group
::: code-group-item ClientReady
```js
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
```
:::
::: code-group-item InteractionCreate
```js
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});
```
:::
::::

Currently, the event listeners are in the `index.js` file. <DocsLink path="Client:Class#ready" /> emits once when the `Client` becomes ready for use, and <DocsLink path="Client:Class#interactionCreate" /> emits whenever an interaction is received. Moving the event listener code into individual files is simple, and we'll be taking a similar approach to the [command handler](/creating-your-bot/command-handling.md).

::: warning
You're only going to move these two events from `index.js`. The code for [loading command files](/creating-your-bot/command-handling.html#loading-command-files) will stay here!
:::

## Individual event files

Your project directory should look something like this:

:::: code-group
::: code-group-item js
```:no-line-numbers
discord-bot/
├── commands/
├── node_modules/
├── config.json
├── deploy-commands.js
├── index.js
├── package-lock.json
└── package.json
```
:::
::: code-group-item ts
```:no-line-numbers
discord-bot/
├── node_modules
├── src
	├── types
		├── Config.ts
	├── index.ts
├── config.json
├── tsconfig.json
├── package-lock.json
└── package.json
```
:::
::::


Create an `events` folder in the same directory. You can then move the code from your event listeners in `index.js` to separate files: `events/ready.js` and `events/interactionCreate.js`.

:::: code-group
::: code-group-item events/ready.js
```js
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
```
:::
::: code-group-item events/interactionCreate.js
```js
const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};
```
:::
::: code-group-item index.js (after)
```js
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.login(token);
```
:::
::: code-group-item src/types/EventHandler.ts
```ts
import { BaseInteraction, Events } from 'discord.js';

export interface EventHandler {
	name: Events;
	once?: boolean;
	execute: (...args: unknown[]) => Promise<void>;
}
```
:::
::: code-groupitem src/events/ready.ts
```ts
import { Events } from 'discord.js';
import { EventHandler } from '../types/EventHandler';

const eventHandler: EventHandler = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
```
:::
::: code-group-item events/ready.ts
```js
import { Events } from 'discord.js';
import { EventHandler } from '../../types/EventHandler';

const eventHandler: EventHandler = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

export default eventHandler;
```
:::
::: code-group-item src/events/interactionCreate.ts
```ts
import { Events } from 'discord.js';
import { EventHandler } from '../types/EventHandler';

const eventHandler: EventHandler = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
}

export default eventHandler;
```
:::
::::

The `name` property states which event this file is for, and the `once` property holds a boolean value that specifies if the event should run only once. You don't need to specify this in `interactionCreate.js` as the default behavior will be to run on every event instance. The `execute` function holds your event logic, which will be called by the event handler whenever the event emits.

## Reading event files

Next, let's write the code for dynamically retrieving all the event files in the `events` folder. We'll be taking a similar approach to our [command handler](/creating-your-bot/command-handling.md). Place the new code highlighted below in your `index.js`.

`fs.readdirSync().filter()` returns an array of all the file names in the given directory and filters for only `.js` files, i.e. `['ready.js', 'interactionCreate.js']`.

:::: code-group
::: code-group-item js
```js {26-37}
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);
```
:::
::: code-group-item ts
```ts
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { ExtendedClient } from './structures/ExtendedClient';
import { Config, assertObjectIsConfig } from './types/Config';

// Read the config file
const configRaw = fs.readFileSync('../config.json', { encoding: 'utf-8' });
const config = JSON.parse(configRaw);

assertObjectIsConfig(config);

const { token } = config;

// ExtendedClient's second `commands` parameter defaults to an empty Collection
const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });

const foldersPath = path.join(__dirname, '../build/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		import(filePath).then(module => {
            const command = module.default;
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        });
	}
}

const eventsPath = path.join(__dirname, '../build/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	import(filePath).then(module => {
		const event = module.default;

		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	});
}

client.login(token);
```
:::
::::

You'll notice the code looks very similar to the command loading above it - read the files in the events folder and load each one individually.

The <DocsLink path="Client:Class" /> class in discord.js extends the [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) class. Therefore, the `client` object exposes the [`.on()`](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener) and [`.once()`](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener) methods that you can use to register event listeners. These methods take two arguments: the event name and a callback function. These are defined in your separate event files as `name` and `execute`.

The callback function passed takes argument(s) returned by its respective event, collects them in an `args` array using the `...` [rest parameter syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters), then calls `event.execute()` while passing in the `args` array using the `...` [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). They are used here because different events in discord.js have different numbers of arguments. The rest parameter collects these variable number of arguments into a single array, and the spread syntax then takes these elements and passes them to the `execute` function.

After this, listening for other events is as easy as creating a new file in the `events` folder. The event handler will automatically retrieve and register it whenever you restart your bot.

::: tip
In most cases, you can access your `client` instance in other files by obtaining it from one of the other discord.js structures, e.g. `interaction.client` in the `interactionCreate` event. You do not need to manually pass it to your events.
:::

## Resulting code

<ResultingCode />
