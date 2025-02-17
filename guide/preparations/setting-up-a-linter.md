# Setting up a linter

As a developer, it's a good idea to make your development process as streamlined as possible. Linters check syntax and help you produce consistent code that follows specific style rules that you can define yourself or inherit from existing configurations. Although it's not required, installing a linter will help you immensely.

## Installing a code editor

First, you will need a proper code editor. Using programs such as Notepad and Notepad++ is discouraged, as they're inefficient for projects like these. If you aren't using one of the editors listed below, it's advised to switch.

* [Visual Studio Code](https://code.visualstudio.com/) is a prevalent choice; it is known for being fast and powerful. It supports various languages, has a terminal, built-in IntelliSense support, and autocomplete for both JavaScript and TypeScript. This is the recommended choice.
* [Sublime Text](https://www.sublimetext.com/) is another popular editor that's easy to use and write code with.

## Installing a linter

Install the [ESLint package](https://www.npmjs.com/package/eslint) inside your project directory.

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install --save-dev eslint @eslint/js
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add eslint @eslint/js --dev
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add --save-dev eslint @eslint/js
```
:::
::: code-group-item bun
```sh:no-line-numbers
bun add --dev eslint
```
:::
::::


One of the advantages proper code editors have is their ability to integrate linters via editor plugins. Install the appropriate plugin(s) for your editor of choice.

* [ESLint for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [ESLint for Sublime Text](https://packagecontrol.io/packages/ESLint)

::: tip
You can view plugins directly inside your editor.

- Visual Studio Code: Press `Ctrl + Shift + X`
- Sublime Text: Press `Ctrl + Shift + P` and search for "Install Package" (available via [Package Control](https://packagecontrol.io/installation))

After that, search for the appropriate plugin and install it.
:::

## Setting up ESLint rules

ESLint may display many warnings and errors about your code when you start using it but don't let this startle you. To get started, create a file in your project directory named `eslint.config.js` and copy the code below into the file:

```javascript
const js = require('@eslint/js');

module.exports = [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
		},
		rules: {

		},
	},
];
```

This is the basis of how an ESLint file will look. The `rules` object is where you'll define what rules you want to apply to ESLint. For example, if you want to make sure you never miss a semicolon, the `"semi": ["error", "always"]` rule is what you'll want to add inside that object.

You can find a list of all of ESLint's rules on [their website](https://eslint.org/docs/rules). There are indeed many rules, and it may be overwhelming at first, so if you don't want to go through everything on your own yet, you can use these rules:

```javascript
const js = require('@eslint/js');

module.exports = [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
		},
		rules: {
			'arrow-spacing': ['warn', { before: true, after: true }],
			'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
			'comma-dangle': ['error', 'always-multiline'],
			'comma-spacing': 'error',
			'comma-style': 'error',
			curly: ['error', 'multi-line', 'consistent'],
			'dot-location': ['error', 'property'],
			'handle-callback-err': 'off',
			indent: ['error', 'tab'],
			'keyword-spacing': 'error',
			'max-nested-callbacks': ['error', { max: 4 }],
			'max-statements-per-line': ['error', { max: 2 }],
			'no-console': 'off',
			'no-empty-function': 'error',
			'no-floating-decimal': 'error',
			'no-inline-comments': 'error',
			'no-lonely-if': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
			'no-shadow': ['error', { allow: ['err', 'resolve', 'reject'] }],
			'no-trailing-spaces': ['error'],
			'no-var': 'error',
			'no-undef': 'off',
			'object-curly-spacing': ['error', 'always'],
			'prefer-const': 'error',
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'space-before-blocks': 'error',
			'space-before-function-paren': ['error', {
				anonymous: 'never',
				named: 'never',
				asyncArrow: 'always',
			}],
			'space-in-parens': 'error',
			'space-infix-ops': 'error',
			'space-unary-ops': 'error',
			'spaced-comment': 'error',
			yoda: 'error',
		},
	},
];
```

The major points of this setup would be:

* Allowing you to debug with `console.log()`;
* Prefer using `const` over `let` or `var`, as well as disallow `var`;
* Disapproving of variables with the same name in callbacks;
* Requiring single quotes over double quotes;
* Requiring semicolons. While not required in JavaScript, it's considered one of the most common best practices to follow;
* Requiring accessing properties to be on the same line;
* Requiring indenting to be done with tabs;
* Limiting nested callbacks to 4. If you hit this error, it is a good idea to consider refactoring your code.

If your current code style is a bit different, or you don't like a few of these rules, that's perfectly fine! Just head over to the [ESLint docs](https://eslint.org/docs/rules/), find the rule(s) you want to modify, and change them accordingly.

::: TypeScript

Linting TypeScript code with ESLint requires a bit more work. First, you'll want to install the required packages:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install --save-dev eslint @eslint/js @types/eslint__js typescript typescript-eslint
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add --dev eslint @eslint/js @types/eslint__js typescript typescript-eslint
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add --save-dev eslint @eslint/js @types/eslint__js typescript typescript-eslint
```
:::
::::

Your `.eslintrc.json` file will also look slightly different:

```json {2-7}
{
	"extends": [
		"eslint:recommended"
		"plugin:@typescript-eslint/recommended-type-checked",
    	"plugin:@typescript-eslint/stylistic-type-checked",
	],
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2021
	},
	"rules": {
		"arrow-spacing": ["warn", { "before": true, "after": true }],
		"brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
		"comma-dangle": ["error", "always-multiline"],
		"comma-spacing": "error",
		"comma-style": "error",
		"curly": ["error", "multi-line", "consistent"],
		"dot-location": ["error", "property"],
		"handle-callback-err": "off",
		"indent": ["error", "tab"],
		"keyword-spacing": "error",
		"max-nested-callbacks": ["error", { "max": 4 }],
		"max-statements-per-line": ["error", { "max": 2 }],
		"no-console": "off",
		"no-empty-function": "error",
		"no-floating-decimal": "error",
		"no-inline-comments": "error",
		"no-lonely-if": "error",
		"no-multi-spaces": "error",
		"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
		"no-shadow": ["error", { "allow": ["err", "resolve", "reject"] }],
		"no-trailing-spaces": ["error"],
		"no-var": "error",
		"object-curly-spacing": ["error", "always"],
		"prefer-const": "error",
		"quotes": ["error", "single"],
		"semi": ["error", "always"],
		"space-before-blocks": "error",
		"space-before-function-paren": ["error", {
			"anonymous": "never",
			"named": "never",
			"asyncArrow": "always"
		}],
		"space-in-parens": "error",
		"space-infix-ops": "error",
		"space-unary-ops": "error",
		"spaced-comment": "error",
		"yoda": "error"
	}
}
```

Note that the only difference is that extra base configs were added to the `extends` property.