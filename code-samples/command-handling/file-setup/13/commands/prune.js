module.exports = {
	name: 'prune',
	description: 'Prune up to 99 messages.',
	options: [
		{
			name: 'amount',
			description: 'Number of messages to prune',
			type: 'INTEGER',
			required: true,
		},
	],

	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');

		if (amount <= 1 || amount > 100) {
			return interaction.reply({ content: 'You need to input a number between 1 and 99.', ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
		});

		return interaction.reply({ content: `Successfully pruned \`${amount}\` messages.`, ephemeral: true });
	},
};
