# A Brief Primer Updating from v11 to v12

After a long time in development, Discord.js v12 is nearing a stable release, meaning it's time to update from v11 to get new features for your bots!  However, with those new features comes a lot of changes to the library that will break code written for v11.  This guide will serve as a handy reference for updating your code, covering the most commonly-used methods that have been changed, new topics such as partials and internal sharding, and will also include a comprehensive list of the method and property changes at the end.

## Before You Start

v12 requires Node 10.x or higher to  use, so make sure you're up-to-date.  To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it!  There are many resources online to help you get up-to-date.

For now, you do need Git installed and added to your PATH environment, so ensure that's done as well - again, guides are available online for a wide variety of operating systems.  Once you have Node up-to-date and Git installed, you can install v12 by running `npm install discordjs/discord.js` in your terminal or command prompt for text-only use, or `npm install discordjs/discord.js node-opus` for voice support.

## Commonly Used Methods That Changed

* All section headers are named in the following convention: `Class#methodOrProperty`.
* The use of parenthesis designates optional inclusion. For example, `Channel#fetch(Pinned)Message(s)` means that this section will include changes for `Channel#fetchPinnedMessages`, `Channel#fetchMessages`, and `Channel#fetchMessage`.
* The use of asterisks designates a wildcard. For example, `Channel#send***` means that this section will include changes for `Channel#sendMessage`, `Channel#sendFile`, `Channel#sendEmbed`, and so forth.

### Fetch

Some methods that retrieve uncached data have been changed, transformed in the shape of a DataStore.

```diff
- client.fetchUser('123456789012345678');
+ client.users.fetch('123456789012345678');

- guild.fetchMember('123456789012345678');
+ guild.members.fetch('123456789012345678');

- guild.fetchMembers();
+ guild.members.fetch();

- textChannel.fetchMessage('123456789012345678');
+ textChannel.messages.fetch('123456789012345678');

- textChannel.fetchMessages({ limit: 10 });
+ textChannel.messages.fetch({ limit: 10 });

- textChannel.fetchPinnedMessages();
+ textChannel.messages.fetchPinned();
```

### Send

All the `.send***()` methods have been removed in favor of one general `.send()` method.

```diff
- channel.sendMessage('Hey!');
+ channel.send('Hey!');

- channel.sendEmbed(embedVariable);
+ channel.send(embedVariable);
+ channel.send({ embed: embedVariable });
```

<p class="warning">`channel.send(embedVariable)` will only work if that variable is an instance of the `MessageEmbed` class; object literals won't give you the expected result unless your embed data is inside an `embed` key.</p>

```diff
- channel.sendCode('js', 'const version = 11;');
+ channel.send('const version = 12;', { code: 'js' });

- channel.sendFile('./file.png');
- channel.sendFiles(['./file-one.png', './file-two.png']);
+ channel.send({
  files: [{
    attachment: 'entire/path/to/file.jpg',
    name: 'file.jpg'
  }]
+ channel.send({
  files: ['https://cdn.discordapp.com/icons/222078108977594368/6e1019b3179d71046e463a75915e7244.png?size=2048']
});
```

### Roles

The `GuildMember.roles` Collection has been changed to a DataStore in v12, so a lot of the associated methods for interacting with a member's roles have changed as well.  They're no longer on the GuildMember object itself, but instead now on the `GuildMemberRoleStore` Data Store.

```diff
- guildMember.addRole('123456789012345678');
- guildMember.addRoles(['123456789012345678', '098765432109876543']);
+ guildMember.roles.add('123456789012345678');
+ guildMember.roles.add(['123456789012345678', '098765432109876543']);

- guildMember.removeRole('123456789012345678');
- guildMember.removeRoles(['123456789012345678', '098765432109876543']);
+ guildMember.roles.remove('123456789012345678');
+ guildMember.roles.remove(['123456789012345678', '098765432109876543']);

- guildMember.setRoles(['123456789012345678', '098765432109876543']);
+ guildMember.roles.set(['123456789012345678', '098765432109876543']);
```

In addition, the GuildMember properties related to roles have also been moved to the `GuildMemberRoleStore` Data Store.

```diff
- guildMember.colorRole;
+ guildMember.roles.color;

- guildMember.highestRole;
+ guildMember.roles.highest;

- guildMember.hoistRole;
+ guildMember.roles.hoist;
```

### Ban and Unban

The method to ban members and users have been moved to the `GuildMemberStore` Data Store.

