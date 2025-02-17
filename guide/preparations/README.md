# Installing Node.js and discord.js

## Installing Node.js

To use discord.js, you'll need to install the latest LTS version of [Node.js](https://nodejs.org/).

::: tip
To check if you already have Node installed on your machine \(e.g., if you're using a VPS\), run `node -v` in your terminal. It is recommended to use the latest LTS version of Node.
:::

On Windows, it's as simple as installing any other program. Download the latest version from [the Node.js website](https://nodejs.org/), open the downloaded file, and follow the steps from the installer.

On macOS, either:

- Download the latest version from [the Node.js website](https://nodejs.org/), open the package installer, and follow the instructions
- Use a package manager like [Homebrew](https://brew.sh/) with the command `brew install node`

On Linux, you can consult [this page](https://nodejs.org/en/download/package-manager/) to determine how you should install Node.

## Preparing the essentials

To use discord.js, you'll need to install it via npm \(Node's package manager\). npm comes with every Node installation, so you don't have to worry about installing that. However, before you install anything, you should set up a new project folder.

Navigate to a suitable place on your machine and create a new folder named `discord-bot` (or whatever you want). Next you'll need to open your terminal.

### Opening the terminal

::: tip
If you use [Visual Studio Code](https://code.visualstudio.com/), you can press <code>Ctrl + `</code> (backtick) to open its integrated terminal.
:::

On Windows, either:

- `Shift + Right-click` inside your project directory and choose the "Open command window here" option
- Press `Win + R` and run `cmd.exe`, and then `cd` into your project directory

On macOS, either:
- Open Launchpad or Spotlight and search for "Terminal"
- In your "Applications" folder, under "Utilities", open the Terminal app

On Linux, you can quickly open the terminal with `Ctrl + Alt + T`.

With the terminal open, run the `node -v` command to make sure you've successfully installed Node.js.

### Initiating a project folder

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm init
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn init
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm init
```
:::
::: code-group-item bun
```sh:no-line-numbers
bun init
```
:::
::::

This is the next command you'll be running. This command creates a `package.json` file for you, which will keep track of the dependencies your project uses, as well as other info.

This command will ask you a sequence of questions–you should fill them out as you see fit. If you're not sure of something or want to skip it as a whole, leave it blank and press enter.

::: tip
To get started quickly, you can run the following command to have it fill out everything for you.

<CodeGroup>
  <CodeGroupItem title="npm">

```sh:no-line-numbers
npm init -y
```

  </CodeGroupItem>
  <CodeGroupItem title="yarn">

```sh:no-line-numbers
yarn init -y
```

  </CodeGroupItem>
  <CodeGroupItem title="pnpm">

```sh:no-line-numbers
pnpm init
```

  </CodeGroupItem>
  <CodeGroupItem title="bun">

```sh:no-line-numbers
bun init -y
```

  </CodeGroupItem>
</CodeGroup>
:::

Once you're done with that, you're ready to install discord.js!

## Installing discord.js

Now that you've installed Node.js and know how to open your console and run commands, you can finally install discord.js! Run the following command in your terminal:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install discord.js
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add discord.js
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add discord.js
```
:::
::: code-group-item bun
```sh:no-line-numbers
bun add discord.js
```
:::
::::

And that's it! With all the necessities installed, you're almost ready to start coding your bot.

## Installing a linter

While you are coding, it's possible to run into numerous syntax errors or code in an inconsistent style. You should [install a linter](/preparations/setting-up-a-linter.md) to ease these troubles. While code editors generally can point out syntax errors, linters coerce your code into a specific style as defined by the configuration. While this is not required, it is advised.

## TypeScript

### Installation

Discord.js comes with TypeScript support out of the box. If you want to use TypeScript, you'll need to additionally install TypeScript in your project:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install typescript
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add typescript
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add typescript
```
:::
::::

Next, you'll need to create a `tsconfig.json` file, which is used to configure the TypeScript environment in a project. A `tsconfig.json` with reasonable defaults can be generated using the following command:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npx tsc --init
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn exec tsc --init
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm exec tsc --init
```
:::
::::

### Project organization

The default `tsconfig.json` is mostly usable out of the box, but there's one particular change that can should be made. If you check the commented `outDir` option, you'll see that it defaults to emitting compiled code into the project root. To keep things organized, change this to `"./build"`. This will tell the compiler to emit all built code into the `build` folder.

Another option that should be changed is the `rootDir` option, which defaults to the project root. Uncomment the option and set it to `"./src"`.

::: tip
Feel free to explore all the other options that can be configured in the `tsconfig.json`. If generated with the above command, the file will contain comments explaining each option.
:::

### package.json scripts

Because TypeScript compiles down to JavaScript before execution, we'll need to add a build step to our project. The build step will be simple: all it will do is call `tsc`. The compiler will automatically pick up the `tsconfig.json`. To add the build step, add a `build` property with value `tsc` under the `scripts` object in your `package.json`.

In addition to adding a build step, we won't be able to execute the TypeScript code directly, so for convenience, add another value in the `scripts` object that simple starts up node with the main file.

Your final `package.json` should look similar to this:

```jsonc{7,8}
{
  "name": "CoolBot",
  "version": "1.0.0",
  "description": "This project is for a very cool bot.",
  "main": "build/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node ./build/index.js"
  },
  // ...
}
```