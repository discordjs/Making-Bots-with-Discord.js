const { Client, EmbedBuilder, Events, GatewayIntentBits } = require('discord.js');
const { request } = require('undici');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	await interaction.deferReply();

	if (commandName === 'cat') {
		const { file } = await request('https://aws.random.cat/meow').then(response => response.body.json());
		interaction.editReply({ files: [{ attachment: file, name: 'cat.png' }] });
	} else if (commandName === 'urban') {
		const term = interaction.options.getString('term');
		const query = new URLSearchParams({ term });

		const { list } = await request(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.body.json());

		if (!list.length) {
			return interaction.editReply(`No results found for **${term}**.`);
		}

		const [answer] = list;

		const embed = new EmbedBuilder()
			.setColor(0xEFFF00)
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{
					name: 'Rating',
					value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
				},
			);
		interaction.editReply({ embeds: [embed] });
	}
});

client.login('your-token-goes-here');
