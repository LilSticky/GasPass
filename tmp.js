switch (command) {

    case 'cat':
      await interaction.deferReply();
  		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
  		interaction.editReply({ files: [file] });
    break;
    case 'urban':
      await interaction.deferReply();
  		const term = interaction.options.getString('term');
  		const query = new URLSearchParams({ term });
  		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
  		if (!list.length) return interaction.editReply(`No results found for **${term}**.`);
  		const [answer] = list;
  		const embed = new MessageEmbed()
  			.setColor('#EFFF00')
  			.setTitle(answer.word)
  			.setURL(answer.permalink)
  			.addFields(
  				{ name: 'Definition', value: trim(answer.definition, 1024) },
  				{ name: 'Example', value: trim(answer.example, 1024) },
  				{ name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
  			);
  		interaction.editReply({ embeds: [embed] });
      break
    case 'ping':
      let msg = await message.reply('Pinging...');
      await msg.edit(`PONG! Message round-trip took ${Date.now() - msg.createdTimestamp}ms.`)
      break;

    case 'say':
    case 'repeat':
      if (args.length > 0)
        message.channel.send(args.join(' '));
      else
        message.reply('You did not send a message to repeat, cancelling command.')
      break
    case 'listen':
      if (args.length >= 2)
        message.channel.send('done')
      else
        message.reply('No location provided')
      break
    /* Unless you know what you're doing, don't change this command. */
    case 'help':
      let helpEmbed =  new MessageEmbed()
        .setTitle('HELP MENU')
        .setColor('GREEN')
        .setFooter(`Requested by: ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
        .setThumbnail(bot.user.displayAvatarURL());
      if (!args[0])
        helpEmbed
          .setDescription(Object.keys(commands).map(command => `\`${command.padEnd(Object.keys(commands).reduce((a, b) => b.length > a.length ? b : a, '').length)}\` :: ${commands[command].description}`).join('\n'));
      else {
        if (Object.keys(commands).includes(args[0].toLowerCase()) || Object.keys(commands).map(c => commands[c].aliases || []).flat().includes(args[0].toLowerCase())) {
          let command = Object.keys(commands).includes(args[0].toLowerCase())? args[0].toLowerCase() : Object.keys(commands).find(c => commands[c].aliases && commands[c].aliases.includes(args[0].toLowerCase()));
          helpEmbed
            .setTitle(`COMMAND - ${command}`)

          if (commands[command].aliases)
            helpEmbed.addField('Command aliases', `\`${commands[command].aliases.join('`, `')}\``);
          helpEmbed
            .addField('DESCRIPTION', commands[command].description)
            .addField('FORMAT', `\`\`\`${config.prefix}${commands[command].format}\`\`\``);
        } else {
          helpEmbed
            .setColor('RED')
            .setDescription('This command does not exist. Please use the help command without specifying any commands to list them all.');
        }
      }
      message.channel.send(embed);
      break;
    }