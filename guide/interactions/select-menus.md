# Select menus

With the components API, you can create interactive message components. On this page, we'll cover how to send, receive, and respond to select menus using discord.js!

::: tip
This page is a follow-up to the [slash commands](/slash-commands/advanced-creation.md) section. Please carefully read those pages first so that you can understand the methods used in this section.
:::

## Building and sending select menus

Select menus are one of the `MessageComponent` classes, which can be sent via messages or interaction responses. A select menu, as any other message component, must be in an `ActionRow`.

::: warning
You can have a maximum of five `ActionRow`s per message, and one select menu within an `ActionRow`.
:::

To create a select menu, use the <DocsLink path="class/ActionRowBuilder"/> and <DocsLink path="class/StringSelectMenuBuilder"/> classes. Then, pass the resulting row object to <DocsLink path="class/ChatInputCommandInteraction?scrollTo=reply" type="method"/> in the `components` array of <DocsLink path="typedef/InteractionReplyOptions" />:

```js {1,7-24,26}
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
					),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});
```

::: tip
The custom id is a developer-defined string of up to 100 characters. Use this field to ensure you can uniquely define all incoming interactions from your select menus!
:::

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<!--- vue-discord-message doesn't yet have support for select menus
<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>
-->
![select](./images/select.png)

You can also send message components within an ephemeral response or alongside message embeds.

```js {1,12-16,18}
const { ActionRowBuilder, EmbedBuilder, Events, StringSelectMenuBuilder } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				// ...
			);

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Some title')
			.setURL('https://discord.js.org/')
			.setDescription('Some description here');

		await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
	}
});
```

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<!--- vue-discord-message doesn't yet have support for select menus
<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
				:ephemeral="true"
			>ping</DiscordInteraction>
		</template>
		Pong! (+ components)
		<template #embeds>
			<DiscordEmbed
				border-color="#0099ff"
				embed-title="Some title"
				url="https://discord.js.org"
			>
				Some description here
			</DiscordEmbed>
		</template>
	</DiscordMessage>
</DiscordMessages>
-->
![selectephem](./images/selectephem.png)

::: warning
If you're using TypeScript you'll need to specify the type of components your action row holds. This can be done by specifying the component builder you will add to it using a generic parameter in <DocsLink path="class/ActionRowBuilder"/>.

```diff
- new ActionRowBuilder()
+ new ActionRowBuilder<StringSelectMenuBuilder>()
```
:::

Now you know all there is to building and sending a `SelectMenu`! Let's move on to how to receive menus!

## Receiving select menu interactions

### Component collectors

Message component interactions can be collected within the scope of the slash command that sent them by utilising an <DocsLink path="class/InteractionCollector"/>, or their promisified `awaitMessageComponent` variant. These both provide instances of the <DocsLink path="class/MessageComponentInteraction"/> class as collected items.

::: tip
You can create the collectors on either a `message` or a `channel`.
:::

For a detailed guide on receiving message components via collectors, please refer to the [collectors guide](/popular-topics/collectors.md#interaction-collectors).

### The interactionCreate event

To receive a <DocsLink path="class/StringSelectMenuInteraction"/>, attach an <DocsLink path="class/Client?scrollTo=e-interactionCreate" /> event listener to your client and use the <DocsLink path="class/BaseInteraction?scrollTo=isStringSelectMenu" type="method"/> type guard to make sure you only receive select menus:

```js {2}
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isStringSelectMenu()) return;
	console.log(interaction);
});
```

## Responding to select menus

The <DocsLink path="class/MessageComponentInteraction"/> class provides the same methods as the <DocsLink path="class/ChatInputCommandInteraction"/> class. These methods behave equally:
- `reply()`
- `editReply()`
- `deferReply()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

### Updating the select menu's message

The <DocsLink path="class/MessageComponentInteraction"/> class provides an <DocsLink path="class/MessageComponentInteraction?scrollTo=update" type="method"/> method to update the message the select menu is attached to. Passing an empty array to the `components` option will remove any menus after an option has been selected.

This method should be used in favour of `editReply()` on the original interaction, to ensure you respond to the select menu interaction.

```js {1,4-6}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	if (interaction.customId === 'select') {
		await interaction.update({ content: 'Something was selected!', components: [] });
	}
});
```

### Deferring and updating the select menu's message

Additionally to deferring the response of the interaction, you can defer the menu, which will trigger a loading state and then revert back to its original state:

```js {1,6-10}
const wait = require('node:timers/promises').setTimeout;

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	if (interaction.customId === 'select') {
		await interaction.deferUpdate();
		await wait(4000);
		await interaction.editReply({ content: 'Something was selected!', components: [] });
	}
});
```

## Multi-select menus

A select menu is not bound to only one selection; you can specify a minimum and maximum amount of options that must be selected. You can use <DocsLink path="class/StringSelectMenuBuilder?scrollTo=setMinValues" type="method" /> and <DocsLink path="class/StringSelectMenuBuilder?scrollTo=setMaxValues" type="method"/> to determine these values.

```js {1,7-31,33}
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.setMinValues(2)
					.setMaxValues(3)
					.addOptions([
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
						{
							label: 'I am also an option',
							description: 'This is a description as well',
							value: 'third_option',
						},
					]),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});
```

## Accessing select menu interaction values

After receiving your <DocsLink path="class/StringSelectMenuInteraction"/>, you will be able to access the selected values from <DocsLink path="class/StringSelectMenuInteraction?scrollTo=values"/>. This will return an array of string values associated with the selected options in your select menu.

By default, select menus only accept a single selection. You can retrieve the selected value by accessing the first index of the returned array, as demonstrated in the snippet below:

```js {4,6-10}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	const selected = interaction.values[0];

	if (selected === 'ping') {
		await interaction.update('The Ping option has been selected!');
	} else if (selected === 'pong') {
		await interaction.update('The Pong option has been selected!');
	}
});
```

In the case of a multi-select menu, the received <DocsLink path="class/StringSelectMenuInteraction?scrollTo=values"/> may contain more than one value, and should be handled accordingly:

```js {4,6}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	const selected = interaction.values.join(', ');

	await interaction.update(`The user selected ${selected}!`);
});
```
