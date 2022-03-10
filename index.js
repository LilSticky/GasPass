const { Client, Intents, Collection } = require('discord.js');
const config = require('./config');
const fs = require('node:fs')

let client = new Client({
  intents: [Intents.FLAGS.GUILDS],
  presence: {
    status: 'online',
    activity: {
      name: `${config.prefix}help`,
      type: 'LISTENING'
    }
  }
});

// Register all Commands to Client Object
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => console.log(`Logged in as ${client.user.tag}.`));

client.on('interactionCreate', () => console.log('interaction created'));
client.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return;
  
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

client.login(config.token);