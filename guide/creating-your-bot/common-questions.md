# Common questions

## Legend

* `<client>` is a placeholder for the Client object, such as `const client = new Discord.Client();`.
* `<message>` is a placeholder for the Message object, such as `client.on('message', message => { ... });`.
* `<guild>` is a placeholder for the Guild object, such as `<message>.guild` or `<client>.guilds.get('<id>')`.

## Administrative

### How do I ban a user?

```js
const user = <message>.mentions.users.first();
<guild>.ban(user);
```

### How do I kick a user?

```js
const member = <message>.mentions.members.first();
member.kick();
```

### How do I add a role to a guild member?

```js
const role = <guild>.roles.find('name', '<role name>');
const member = <message>.mentions.members.first();
member.addRole(role);
```

### How do I check if a guild member has a certain role?

```js
const member = <message>.mentions.members.first();
if (member.roles.exists('name', '<role name>')) {
	// ...
}
```

### How do I limit a command to a single user?

```js
if (<message>.author.id === '<id>') {
	// ...
}
```

## Bot Configuration

### How do I set my username?

```js
<client>.user.setUsername('<username>');
```

### How do I set my avatar?

```js
<client>.user.setAvatar('<url or path>');
```

### How do I set my playing status?

```js
<client>.user.setGame('<game>');
```

**Notes:**

* If you would like to set your playing status upon startup, you must place the `<client>.user.setGame()` method in a `ready` event listener (`client.on('ready', () => {});`).

* If you're using a selfbot to change your playing status, you won't be able to view the status change, but other users will.

## Miscellaneous

### How do I send a message to a certain channel?

```js
const channel = <client>.channels.get('<id>');
channel.send('<content>');
```

### How do I DM a certain user?

```js
const user = <client>.users.get('<id>');
user.send('<content>');
```

<p class="tip">If you want to DM the user who sent the message, you can use `<message>.author.send()`.</p>

### How do I prompt the user for additional input?

```js
<message>.channel.send('Please enter more input.').then(() => {
	const filter = m => <message>.author.id === m.author.id;

	<message>.channel.awaitMessages(filter, { time: 60000, maxMatches: 1, errors: ['time'] })
		.then(messages => {
			<message>.channel.send(`You've entered: ${messages.first().content}`);
		})
		.catch(() => {
			<message>.channel.send('You did not enter any input!');
		});
});
```

<p class="tip">If you want to learn more about this syntax or want to learn about reaction collectors as well, check out [this dedicated guide page for collectors](/creating-your-bot/collectors)!</p>

### How do I react to the message my bot sent?

```js
<message>.channel.send('My message to react to.').then(sentMessage => {
	sentMessage.react('👍');
	sentMessage.react(<client>.emojis.get('myCustomEmojiIdHere'));
});
```

<p class="tip">If you want to learn more about reactions, check out [this dedicated guide on reactions](/additional-info/reactions)!</p>

### What is the difference between a User and a GuildMember?

A lot of users get confused as to what the difference between Users and GuildMembers is. The simple answer is that a User represent a global Discord user and a GuildMember represents a Discord user on a specific server. That means only GuildMembers can have permissions, roles, and nicknames, for example, because all these things are server-bound information that could be different on every server that user is in.
