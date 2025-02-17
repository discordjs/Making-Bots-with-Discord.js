# Cooldowns

Spam is something you generally want to avoid, especially if one of your commands require calls to other APIs or takes a bit of time to build/send.

::: tip
This section assumes you followed the [Command Handling](/creating-your-bot/command-handling.md) part.
:::

First, add a cooldown property to your command. This will determine how long the user would have to wait (in seconds) before using the command again.

```js {4}
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// ...
	},
};
```

In your main file, initialize a [Collection](/additional-info/collections.md) to store cooldowns of commands:

```js
client.cooldowns = new Collection();
```

::::: ts-tip
You'll also need to edit the definitions for `ExtendedClient` and `SlashCommand`:
:::: code-group
::: code-group-item src/types/ExtendedClient.ts
```ts
import { Client, ClientOptions, Collection } from 'discord.js';
import { SlashCommand } from '../types/SlashCommand';

export class ExtendedClient extends Client {
    constructor(
		options: ClientOptions,
		public commands: Collection<string, SlashCommand> = new Collection(),
		public cooldowns: Collection<string, Collection<string, number>> = new Collection(),
	) {
        super(options);
    }
}
```
:::
::: code-group-item src/types/SlashCommand.ts
```ts{6}
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  cooldown?: number;
}
```
:::
::::
:::::

The key will be the command names, and the values will be Collections associating the user's id (key) to the last time (value) this user used this command. Overall the logical path to get a user's last usage of a command will be `cooldowns > command > user > timestamp`.

In your `InteractionCreate` event, add the following code:

```js {1,3-5,7-10,12-14}
const { cooldowns } = interaction.client;

if (!cooldowns.has(command.data.name)) {
	cooldowns.set(command.data.name, new Collection());
}

const now = Date.now();
const timestamps = cooldowns.get(command.data.name);
const defaultCooldownDuration = 3;
const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

if (timestamps.has(interaction.user.id)) {
	// ...
}

try {
	// ...
} catch (error) {
	// ...
}
```

::: ts-tip
You'll need to use a type assertion on `interaction.client` to get the correct type:
```ts
const { cooldowns } = interaction.client as ExtendedClient;
```
:::

::: ts-tip
You may need to add non-null assertions around the code (notice the `!` at the end of the line):
```ts
const timestamps = cooldowns.get(command.data.name)!;
```
:::

You check if the `cooldowns` Collection already has an entry for the command being used. If this is not the case, you can add a new entry, where the value is initialized as an empty Collection. Next, create the following variables:

1. `now`: The current timestamp.
2. `timestamps`: A reference to the Collection of user ids and timestamp key/value pairs for the triggered command.
3. `cooldownAmount`: The specified cooldown for the command, converted to milliseconds for straightforward calculation. If none is specified, this defaults to three seconds.

If the user has already used this command in this session, get the timestamp, calculate the expiration time, and inform the user of the amount of time they need to wait before using this command again. Note the use of the `return` statement here, causing the code below this snippet to execute only if the user has not used this command in this session or the wait has already expired.

Continuing with your current setup, this is the complete `if` statement:

```js {2-7}
if (timestamps.has(interaction.user.id)) {
	const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

	if (now < expirationTime) {
		const expiredTimestamp = Math.round(expirationTime / 1_000);
		return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral });
	}
}
```

Since the `timestamps` Collection has the user's id as the key, you can use the `get()` method on it to get the value and sum it up with the `cooldownAmount` variable to get the correct expiration timestamp and further check to see if it's expired or not.

The previous user check serves as a precaution in case the user leaves the guild. You can now use the `setTimeout` method, which will allow you to execute a function after a specified amount of time and remove the timeout.

```js {5-6}
if (timestamps.has(interaction.user.id)) {
	// ...
}

timestamps.set(interaction.user.id, now);
setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
```

This line causes the entry for the user under the specified command to be deleted after the command's cooldown time has expired for them.


### TypeScript
If you're using TypeScript, the setup will be similar but slightly different.

First, if you've been following the guide so far, you have a structure called `ExtendedClient`. Similar to how we've added commands to this structure, we'll need to modify this structure to support cooldowns:
```ts {5-8}
import { Client, ClientOptions, Collection } from 'discord.js';
import { SlashCommand } from '../types/SlashCommand';

export class ExtendedClient extends Client {
    constructor(options: ClientOptions,
		public commands: Collection<string, SlashCommand> = new Collection(),
		public cooldowns: Collection<string, Collection<string, Date>> = new Collection(),
	) {
        super(options);
    }
}
```

Next, we'll need to modify `SlashCommand.ts`:
```ts {4}
import { SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
	cooldown?: number;
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
```

Finally, we'll need to add cooldowns to each command that should support one:
```ts {5}
import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types/SlashCommand';

const command: SlashCommand = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// ...
	},
};

export default command;
```

The rest of the code in the `InteractionCreate` event is almost the same as the JavaScript code shown above, with one small change -- you'll need to use a type assertion to get the correct `ExtendedClient` type:
```ts
const { cooldowns } = interaction.client as ExtendedClient;
```
## Resulting code

<ResultingCode path="additional-features/cooldowns" />