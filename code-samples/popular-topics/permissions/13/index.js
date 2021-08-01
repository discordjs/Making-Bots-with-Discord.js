const util = require('util');
const { Client, Intents, Permissions } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;
	if (!interaction.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;

	const botPerms = ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'];

	if (!interaction.guild.me.permissions.has(botPerms)) {
		return interaction.reply(`I need the permissions ${botPerms.join(', ')} for this demonstration to work properly`);
	}

	if (interaction.commandName === 'mod-everyone') {
		const everyonePerms = new Permissions(interaction.guild.roles.everyone.permissions);
		const newPerms = everyonePerms.add(['MANAGE_MESSAGES', 'KICK_MEMBERS']);

		interaction.guild.roles.everyone.setPermissions(newPerms.bitfield)
			.then(() => interaction.reply('Added mod permissions to `@everyone`.'))
			.catch(console.error);
	} else if (interaction.commandName === 'unmod-everyone') {
		const everyonePerms = new Permissions(interaction.guild.roles.everyone.permissions);
		const newPerms = everyonePerms.remove(['MANAGE_MESSAGES', 'KICK_MEMBERS']);

		interaction.guild.roles.everyone.setPermissions(newPerms.bitfield)
			.then(() => interaction.reply('Removed mod permissions from `@everyone`.'))
			.catch(console.error);
	} else if (interaction.commandName === 'create-mod') {
		if (interaction.guild.roles.cache.some(role => role.name === 'Mod')) {
			return interaction.reply('A role with the name "Mod" already exists on this server.');
		}

		interaction.guild.roles.create({ name: 'Mod', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] })
			.then(() => interaction.reply('Created Mod role.'))
			.catch(console.error);
	} else if (interaction.commandName === 'check-mod') {
		if (interaction.member.roles.cache.some(role => role.name === 'Mod')) {
			return interaction.reply('You do have a role called Mod.');
		}

		interaction.reply('You don\'t have a role called Mod.');
	} else if (interaction.commandName === 'can-kick') {
		if (interaction.member.permissions.has('KICK_MEMBERS')) {
			return interaction.reply('You can kick members.');
		}

		interaction.reply('You cannot kick members.');
	} else if (interaction.commandName === 'make-private') {
		if (!interaction.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return interaction.reply('Please make sure I have the `MANAGE_ROLES` permission in this channel and retry.');
		}

		interaction.channel.permissionOverwrites.set([
			{
				id: interaction.guildId,
				deny: ['VIEW_CHANNEL'],
			},
			{
				id: client.user.id,
				allow: ['VIEW_CHANNEL'],
			},
			{
				id: interaction.user.id,
				allow: ['VIEW_CHANNEL'],
			},
		])
			.then(() => interaction.reply(`Made channel ${interaction.channel} private.`))
			.catch(console.error);
	} else if (interaction.commandName === 'create-private') {
		interaction.guild.channels.create('private', {
			type: 'GUILD_TEXT',
			permissionOverwrites: [
				{
					id: interaction.guildId,
					deny: ['VIEW_CHANNEL'],
				},
				{
					id: interaction.user.id,
					allow: ['VIEW_CHANNEL'],
				},
				{
					id: client.user.id,
					allow: ['VIEW_CHANNEL'],
				},
			],
		})
			.then(() => interaction.reply('Created a private channel.'))
			.catch(console.error);
	} else if (interaction.commandName === 'unprivate') {
		if (!interaction.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return interaction.reply('Please make sure I have the permissions MANAGE_ROLES in this channel and retry.');
		}

		interaction.channel.permissionOverwrites.delete(interaction.guildId)
			.then(() => interaction.reply(`Made channel ${interaction.channel} public.`))
			.catch(console.error);
	} else if (interaction.commandName === 'my-permissions') {
		const finalPermissions = interaction.channel.permissionsFor(interaction.member);

		interaction.reply({ content: `\`\`\`js\n${util.inspect(finalPermissions.serialize())}\`\`\`` });
	} else if (interaction.commandName === 'lock-permissions') {
		if (!interaction.channel.parent) {
			return interaction.reply('This channel is not placed under a category.');
		}

		if (!interaction.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return interaction.reply('Please make sure I have the permissions MANAGE_ROLES in this channel and retry.');
		}

		interaction.channel.lockPermissions()
			.then(() => {
				interaction.reply(`Synchronized overwrites of ${interaction.channel} with the \`${interaction.channel.parent.name}\` category.`);
			})
			.catch(console.error);
	} else if (interaction.commandName === 'role-permissions') {
		const roleFinalPermissions = interaction.channel.permissionsFor(interaction.member.roles.highest);

		interaction.reply({ content: `\`\`\`js\n${util.inspect(roleFinalPermissions.serialize())}\`\`\`` });
	}
});

client.login('your-token-goes-here');
