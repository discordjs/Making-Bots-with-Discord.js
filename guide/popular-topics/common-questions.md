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
<client>.user.setActivity('<activity>');
```

### How do I set my status to "Watching ..." or "Listening to ..."?

```js
<client>.user.setActivity('<activity>', { type: 'WATCHING' });
<client>.user.setActivity('<activity>', { type: 'LISTENING' });
```

<p class="tip">If you would like to set your activity upon startup, you must place the `<client>.user.setActivity()` method in a `ready` event listener (`<client>.on('ready', () => {});`).</p>

<p class="tip">If you're using a selfbot to change your activity, you won't be able to view the status change, but other users will.</p>

<p class="warning">`<client>.user.setActivity()` will only work in v11.3 and above. You can check your version with `npm ls discord.js` and update with `npm install discord.js`. You can still use `<client>.user.setGame()`, but it is deprecated as of v11.3, and has been removed in v12.</p>

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

### How do I tag a certain user in a message?

```js
const user = <message>.mentions.users.first();
<message>.channel.send(`Hi, ${user}.`);
<message>.channel.send('Hi, <@user id>.');
```

<p class="tip">If you want to tag the user who sent the message, you can use `<message>.reply()`. For example: `<message>.reply('hi.')` would result in `@User, hi.`. If you want to insert the tag elsewhere, you can store `<message>.author` as your `user` variable and use the original example.</p>

<p class="tip">Tags inside certain areas of an embed may display correctly, but will not actually ping the user. Tags inside other certain areas of an embed will display the raw string instead (e.g. `<@123456789012345678>`).</p>

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

<p class="tip">If you want to learn more about this syntax or want to learn about reaction collectors as well, check out [this dedicated guide page for collectors](/popular-topics/collectors)!</p>

### How do I react to the message my bot sent?

```js
<message>.channel.send('My message to react to.').then(sentMessage => {
	sentMessage.react('👍');
	sentMessage.react('<emoji id>');
});
```

<p class="tip">If you want to learn more about reactions, check out [this dedicated guide on reactions](/popular-topics/reactions)!</p>

### How do I create a restart command?

```js
process.exit();
```

<p class="tip">`process.exit()` will only kill your Node process, but when using [PM2](http://pm2.keymetrics.io/), it will restart the process whenever it gets killed. You can read our guide on PM2 [here](/improving-dev-environment/pm2).</p>

<p class="warning">Be sure to [limit this to your own ID](/popular-topics/common-questions?id=how-do-i-limit-a-command-to-a-single-user) so that other users can't restart your bot!</p>

### What is the difference between a User and a GuildMember?

A lot of users get confused as to what the difference between Users and GuildMembers is. The simple answer is that a User represents a global Discord user and a GuildMember represents a Discord user on a specific server. That means only GuildMembers can have permissions, roles, and nicknames, for example, because all of these things are server-bound information that could be different on each server that user is in.
