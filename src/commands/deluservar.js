const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deluservar")
        .setDescription("Delete user variable")
		.addStringOption((option) => 
        option
            .setName("user")
            .setDescription("Username of user variable you wish to delete")
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("name")
            .setDescription("Name of user variable you wish to delete")
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.reply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], ephemeral: true})

        let user = interaction.options.getString("user")
        let name = interaction.options.getString("name")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=deluservar&user=${user}&var=${name}`)
        .then(res => res.json())
        .then(json => {
        if(json.success)
        {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('User variable deleted:', `\`${name}\``).setColor("GREEN").setTimestamp()], ephemeral: true})
        }
        else
        {
            interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`).setColor("RED").setTimestamp()], ephemeral: true})
        }
        })
    },
};