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
  if(command.data && command.data.name) {
  	client.commands.set(command.data.name, command); 
  } else {
    console.error(`file ${file} does not have .data or .data.name property.`)
  }
}

client.once('ready', () => console.log(`Logged in as ${client.user.tag}.`));

client.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return;
  
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

client.login(config.token);