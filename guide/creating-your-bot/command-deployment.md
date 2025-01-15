# Registering slash commands

::: tip
For fully functional slash commands, you need three important pieces of code:

1. The [individual command files](slash-commands), containing their definitions and functionality.
2. The [command handler](command-handling), which dynamically reads the files and executes the commands.
3. The command deployment script, to register your slash commands with Discord so they appear in the interface.

These steps can be done in any order, but **all are required** before the commands are fully functional.

This page details how to complete **Step 3**. Make sure to also complete the other pages linked above!
:::

## Command registration

Slash commands can be registered in two ways; in one specific guild, or for every guild the bot is in. We're going to look at single-guild registration first, as this is a good way to develop and test your commands before a global deployment.

Your application will need the `applications.commands` scope authorized in a guild for any of its slash commands to appear, and to be able to register them in a specific guild without error.

Slash commands only need to be registered once, and updated when the definition (description, options etc) is changed. As there is a daily limit on command creations, it's not necessary nor desirable to connect a whole client to the gateway or do this on every `ready` event. As such, a standalone script using the lighter REST manager is preferred. 

This script is intended to be run separately, only when you need to make changes to your slash command **definitions** - you're free to modify parts such as the execute function as much as you like without redeployment. 

### Guild commands

Create a `deploy-commands.js` file in your project directory. This file will be used to register and update the slash commands for your bot application.

Add two more properties to your `config.json` file, which we'll need in the deployment script:

- `clientId`: Your application's client id ([Discord Developer Portal](https://discord.com/developers/applications) > "General Information" > application id)
- `guildId`: Your development server's id ([Enable developer mode](https://support.discord.com/hc/en-us/articles/206346498) > Right-click the server title > "Copy ID")

```json
{
	"token": "your-token-goes-here",
	"clientId": "your-application-id-goes-here",
	"guildId": "your-server-id-goes-here"
}
```

::: typescript-tip
Don't forget to update `src/types/Config.ts` and add the additional properties to the type declaration.
:::

With these defined, you can use the deployment script below:

<!-- eslint-skip -->

:::: code-group
::: code-group-item js
```js
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
```
:::
::: code-group-item ts
```ts
import { REST, Routes } from 'discord.js';
import { Config, assertObjectIsConfig } from './types/Config';
import fs from 'node:fs';
import path from 'node:path';

const configRaw = fs.readFileSync('./config.json', { encoding: 'utf-8' });
const config = JSON.parse(configRaw);

assertObjectIsConfig(config);

const { clientId, guildId, token } = config;

(async () => {
	const commands = [];
	// Grab all the command folders from the commands directory you created earlier
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		// Grab all the command files from the commands directory you created earlier
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const { default: command } = await import(filePath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(token);

	// and deploy your commands!
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
```
:::
::::

Once you fill in these values, run `node deploy-commands.js` in your project directory to register your commands to the guild specified. If you see the success message, check for the commands in the server by typing `/`! If all goes well, you should be able to run them and see your bot's response in Discord!

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

### Global commands

Global application commands will be available in all the guilds your application has the `applications.commands` scope authorized in, and in direct messages by default.

To deploy global commands, you can use the same script from the [guild commands](#guild-commands) section and simply adjust the route in the script to `.applicationCommands(clientId)`

<!-- eslint-skip -->

```js {2}
await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);
```

### Where to deploy

::: tip
Guild-based deployment of commands is best suited for development and testing in your own personal server. Once you're satisfied that it's ready, deploy the command globally to publish it to all guilds that your bot is in.

You may wish to have a separate application and token in the Discord Dev Portal for your dev application, to avoid duplication between your guild-based commands and the global deployment.
:::

#### Further reading

You've successfully sent a response to a slash command! However, this is only the most basic of command event and response functionality. Much more is available to enhance the user experience including:

* applying this same dynamic, modular handling approach to events with an [Event handler](/creating-your-bot/event-handling.md).
* utilising the different [Response methods](/slash-commands/response-methods.md) that can be used for slash commands.
* expanding on these examples with additional validated option types in [Advanced command creation](/slash-commands/advanced-creation.md).
* adding formatted [Embeds](/popular-topics/embeds.md) to your responses.
* enhancing the command functionality with [Buttons](/message-components/buttons) and [Select Menus](/message-components/select-menus).
* prompting the user for more information with [Modals](/interactions/modals.md).

#### Resulting code

<ResultingCode path="creating-your-bot/command-deployment" />
