import { APIEmbed, APIEmbedField, APIInteractionDataResolvedGuildMember } from "discord-api-types";
import { AttachmentBuilder, Client, ActionRowBuilder, CommandInteraction, GuildMember, Interaction, Message, Embed, TextChannel, SelectMenuInteraction, SelectMenuBuilder, EmbedField, SelectMenuOptionBuilder, User, GuildMemberRoleManager, ButtonBuilder, ButtonInteraction, Partials, GatewayIntentBits, AnyAPIActionRowComponent, AnyComponentBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonStyle, ComponentType, StringSelectMenuInteraction, StringSelectMenuBuilder, StageChannel, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
//import { UserProfile, XpManager } from "./xpmanager";
//import can from 'canvas';
//let fs = require('fs')
const client = new Client({ partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User], intents: 131071 });
//let xp: XpManager = require('./xpmanager.js')
//let game = require('./gamemanager.js');
//let axios = require('axios')
let config = require("./config.json")
let medals = ['🥇', '🥈', '🥉']
let charMap = "`~1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]};:'.>,<qwertyuiopasdfghjklzxcvbnm /?|" + '"'
client.on('ready', () => {

})
client.on('interactionCreate', (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case 'addbounty': {
                
            }
                
                break;
        
            case 'removebounty': {

            }
                break;
            case 'setup': {
                const modal = new ModalBuilder()
                .setCustomId('setup')
                .setTitle('Nothing entered will disable feature.')
                const row = new ActionRowBuilder <TextInputBuilder>() 
                const gameChannel = new TextInputBuilder()
                .setCustomId('gameChannel')
                .setLabel('ID of Game Channel')
                .setStyle(TextInputStyle.Short)
                const countChannel = new TextInputBuilder()
                .setCustomId('countChannel')
                .setLabel('ID of Count Channel')
                .setStyle(TextInputStyle.Short)
                const unoChannel = new TextInputBuilder()
                .setCustomId('unoChannel')
                .setLabel('ID of Uno Thread')
                .setStyle(TextInputStyle.Short)
                const cahChannel = new TextInputBuilder()
                .setCustomId('cahChannel')
                .setLabel('ID of Cah Thread')
                .setStyle(TextInputStyle.Short)
                modal.setComponents([row.setComponents([gameChannel,countChannel,unoChannel,cahChannel])])
                interaction.showModal(modal)

            }
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId == 'setup') {

        }
    }
})
client.login(config.server.token);