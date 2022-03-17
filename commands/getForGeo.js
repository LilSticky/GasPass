const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Pagination } = require("djs-pagination-buttons")
const fetch = require('node-fetch')
const config = require('../config');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getforgeo')
		.setDescription('Gets gas stations near the loaction.')
    .addNumberOption(option =>
      option.setName('latitude')
            .setDescription('The latitude of your search location.')
            .setRequired(true))
    .addNumberOption(option =>
      option.setName('longitude')
            .setDescription('The longitude of your search location.')
            .setRequired(true))
    .addIntegerOption(option =>
      option.setName('radius')
            .setDescription('The radius of your search location.')
            .setRequired(true))
    .addStringOption(option =>
      option.setName('fuel')
            .setDescription('The type of fuel your are looking for.')
            .setRequired(true)
            .addChoice('e5', 'e5')
            .addChoice('e10', 'e10')
            .addChoice('diesel', 'diesel')
            .addChoice('all', 'all')),
  
	async execute(interaction, client) {
		await interaction.deferReply();
    
    const query = new URLSearchParams({
      apikey: config.apikey,
      lat: interaction.options.getNumber('latitude'),
      lng: interaction.options.getNumber('longitude'),
      rad: interaction.options.getInteger('radius'),
      type: interaction.options.getString('fuel'),
      sort: 'price'
    })

    // get all stations from api
    fetch(`https://creativecommons.tankerkoenig.de/json/list.php?${query}`)
      .then(res => res.json())
      .then(json => {
        const pages = [];
        const stations = json.stations;
        stations.forEach(station => {
          pages.push(new MessageEmbed()
                			.setColor('#EFFF00')
                			.setTitle(station.name)
                			.addFields(
                				{ name: 'Adress', value: `${station.street} ${station.houseNumber}, ${station.postCode} ${station.place}`},
                				{ name: 'Distance', value: station.dist.toString().replace('.', ',') + ' km'},
                				{ name: 'Price', value: station.price.toString().replace('.', ',') + ' €'},
                				{ name: 'Open?', value: station.isOpen ? 'Yes' : 'No' },
                			)
                    )
        })
        return pages;
      })
    .then(pages => {
      const pagination = new Pagination(client);
      pagination.setPages(pages)
      pagination.setAuthorizedUsers([interaction.user.id]);
  		pagination.send(null, interaction)
    })
	},
};