```diff
- guildMember.ban();
- guild.ban('123456789012345678');
+ guild.members.ban('123456789012345678');

- guild.unban('123456789012345678');
+ guild.members.unban('123456789012345678');
+
```

### Image URLs

Some image-related properties like `user.avatarURL` are now a method in v12, so that you can apply some options to them, eg. to affect their display size.

```diff
- user.avatarURL;
+ user.avatarURL();

- user.displayAvatarURL;
+ user.displayAvatarURL();

- guild.iconURL;
+ guild.iconURL();

- guild.splashURL;
+ guild.splashURL();
```

### RichEmbed Constructor

The RichEmbed constructor has been removed and is now called `MessageEmbed`.  It is largely the same to use, the only difference being the removal of `RichEmbed.attachFile()` - `MessageEmbed.attachFiles()` accepts a single file as a parameter as well.

### String Concatenation

v12 has changed how string concatenation works with stringifying objects.  The `valueOf` any data structure will return its id, which affects how it behaves in strings, eg. using an object for a mention.  In v11, you used to be able to use `channel.send(userObject + ' has joined!')` and it would automatically stringify the object and it would become the mention (`@user has joined!`), but in v12, it will now send a message that says `123456789012345678 has joined` instead.  Using template literals (\`\`) will still return the mention, however.

```diff
- channel.send(userObject + ' has joined!')
+ channel.send(`${userObject} has joined!`)
```

### User Account-Only Methods

All user account-only methods have been removed, as they are no longer publicly accessible from the API.

---
<p class="danger">This stuff should keep getting shoved to the bottom, with the commonly-used methods that are changed, as well as topic overviews added before it.</p>

The section headers for breaking changes will be named after the v11 classes/methods/properties and will be in alphabetical order, so that you can easily find what you're looking for. The section headers for additions will be named after the v12 classes/methods/properties, to reflect their current syntax appropriately.

"Difference" codeblocks will be used to display the old methods vs the newer ones—the red being what's been removed and the green being its replacement. Some bits may have more than one version of being handled. Regular JavaScript syntax codeblocks will be used to display the additions. 

<p class="danger">While this list has been carefully crafted, it may be incomplete! If you notice pieces of missing or inaccurate data, we encourage you to [submit a pull request](https://github.com/Danktuary/Making-Bots-with-Discord.js)!</p>

## Breaking changes

<p class="danger">This next bit is for me (Sanc) to keep track of the classes I've gone through and checked for breaking changes. Remove before making the PR.</p>

<p class = "danger">Whatever happened here: https://github.com/discordjs/discord.js/pull/2765/files needs to be added as well as internal sharding and partials</p>

* ClientUser
* DiscordAPIError
* DMChannel
* GroupDMChannel
* Guild
* GuildAuditLogs
* GuildAuditLogsEntry
* GuildChannel
* GuildMember
* Invite
* Message
* MessageAttachment
* MessageMentions
* MessageReaction
* OAuth2Application
* PermissionOverwrites

TODO LATER CUZ I DON'T WANNA TOUCH THAT SHIT RN:

* MessageCollector
* MessageEmbed***

<p class="danger">Before anything, it is important to note that discord.js v12 (and so forth) requires a **minimum** Node version of v10. If you aren't sure what Node version you're on, run `node -v` in your console and update if necessary.</p>

### Dependencies

#### Snekfetch
Please note that `snekfetch` has been removed as a dependency, and has been replaced by `node-fetch`

### Attachment

The `Attachment` class has been removed in favor of the `MessageAttachment` class.

### Channel

#### Channel#send\*\*\*

All the `.send***()` methods have been removed in favor of one general `.send()` method.

```diff
- channel.sendMessage('Hey!');
+ channel.send('Hey!');
```

```diff
- channel.sendEmbed(embedVariable);
+ channel.send(embedVariable);
+ channel.send({ embed: embedVariable });
```

<p class="warning">`channel.send(embedVariable)` will only work if that variable is an instance of the `MessageEmbed` class; object literals won't give you the expected result unless your embed data is inside an `embed` key.</p>

```diff
- channel.sendCode('js', 'const version = 11;');
+ channel.send('const version = 12;', { code: 'js' });
```

<p class="tip">Assuming you have the `MessageAttachment` class required somewhere in your file, e.g. `const { MessageAttachment } = require('discord.js')`.</p>

```diff
- channel.sendFile('./file.png');
+ channel.send({ files: [{ attachment: './file.png' }] });
+ channel.send(new MessageAttachment('./file.png'));

- channel.sendFile('./file.png', 'file-name.png');
+ channel.send({ files: [{ attachment: './file.png', name: 'file-name.png' }] });
+ channel.send(new MessageAttachment('./file.png', 'file-name.png'));

- channel.sendFile('./file.png', 'file-name.png', 'With a message attached');
+ channel.send('With a message attached', { files: [new MessageAttachment('./file.png', 'file-name.png')] });
```

```diff
- channel.sendFiles(['./file-one.png', './file-two.png']);
+ channel.send({ files: [{ attachment: './file-one.png' }, { attachment: './file-two.png' }] });
+ channel.send({ files: [new MessageAttachment('./file-one.png'), new MessageAttachment('./file-two.png')] });
```

#### Channel#fetch(Pinned)Message(s)

`channel.fetchMessage()`, `channel.fetchMessages()`, and `channel.fetchPinnedMessages()` were all removed and transformed in the shape of DataStores.

```diff
- channel.fetchMessage('123456789012345678');
+ channel.messages.fetch('123456789012345678');
```

```diff
- channel.fetchMessages({ limit: 100 });
+ channel.messages.fetch({ limit: 100 });
```

```diff
- channel.fetchPinnedMessages();
+ channel.messages.fetchPinned();
```

### Client

#### Client#fetchUser

`client.fetchUser()` has been removed and transformed in the shape of a DataStore.

```diff
- client.fetchUser('123456789012345678');
+ client.users.fetch('123456789012345678');
```

#### Client#browser

`client.browser` has been removed entirely.

#### Client#channels

`client.channels` has been changed from a Collection to a DataStore.

#### Client#emojis

`client.emojis` has been changed from a Collection to a DataStore.

#### Client#guilds

`client.guilds` has been changed from a Collection to a DataStore.

#### Client#ping

`client.ping` has been moved to the WebSocketManager under `client.ws.ping`

```diff
- client.ping
+ client.ws.ping
```

#### Client#pings

`client.pings` has been removed entirely.

#### Client#presences

`client.presences` has been removed entirely.

#### Client#users

`client.users` has been changed from a Collection to a DataStore.

### ClientUser

#### ClientUser#acceptInvite

`clientUser.acceptInvite()` has been removed entirely.

#### ClientUser#addFriend

`clientUser.addFriend()` has been removed entirely.

#### ClientUser#block

`clientUser.block()` has been removed entirely.

#### ClientUser#avatarURL

`clientUser.avatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- clientUser.avatarURL;
+ clientUser.avatarURL();
+ clientUser.avatarURL({ format: 'png', size: 1024 });
```

#### ClientUser#createGuild

The second and third parameters in `clientUser.createGuild()` have been changed/removed, leaving it with a total of two parameters. The `region` and `icon` parameters from v11 have been merged into an object as the second parameter.

```diff
- clientUser.createGuild('New server', 'us-east', './path/to/file.png');
+ clientUser.createGuild('New server', { region: 'us-east', icon: './path/to/file.png' });
```

#### ClientUser#displayAvatarURL

`clientUser.displayAvatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- clientUser.displayAvatarURL;
+ clientUser.displayAvatarURL();
+ clientUser.displayAvatarURL({ format: 'png', size: 1024 });
```

#### ClientUser#removeFriend

`clientUser.removeFriend()` has been removed entirely.

#### ClientUser#send\*\*\*

Just like the `Channel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [Channel#send\*\*\*](/additional-info/changes-in-v12?id=channelsend) section for more information.

#### ClientUser#setGame

`clientUser.setGame()` has been changed to `clientUser.setActivity()`. The second parameter is no longer for providing a streaming URL, but rather an object that allows you to provide the URL and activity type.

```diff
- clientUser.setGame('with my bot friends!');
+ clientUser.setActivity('with my bot friends!');

- clientUser.setGame('with my bot friends!', 'https://twitch.tv/your/stream/here');
+ clientUser.setActivity('with my bot friends!', { url: 'https://twitch.tv/your/stream/here', type: 'STREAMING' });
```

#### ClientUser#setPassword

The second parameter in `clientUser.setPassword()` has been changed. The `oldPassword` parameter from v11 has been changed into an object as the second parameter.

```diff
- clientUser.setPassword('newpassword', 'oldpassword');
+ clientUser.setPassword('newpassword', { oldPassword: 'oldpassword', mfaCode: '123456' });
```

#### ClientUser#unblock

`clientUser.unblock()` has been removed entirely.

### Collection

#### Collection#find/findKey

Both methods will now return `undefined` if nothing is found.

#### Collection#deleteAll

`collection.deleteAll()` has been removed in favor of map's default `clear()` method.

#### Collection#exists

`collection.exists()` has been replaced by the `collection.some()` method.

#### Collection#filterArray

`collection.filterArray()` has been removed completely.

#### Collection#findAll

`collection.findAll()` has been removed completely as the same functionality can be obtained through `collection.filter()`.

#### Collection#first/firstKey/last/lastKey/random/randomKey

The `amount` parameter of these methods now allows a negative number which will start the query from the end of the collection instead of the start.

#### Collection#tap

Now runs a specific function over the collection instead of mimicking `<array>.forEach()`, this functionality was moved to `collection.each()`. 

### Collector

#### Collector#cleanup

`collector.cleanup()` has been removed entirely.

### GroupDMChannel

#### GroupDMChannel#iconURL

`groupDM.iconURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- groupDM.iconURL;
+ groupDM.iconURL();
+ groupDM.iconURL({ format: 'png', size: 1024 });
```

#### GroupDMChannel#addUser

The first and second parameters in `groupDM.addUser()` have been changed/removed, leaving it with a total of one parameter. The `accessTokenOrID` and `reason` parameters from v11 have been merged into an object as the first parameter.

```diff
- groupDM.addUser('123456789012345678');
+ groupDM.addUser({ user: '123456789012345678' });
+ groupDM.addUser({ user: '123456789012345678', accessToken: 'access-token', nick: 'My Best Friend!' });
```

### Guild

#### Guild#ban

The second parameter in `guild.ban()` has been changed. The `options` parameter no longer accepts a number, nor a string.

```diff
- guild.ban(user, 7);
+ guild.ban(user, { days: 7 });

- guild.ban(user, 'Too much trolling');
+ guild.ban(user, { reason: 'Too much trolling' });
```

#### Guild#createChannel

The third and fourth parameters in `guild.createChannel()` have been changed/removed, leaving it with a total of three parameters. The `overwrites` and `reason` parameters from v11 have been merged into an object as the third parameter.

```diff
- guild.createChannel('new-channel', 'text', permissionOverwriteArray, 'New channel added for fun!');
+ guild.createChannel('new-channel', 'text', { overwrites: permissionOverwriteArray, reason: 'New channel added for fun!' });
```

#### Guild#createEmoji

The third and fourth parameters in `guild.createEmoji()` have been changed/removed, leaving it with a total of three parameters. The `roles` and `reason` parameters from v11 have been merged into an object as the third parameter.

```diff
- guild.createEmoji('./path/to/file.png', 'NewEmoji', collectionOfRoles, 'New emoji added for fun!');
+ guild.createEmoji('./path/to/file.png', 'NewEmoji', { roles: collectionOfRoles, reason: 'New emoji added for fun!' });
```

#### Guild#createRole

The first and second parameters in `guild.createRole()` have been changed/removed, leaving it with a total of one parameter. The `data` and `reason` parameters from v11 have been moved into an object as the first parameter.

```diff
- guild.createRole(roleData, 'New staff role!');
+ guild.createRole({ data: roleData, reason: 'New staff role!' });
```

#### Guild#deleteEmoji

`Guild.deleteEmoji()` has been removed and transformed in the shape of a DataStore. Note the possible use of `resolve()` as a broader alternative to `get()`.

```diff
- guild.deleteEmoji('123456789012345678');
+ guild.emojis.resolve('123456789012345678').delete();
```

#### Guild#defaultChannel

Unfortunately, "default" channels don't exist in Discord anymore, and as such, the `guild.defaultChannel` property has been removed with no alternative.

**Q:** "I previously had a welcome message system (or something similar) set up using that property. What can I do now?"

**A:** There are a few ways to tackle this. Using the example of a welcome message system, you can:

1. Set up a database table to store the channel ID in a column when someone uses a `!welcome-channel #channel-name` command, for example. Then inside the `guildMemberAdd` event, use `client.channels.get('id')` and send a message to that channel. This is the most reliable method and gives server staff freedom to rename the channel as they please.
2. Make a new command that creates a `welcome-messages` channel, use `guild.channels.find('name', 'welcome-messages')`, and send a message to that channel. This method will work fine in most cases, but will break if someone on that server decides to rename the channel. This may also give you unexpected results, due to Discord allowing multiple channels to have the same name.

<p class="tip">Not sure how to set up a database? Check out [this page](/sequelize/)!</p>

#### Guild#fetchBans

`guild.fetchBans()` will return a `Collection` of objects in v12, whereas v11 would return a `Collection` of `User` objects.

```diff
- guild.fetchBans().then(bans => console.log(`${bans.first().tag} was banned`));
+ guild.fetchBans().then(bans => console.log(`${bans.first().user.tag} was banned because "${bans.first().reason}"`));
```

#### Guild#fetchMember(s)

`guild.fetchMember()` and `guild.fetchMembers()` were both removed and transformed in the shape of DataStores. In addition, `guild.members.fetch()` will return a `Collection` of `GuildMember` objects in v12, whereas v11 would return a `Guild` object.

1. Set up a database table to store the channel ID in a column when someone uses a `!welcome-channel #channel-name` command, for example. Then inside the `guildMemberAdd` event, use `client.channels.get('id')` and send a message to that channel. This is the most reliable method and gives server staff freedom to rename the channel as they please.
2. Make a new command that creates a `welcome-messages` channel, use `guild.channels.find('name', 'welcome-messages')`, and send a message to that channel. This method will work fine in most cases, but will break if someone on that server decides to rename the channel. This may also give you unexpected results, due to Discord allowing multiple channels to have the same name.

<p class="tip">Not sure how to set up a database? Check out [this page](/sequelize/)!</p>

### Guild#defaultRole

`guild.fetchBans()` will return a `Collection` of objects in v12, whereas v11 would return a `Collection` of `User` objects.

```diff
- guild.fetchBans().then(bans => console.log(`${bans.first().tag} was banned`));
+ guild.fetchBans().then(bans => console.log(`${bans.first().user.tag} was banned because "${bans.first().reason}"`));
```

#### Guild#fetchMember(s)

`guild.fetchMember()` and `guild.fetchMembers()` were both removed and transformed in the shape of DataStores. In addition, `guild.members.fetch()` will return a `Collection` of `GuildMember` objects in v12, whereas v11 would return a `Guild` object.

```diff
- guild.fetchMember('123456789012345678');
+ guild.members.fetch('123456789012345678');
```

```diff
- guild.fetchMembers();
+ guild.members.fetch();
```

#### Guild#fetchWebhooks

`guild.fetchWebhooks()` is now a Promise that returns a `Collection` of `Webhook`s.

```diff
- guild.fetchWebhooks().first();
+ guild.fetchWebhooks().then(webhooks => webhooks.first());
```

#### Guild#iconURL

`guild.iconURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- guild.iconURL;
+ guild.iconURL();
+ guild.iconURL({ format: 'png', size: 1024 });
```

#### Guild#pruneMembers

The first, second, and third parameters in `guild.createEmoji()` have been changed/removed, leaving it with a total of one parameter. The `days`, `dry`, and `reason` parameters from v11 have been merged into an object as the first parameter.

```diff
- guild.pruneMembers(7, true, 'Scheduled pruning');
+ guild.pruneMembers({ days: 7, dry: true, reason: 'Scheduled pruning' });
```

#### Guild#setChannelPosition

`guild.setChannelPosition()` has been removed entirely. As an alternative, you can use `channel.setPosition()`, or `guild.setChannelPositions()`, which accepts accepts the same form of data as `guild.setChannelPosition` but inside an array.

#### Guild#setRolePosition

`guild.setRolePosition()` has been removed entirely. As an alternative, you can use `role.setPosition()`.

#### Guild#splashURL

`guild.splashURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- guild.splashURL;
+ guild.splashURL();
+ guild.splashURL({ format: 'png', size: 1024 });
```

### GuildChannel

#### GuildChannel#createInvite

The second parameter in `guild.createEmoji()` has been removed, leaving it with a total of one parameter. The `reason` parameter from v11 have been merged into an object as the first parameter.

#### GuildChannel#calculatedPosition

`channel.calculatedPosition` has been renamed to `channel.position`.

#### GuildChannel#clone

The first, second, third, and fourth parameters in `channel.clone()` have been changed/removed, leaving it with a total of one parameter. The `name`, `withPermissions`, `withTopic`, and `reason` parameters from v11 have been merged into an object as the first parameter. 

#### GuildChannel#create
This method can now use the `rateLimitPerUser` as an option.

#### GuildChannel#createInvite

The second parameter in `channel.createInvite()` has been removed, leaving it with a total of one parameter. The `reason` parameter from v11 have been merged into an object as the first parameter.

```diff
- channel.createInvite({ temporary: true }, 'Just testing');
+ channel.createInvite({ temporary: true, reason: 'Just testing' });
```

#### GuildChannel#position

`channel.position` has been renamed to `channel.rawPosition`.

#### GuildChannel#setPosition

The second parameter in `channel.setPosition()` has been changed. The `relative` parameter from v11 has been merged into an object.

```diff
- channel.setPosition(10, true);
+ channel.setPosition(10, { relative: true, reason: 'Basic organization' });
```

### GuildMember

#### GuildMember#ban

The second parameter in `member.ban()` has been changed. The `options` parameter no longer accepts a number, nor a string.

```diff
- member.ban(user, 7);
+ member.ban(user, { days: 7 });

- member.ban(user, 'Too much trolling');
+ member.ban(user, { reason: 'Too much trolling' });
```

#### GuildMember#hasPermission

The second, third, and fourth parameters in `member.hasPermission()` have been changed/removed, leaving it with a total of three parameters. The `explicit` parammeter from v11 has been removed.

```diff
- member.hasPermission('MANAGE_MESSAGES', true, false, false);
+ member.hasPermission('MANAGE_MESSAGES', false, false);
```

#### GuildMember#hasPermissions

`member.hasPermissions()` has been removed in favor of `member.hasPermission()`.

```diff
- member.hasPermissions(['MANAGE_MESSAGES', 'MANAGE_ROLES']);
+ member.hasPermission(['MANAGE_MESSAGES', 'MANAGE_ROLES']);
```

#### GuildMember#send

Just like the `Channel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [Channel#send\*\*\*](/additional-info/changes-in-v12?id=channelsend) section for more information.

### Message

#### Message.cleanContent
`message.cleanContent()` has been moved to `Util.cleanContent()`.

#### Message#delete

The first parameter in `message.delete()` has been changed. The `timeout` parameter from v11 have been merged into an object as the first parameter.

```diff
- message.delete(5000);
+ message.delete({ timeout: 5000 });
```

#### Message#editCode

In the same sense that the `channel.sendCode()` method was removed, `message.editCode()` has also been removed entirely.

```diff
- message.editCode('js', 'const version = 11;');
+ message.edit('const version = 12;', { code: 'js' });
```

#### Message#is(Member)Mentioned

`message.isMentioned()` and `message.isMemberMentioned()` have been removed in favor of `message.mentions.has()`.

```diff
- message.isMentioned('123456789012345678');
- message.isMemberMentioned('123456789012345678');
+ message.mentions.has('123456789012345678');
```

### MessageAttachment

The `MessageAttachment` class' constructor parameters have changed

#### MessageAttachment#client

`attachment.client` has been removed entirely.

#### MessageAttachment#filename

`attachment.filename` has been renamed to `attachment.name`.

#### MessageAttachment#filesize

`attachment.filesize` has been renamed to `attachment.size`.

### MessageCollector

#### MessageCollector#max(Matches)

The `max` and `maxMatches` properties of the `MessageCollector` class have been renamed and repurposed.

```diff
- `max`: The The maximum amount of messages to process.
+ `maxProcessed`: The maximum amount of messages to process.

- `maxMatches`: The maximum amount of messages to collect.
+ `max`: The maximum amount of messages to collect.
```

### MessageEmbed

#### MessageEmbed#client

`messageEmbed.client` has been removed entirely.

#### MessageEmbed#message

`messageEmbed.message` has been removed entirely.

#### MessageEmbed#setTimestamp
`messageEmbed.setTimestamp()` now accepts a timestamp.

### MessageReaction

#### MessageReaction#fetchUsers

The first parameter in `reaction.fetchUsers()` has been changed. The `limit` parameter from v11 has been merged into an object as the first parameter.

```diff
- reaction.fetchUsers(50);
+ reaction.fetchUsers({ limit: 50 });
```

### OAuth2Application

The `OAuth2Application` class has been renamed to `ClientApplication`.

#### OAuth2Application#reset

`application.reset()` has been split up into `application.resetSecret()` and `application.resetToken()`.

#### OAuth2Application#iconURL

`application.iconURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- user.iconURL;
+ user.iconURL();
+ user.iconURL({ format: 'png', size: 1024 });
```

### Permissions

#### Permissions#flags

The following permission flags have been renamed:

* `READ_MESSAGES` -> `VIEW_CHANNEL`
* `EXTERNAL_EMOJIS` -> `USE_EXTERNAL_EMOJIS`
* `MANAGE_ROLES_OR_PERMISSIONS` -> `MANAGE_ROLES`

#### Permissions#member

`permissions.member` has been removed entirely.

#### Permissions#missingPermissions

`permissions.missingPermissions()` has been renamed to `permissions.missing()` and also refactored. The second parameter in v11 was named `explicit`, described as "Whether to require the user to explicitly have the exact permissions", defaulting to `false`. However, the second parameter in v11 is named `checkAdmin`, described as "Whether to allow the administrator permission to override", defaulting to `true`.

```diff
- permissions.missingPermissions(['MANAGE_SERVER']);
+ permissions.missing(['MANAGE_SERVER']);
```

#### Permissions#raw

`permissions.raw` has been removed in favor of `permissions.bitfield`.

```diff
- permissions.raw;
+ permissions.bitfield;
```

### Receiver
`receiver.createOpusStream(user)` and `receiver.createPCMStream(user)` have been removed in favor of `receiver.createStream()`.

```diff
- receiver.createOpusStream(message.author);
+ receiver.createStream(message.author, {mode: 'opus', end: 'silence'});
```

### RichEmbed

The `RichEmbed` class has been removed in favor of the `MessageEmbed` class.

#### RichEmbed#attachFile

```diff
- permissions.raw;
+ permissions.bitfield;
```

### RichEmbed

The `RichEmbed` class has been removed in favor of the `MessageEmbed` class.

#### RichEmbed#attachFile

`richEmbed.attachFile()` has been removed in favor of `messageEmbed.attachFiles()`.

```diff
- new RichEmbed().attachFile('attachment://file-namme.png');
+ new MessageEmbed().attachFiles(['attachment://file-namme.png']);

- new RichEmbed().attachFile({ attachment: './file-name.png' });
+ new MessageEmbed().attachFiles([{ attachment: './file-name.png' }]);

- new RichEmbed().attachFile(new Attachment('./file-name.png'));
+ new MessageEmbed().attachFiles([new MessageAttachment('./file-name.png')]);
```

### Role

#### Role#hasPermission(s)

`role.hasPermission()` and `role.hasPermissions()` have been removed in favor of `permissions.has()`.

```diff
- role.hasPermission('MANAGE_MESSAGES');
+ role.permissions.has('MANAGE_MESSAGES');
```

```diff
- role.hasPermissions(['MANAGE_MESSAGES', 'MANAGE_SERVER']);
+ role.permissions.has(['MANAGE_MESSAGES', 'MANAGE_SERVER']);
```

### TextChannel

#### TextChannel#createCollector

`channel.createCollector()` has been removed in favor of `channel.createMessageCollector()`. In addition, the `max` and `maxMatches` properties were renamed and repurposed. You can read more about that [here](/additional-info/changes-in-v12?id=messagecollectormaxmatches).

```diff
- channel.createCollector(filterFunction, { maxMatches: 2, max: 10, time: 15000 });
+ channel.createMessageCollector(filterFunction, { max: 2, maxProcessed: 10, time: 15000 });
```

### User

#### User#avatarURL

`user.avatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- user.avatarURL;
+ user.avatarURL();
+ user.avatarURL({ format: 'png', size: 1024 });
```

#### User#displayAvatarURL

`user.displayAvatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- user.displayAvatarURL;
+ user.displayAvatarURL();
+ user.displayAvatarURL({ format: 'png', size: 1024 });
```
### voiceConnection

#### VoiceConnection#createReceiver
`voiceconnection.createReceiver()` has been removed, the receiver can now simply be accessed from `voiceConnection.receiver`


### Webhook

#### Webhook#send\*\*\*

Just like the `Channel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [Channel#send\*\*\*](/additional-info/changes-in-v12?id=channelsend) section for more information.

---

## Additions

<p class="warning">Remember to add examples for the additions.</p>

### Channel

#### Channel#type

`channel.type` now may also return `category` or `unknown`.

### Client

#### client.rateLimit

`client.rateLimit` is an event now emitted whenever the client hits ratelimits while making a request

### DataStore

The DataStore class was added in order to store various data types. Uses include
- RoleStore
- UserStore
- GuildStore
- ChannelStore
- MessageStore
- PresenceStore
- ReactionStore
- GuildEmojiStore
- GuildMemberStore
- GuildChannelStore
- ReactionUserStore
- GuildEmojiRoleStore
- GuildMemberRoleStore


### Emoji

#### Emoji#addRestrictedRoles

`emoji.addRestrictedRoles()` now also accepts a `Collection` of `Role` objects,, as opposed to only an array of `RoleResolvable`s.

#### Emoji#delete

`emoji.delete()` has been added and (optionally) accepts a `reason` string as the first parameter.

#### Emoji#removeRestrictedRoles

`emoji.removeRestrictedRoles()` now also accepts a `Collection` of `Role` objects,, as opposed to only an array of `RoleResolvable`s.

### GroupDMChannel

#### GroupDMChannel#edit

`groupDM.edit()` has been added, accepts a `data` object as the first parameter, and (optionally) a `reason` string as the second parameter.

### Guild

#### Guild#createChannel

The third parameter in `guild.createChannel()` has been refactored in the following manner:

* It now accepts a `nsfw` property (boolean).
* It now accepts a `bitrate` property (number, voice channels only).
* It now accepts a `userLimit` property (number, voice channels only).
* It now accepts a `parent` property (ChannelResolvable).
* The `overwrites` now accepts an array of `ChannelCreationOverwrites`.

```js
guild.createChannel('secret-text-channel', 'text', {
	nsfw: true,
	overwrites: [
		{
			deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
			id: '123456789012345678',
		},
		{
			allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
			id: '876543210987654321',
		},
	],
});

guild.createChannel('Secret Voice Channel', 'voice', {
	bitrate: 64,
	userLimit: 2,
	parent: '123456789012345678',
});
```

#### Guild.createIntegration
`guild.createIntegration()` has been added.

#### Guild#defaultMessageNotifications
`guild.defaultMessageNotifications` has been added.

#### Guild.fetchEmbed
`guild.fetchEmbed` has been added.

#### Guild.fetchIntegrations
`guild.fetchIntegrations()` has been added.

#### Guild#fetchVanityCode
`guild.fetchVanityCode()` has been added. 

#### Guild.setEmbed
`guild.setEmbed` has been added.

#### Guild#verified
`guild.verified` has been added.

### GuildAuditLogs

#### GuildAuditLogs#Actions

`auditLogs.Actions()` has been added (static method).

#### GuildAuditLogs#Targets

`auditLogs.Targets()` has been added (static method).

### GuildChannel

#### GuildChannel#lockPermissions

`channel.lockPermimssions()` has been added.

#### GuildChannel#parent(ID)

`channel.parent` and `channel.parentID` have been added.

#### GuildChannel#setParent

`channel.setParent()` has been added.

### Message

#### Message#activity

`message.activity` has been added.

#### Message#application

`message.application` has been added.

#### Message.url
`message.url` has been added.

### MessageAttachment

#### MessageAttachment#setAttachment

`attachment.setAttachment()` has been added.

#### MessageAttachment#setFile

`attachment.setFile()` has been added.

#### MessageAttachment#setName

`attachment.setName()` has been added.

### MessageEmbed

#### MessageEmbed#length
`MessageEmbed.length` has been added.

### MessageMentions

#### MessageMentions#has

`mentions.has()` has been added.

### ClientApplication

#### ClientApplication#cover

`application.cover` has been added.

#### ClientApplication#coverImage

`application.coverImage()` has been added.

#### ClientApplication#createAsset

`application.createAsset()` has been added.

#### ClientApplication#fetchAssets

`application.fetchAssets()` has been added.

### ClientOptions

#### ClientOptions#retryLimit
`ClientOption.retryLimit` parameter was added

### Permission

#### Permissions#flags
`PRIORITY_SPEAKER` has been added.

### PermissionOverwrites

#### PermissionOverwrites#allowed

`permissionOverwrites.allowed` has been added.

#### PermissionOverwrites#denied

`permissionOverwrites.denied` has been added.

### TextChannel#rateLimitPerUser
`TextChannel.rateLimitPerUser()` was added.

### TextChannel#lastPinTimestamp
`TextChannel.lastPinTimestamp` was added.

### TextChannel#lastPinAt
`TextChannel.lastPinAt` was added.

### User

#### User#local
`user.local` has been added

### Util#Constants

#### Constant.Colors
`WHITE` was added as a value.
