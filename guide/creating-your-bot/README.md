# Configuration files

Once you [add your bot to a server](/preparations/adding-your-bot-to-servers.md), the next step is to start coding and get it online! Let's start by creating a config file for your client token and a main file for your bot application.

As explained in the ["What is a token, anyway?"](/preparations/setting-up-a-bot-application.md#what-is-a-token-anyway) section, your token is essentially your bot's password, and you should protect it as best as possible. This can be done through a `config.json` file or by using environment variables.

Open your application in the [Discord Developer Portal](https://discord.com/developers/applications) and go to the "Bot" page to copy your token.

## Using `config.json`

Storing data in a `config.json` file is a common way of keeping your sensitive values safe. Create a `config.json` file in your project directory and paste in your token. You can access your token inside other files by using `require()`.

:::: code-group
::: code-group-item config.json
```json
{
	"token": "your-token-goes-here"
}
```
:::
::: code-group-item Usage
```js
const { token } = require('./config.json');

console.log(token);
```
:::
::::

::: danger
If you're using Git, you should not commit this file and should [ignore it via `.gitignore`](/creating-your-bot/#git-and-gitignore).
:::

::: typescript-tip
You'll also want to create an interface for your config so you can get type checking when using config values. Create a file called `Config.ts` under `src/types` with the following contents:
```ts
export interface Config {
	token: string;
	guildId: string;
	// Other values can be added here
}

// Set up a rudimentary assertion function to type assert values
export function assertObjectIsConfig(obj: unknown): asserts obj is Config {
	if (obj === null || obj === undefined) {
		throw new TypeError('config cannot be null/undefined.');
	}

	const expectedValues = [
		{
			key: 'token',
			type: 'string',
		},
		{
			key: 'guildId',
			type: 'string',
		},
	]; // Add more keys if necessary

    if (typeof obj !== 'object') {
		throw new TypeError('config must be an object.');
    }

	for (const { key, type } of expectedValues) {
		const value = (obj as Record<string, unknown>)[key];
		if (typeof value !== type) {
			throw new TypeError(`Expected '${key}' to be of type '${type}', but received '${typeof value}'`);
		}
	}
}
```

Note that we manually validated the `obj` parameter in the assertion function `objectIsConfig`. A cleaner, more robust approach would be to use a validation library to handle this, though this is outside the scope of this guide.
:::

## Using environment variables

Environment variables are special values for your environment (e.g., terminal session, Docker container, or environment variable file). You can pass these values into your code's scope so that you can use them.

One way to pass in environment variables is via the command line interface. When starting your app, instead of `node index.js`, use `TOKEN=your-token-goes-here node index.js`. You can repeat this pattern to expose other values as well.

You can access the set values in your code via the `process.env` global variable, accessible in any file. Note that values passed this way will always be strings and that you might need to parse them to a number, if using them to do calculations.

:::: code-group
::: code-group-item Command line
```sh:no-line-numbers
A=123 B=456 DISCORD_TOKEN=your-token-goes-here node index.js
```
:::
::: code-group-item Usage
```js
console.log(process.env.A);
console.log(process.env.B);
console.log(process.env.DISCORD_TOKEN);
```
:::
::::

### Using dotenv

Another common approach is storing these values in a `.env` file. This spares you from always copying your token into the command line. Each line in a `.env` file should hold a `KEY=value` pair.

You can use the [`dotenv` package](https://www.npmjs.com/package/dotenv) for this. Once installed, require and use the package to load your `.env` file and attach the variables to `process.env`:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install dotenv
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add dotenv
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add dotenv
```
:::
::: code-group-item bun
```sh:no-line-numbers
# dotenv is not necessary with Bun
# Bun reads .env files automatically
```
:::
::::

:::: code-group
::: code-group-item .env
```
A=123
B=456
DISCORD_TOKEN=your-token-goes-here
```
:::
::: code-group-item Usage
```js
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.A);
console.log(process.env.B);
console.log(process.env.DISCORD_TOKEN);
```
:::
::::

::: danger
If you're using Git, you should not commit this file and should [ignore it via `.gitignore`](/creating-your-bot/#git-and-gitignore).
:::

::: details Online editors (Glitch, Heroku, Replit, etc.)
While we generally do not recommend using online editors as hosting solutions, but rather invest in a proper virtual private server, these services do offer ways to keep your credentials safe as well! Please see the respective service's documentation and help articles for more information on how to keep sensitive values safe:

- Glitch: [Storing secrets in .env](https://help.glitch.com/hc/articles/16287550167437)
- Heroku: [Configuration variables](https://devcenter.heroku.com/articles/config-vars)
- Replit: [Secrets and environment variables](https://docs.replit.com/programming-ide/workspace-features/secrets)
:::

## Git and `.gitignore`

Git is a fantastic tool to keep track of your code changes and allows you to upload progress to services like [GitHub](https://github.com/), [GitLab](https://about.gitlab.com/), or [Bitbucket](https://bitbucket.org/product). While this is super useful to share code with other developers, it also bears the risk of uploading your configuration files with sensitive values!

You can specify files that Git should ignore in its versioning systems with a `.gitignore` file. Create a `.gitignore` file in your project directory and add the names of the files and folders you want to ignore:

```
node_modules
.env
config.json
```

::: tip
Aside from keeping credentials safe, `node_modules` should be included here. Since this directory can be restored based on the entries in your `package.json` and `package-lock.json` files by running `npm install`, it does not need to be included in Git.

You can specify quite intricate patterns in `.gitignore` files, check out the [Git documentation on `.gitignore`](https://git-scm.com/docs/gitignore) for more information!
:::
