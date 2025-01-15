# Creating the main file

::: tip
This page assumes you've already prepared the [configuration files](/creating-your-bot/#creating-configuration-files) from the previous page. We're using the `config.json` approach, however feel free to substitute your own!
:::

Open your code editor and create a new file. We suggest that you save the file as `index.js`, but you may name it whatever you wish.

Here's the base code to get you started:

:::: code-group
::: code-group-item js
```js
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
```
:::
::: code-group-item ts
```ts
// Import the necessary discord.js classes
import { readFileSync } from 'node:fs';
import { Client, Events, GatewayInventBits } from 'discord.js';
import { Config } from './src/types/Config';

// Read the config file
const configRaw = fs.readFileSync('../config.json', { encoding: 'utf-8' });
const configUnsafe = JSON.parse(configRaw);
const config: Config = JSON.parse(configRaw);

const { token } = config;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
```
::::

::: typescript-tip
When using Typescript, the code will look slightly different. First, TypeScript uses ECMAScript Modules, not CommonJS Modules, which means the module import/export syntax is different. Additionally, Node's default ESM loader does not support importing JSON files into objects. Because of this, we'll need to use the `fs` module to read the file, and then use `JSON.parse` to turn the read JSON string into an object.
:::

This is how you create a client instance for your Discord bot and log in to Discord. The `GatewayIntentBits.Guilds` intents option is necessary for the discord.js client to work as you expect it to, as it ensures that the caches for guilds, channels, and roles are populated and available for internal use.

::: tip
The term "guild" is used by the Discord API and in discord.js to refer to a Discord server.
:::

Intents also define which events Discord should send to your bot, and you may wish to enable more than just the minimum. You can read more about the other intents on the [Intents topic](/popular-topics/intents).

## Running your application

Open your terminal and run `node index.js` to start the process. If you see "Ready!" after a few seconds, you're good to go! The next step is to start adding [slash commands](/creating-your-bot/slash-commands.md) to develop your bot's functionality.

::: tip
You can open your `package.json` file and edit the `"main": "index.js"` field to point to your main file. You can then run `node .` in your terminal to start the process!

After closing the process with `Ctrl + C`, you can press the up arrow on your keyboard to bring up the latest commands you've run. Pressing up and then enter after closing the process is a quick way to start it up again.
:::

::: typescript-tip
You'll need to run the compiled code, not the TypeScript code. If following the guide so far, you'll have a `package.json` with a `scripts` entry called `start` that starts the application. Call this script by running `npm run start`.
:::

#### Resulting code

<ResultingCode path="creating-your-bot/initial-files" />