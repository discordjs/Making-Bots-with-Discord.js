# Slash command permissions

Slash commands also have their own permissions system, which allows you to control who has access to use those commands. Unlike the slash commands permission setting within the Discord client, you can fine tune access to commands without preventing the selected user or role from using all commands.

::: tip
If you set `defaultPermission: false` when creating a command you can immediately disable it for everyone including guild administrators and yourself.
:::


## User permissions

To begin, we'll fetch an `ApplicationCommand` and then set the permissions using the `ApplicationCommand#setPermissions()` method:

```js
client.on('message', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!perms' && message.author.id === client.application?.owner.id) {
		const command = await client.application?.commands.fetch('876543210987654321');

		const permissions = [
			{
				id: '224617799434108928',
				type: 'USER',
				permission: false,
			},
		];

		await command.setPermissions(permissions);
	}
});
```

Now you have successfully denied the user who's `id` you used access to this application command.
If you have a command that is disabled by default and you want to grant someone access to use it, do as follows:

```js {11}
client.on('message', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!perms' && message.author.id === client.application?.owner.id) {
		const command = await client.application?.commands.fetch('123456789012345678');

		const permissions = [
			{
				id: '224617799434108928',
				type: 'USER',
				permission: true,
			},
		];

		await command.setPermissions(permissions);
	}
});
```

And that's how you use slash command permissions to deny or allow access to a single user!


## Role permissions

Now you may want to allow (or deny) multiple users the usage of a command. In this scenario you can apply a permission that is scoped to a role instead of a user:

```js {10,11}
client.on('message', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!perms' && message.author.id === client.application?.owner.id) {
		const command = await client.application?.commands.fetch('876543210987654321');

		const permissions = [
			{
				id: '464464090157416448',
				type: 'ROLE',
				permission: false,
			},
		];

		await command.setPermissions(permissions);
	}
});
```

With this, you have successfully denied an entire role access to this command. If you want to allow a certain role to access this command, you repeat this procedure while setting `permission: true` in the `ApplicationCommandPermissionData` as shown below:

```js {11}
client.on('message', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!perms' && message.author.id === client.application?.owner.id) {
		const command = await client.application?.commands.fetch('123456789012345678');

		const permissions = [
			{
				id: '464464090157416448',
				type: 'ROLE',
				permission: true,
			},
		];

		await command.setPermissions(permissions);
	}
});
```


## Bulk update permissions

If you have a lot of commands, you likely want to update their permissions in one go instead of one-by-one, for this approach you can use `GuildApplicationCommandManager#setPermissions` as outlined below:

```js {5-22,24}
client.on('message', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!perms' && message.author.id === client.application?.owner.id) {
		const permissions = [
			{
				id: '123456789012345678',
				permissions: [{
					id: '224617799434108928',
					type: 'USER',
					permission: false,
				}],
			},
			{
				id: '876543210987654321',
				permissions: [{
					id: '464464090157416448',
					type: 'ROLE',
					permission: true,
				}],
			},
		];

		await client.guilds.cache.get('123456789012345678')?.commands.setPermissions(permissions);
	}
});
```

And that's all you need to know on slash command permissions!