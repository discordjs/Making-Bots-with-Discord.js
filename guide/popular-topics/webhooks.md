# Webhooks

Webhooks are a way of sending messages to a text channel without having to log in as a bot. Discord.js implements a variety of methods to fetch, create, edit, and use webhooks. In this section you will learn how to create, fetch, edit, and use webhooks.

## What is a webhook

A webhook is a utility discord has added which allows services to send messages directly to a channel without having to use a bot. Discord.js provides two classes for interacting with webhooks, `Webhook` and its standalone structure, `WebhookClient`. There are a variety of differences between them:
- `Webhook`s are returned by methods which fetch them, such as `Guild.fetchWebhooks()` and `TextChannel.fetchWebhooks()`, they require you to already have a normal client to use them.
- `WebhookClient`s are standalone `Webhook`s which do not require you to have a client to use. 

If you would like to read about how to use webhooks through the API without discord.js, you can read about them [here](https://discordapp.com/developers/docs/resources/webhook).

## Detecting webhook messages

Bots receive webhook messages in a text channel normally. You can detect if the message was sent by a webhook by simply checking if the `Message.webhookID` is not `null`. In this example we return if the message was sent by a webhook.

```js
if (message.webhookID) return;
```

If you would like to get the webhook object that sent the message, you can use <branch version="11.x" inline>[`Message.fetchWebhook()`](https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=fetchWebhook)</branch><branch version="12.x" inline>[`Message.fetchWebhook()`](https://discord.js.org/#/docs/main/master/class/Message?scrollTo=fetchWebhook)</branch>.

## Fetching webhooks

::: tip 
Webhook fetching will always make use of promises, and collections, if you do not understand either concepts, revise them and then come back to this section.  You can read about collections [here](/additional-info/collections.md), and promises [here](/additional-info/async-await.md) and [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
:::

### Fetching all webhooks of a guild

If you would like to get all webhooks of a guild you can use <branch version="11.x" inline>[`Guild.fetchWebhook()`](https://discord.js.org/#/docs/main/stable/class/Guild?scrollTo=fetchWebhooks)</branch><branch version="12.x" inline>[`Guild.fetchWebhooks()`](https://discord.js.org/#/docs/main/master/class/Guild?scrollTo=fetchWebhooks)</branch>. This will return a promise which you can resolve into a Collection of `Webhook`s.

### Fetching webhooks of a channel

Webhooks belonging to a channel can be fetched using <branch version="11.x" inline>[`TextChannel.fetchWebhook()`](https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=fetchWebhooks)</branch><branch version="12.x" inline>[`Guild.fetchWebhooks()`](https://discord.js.org/#/docs/main/master/class/TextChannel?scrollTo=fetchWebhooks)</branch>. This will return a promise which you can resolve into a Collection of `Webhook`s. A collection will be returned even if the channel contains a single webhook, if you are certain the channel contains a single webhook, you can resolve the promise and use [`Collection.first()`]https://discord.js.org/#/docs/main/stable/class/Collection?scrollTo=first) to get the webhook.

### Fetching a single webhook

#### Using client

You can fetch a specific webhook using its `id` with <branch version="11.x" inline>[`Client.fetchWebhook()`](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=fetchWebhook)</branch><branch version="12.x" inline>[`Client.fetchWebhook()`](https://discord.js.org/#/docs/main/master/class/Client?scrollTo=fetchWebhook)</branch>. You can obtain the webhook id by looking at its link, the number after `https://discordapp.com/api/webhooks/` is the `id`, and the part after that is the `token`.

#### Using the WebhookClient constructor

If you are not using a client, you can get a webhook by simply creating a new instance of `WebhookClient` and passing the `id` and `token` into the constructor. This does not require you to have a client or bot, but it also offers limited information as opposed to fetching it using an authorized client.

```js
const webhookClient = new Discord.WebhookClient('id', 'token');
```

## Creating webhooks

Discord.js provides a method for creating webhooks called <branch version="11.x" inline>[`TextChannel.createWebhook()`](https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=createWebhook)</branch><branch version="12.x" inline>[`TextChannel.createWebhook()`](https://discord.js.org/#/docs/main/master/class/TextChannel?scrollTo=createWebhook)</branch>.

```js
channel.createWebhook('Snek', 'https://i.imgur.com/IgscS45.jpg')
  .then(webhook => console.log(`Created webhook ${webhook}`))
  .catch(console.error);
```

## Editing webhooks

<branch version="11.x">

You can edit Webhooks and WebhookClients to change their avatar and name using [`Webhook.edit()`](https://discord.js.org/#/docs/main/stable/class/Webhook?scrollTo=edit) and [`WebhookClient.edit()`](https://discord.js.org/#/docs/main/stable/class/WebhookClient?scrollTo=edit).

```js
webhook.edit('Snek', 'https://i.imgur.com/IgscS45.jpg')
	.then(webhook => console.log(`Edited webhook ${webhook}`))
	.catch(console.error);
```

</branch>
<branch version="12.x">

You can edit Webhooks and WebhookClients to change their name, avatar, and channel using [`Webhook.edit()`](https://discord.js.org/#/docs/main/master/class/Webhook?scrollTo=edit).

```js
webhook.edit({
	name: 'snek',
	avatar: 'https://i.imgur.com/IgscS45.jpg',
	channel: '222197033908436994',
}).then(webhook => console.log(`Edited webhook ${webhook}`)).catch(console.error);
```

</branch>

## Using webhooks

Webhooks, unlike bots, can send more than one embed per message, up to 10. They can also send attachments and normal content. The <branch version="11.x" inline> [`Webhook.send()`](https://discord.js.org/#/docs/main/stable/class/Webhook?scrollTo=send)</branch><branch version="12.x" inline>[`Webhook.send()`](https://discord.js.org/#/docs/main/master/class/Webhook?scrollTo=send)</branch> method to send to a webhook is very similar to the method for sending to a text channel. Webhooks can also change their name and avatar when sending a message.

<branch version="11.x">

Example using a WebhookClient:

```js
const Discord = require('discord.js');
const config = require('./config.json');

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

const embed = new Discord.RichEmbed()
	.setTitle('Webhooks are very cool')
	.setColor('GREEN');

webhookClient.send('Webhook test', {
	username: 'burger',
	avatarURL: 'https://i.imgur.com/0lYWsg9.jpg',
	embeds: [embed],
});
```

Example using a Webhook:

```js
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

const embed = new Discord.RichEmbed()
	.setTitle('Webhooks are very cool')
	.setColor('GREEN');

client.once('ready', async () => {
	const channel = client.channels.get('222197033908436994');
	try {
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send('Webhook test', {
			username: 'burger',
			avatarURL: 'https://i.imgur.com/0lYWsg9.jpg',
			embeds: [embed],
		});
	} catch (error) {
		console.error('Error trying to send: ', error);
	}
});

client.login(token);
```

</branch>
<branch version="12.x">

Example using a WebhookClient:

```js
const Discord = require('discord.js');
const config = require('./config.json');

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

const embed = new Discord.MessageEmbed()
	.setTitle('Webhooks are very cool')
	.setColor('GREEN');

webhookClient.send('Webhook test', {
	username: 'burger',
	avatarURL: 'https://i.imgur.com/0lYWsg9.jpg',
	embeds: [embed],
});
```

Example using a Webhook:

```js
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

const embed = new Discord.MessageEmbed()
	.setTitle('Webhooks are very cool')
	.setColor('GREEN');

client.once('ready', async () => {
	const channel = client.channels.get('222197033908436994');
	try {
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send('Webhook test', {
			username: 'burger',
			avatarURL: 'https://i.imgur.com/0lYWsg9.jpg',
			embeds: [embed],
		});
	} catch (error) {
		console.error('Error trying to send: ', error);
	}
});

client.login(token);
```
</branch>

