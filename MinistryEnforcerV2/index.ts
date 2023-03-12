import { APIEmbed, APIEmbedField, APIInteractionDataResolvedGuildMember } from "discord-api-types";
import { AttachmentBuilder, Client, ActionRowBuilder, CommandInteraction, GuildMember, Interaction, Message, Embed, TextChannel, SelectMenuInteraction, SelectMenuBuilder, EmbedField, SelectMenuOptionBuilder, User, GuildMemberRoleManager, ButtonBuilder, ButtonInteraction, Partials, GatewayIntentBits, AnyAPIActionRowComponent, AnyComponentBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonStyle, ComponentType, StringSelectMenuInteraction, StringSelectMenuBuilder, StageChannel } from "discord.js";
//import { UserProfile, XpManager } from "./xpmanager";
import can from 'canvas';
let fs = require('fs')
const client = new Client({ partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User], intents: 131071 });
//let xp: XpManager = require('./xpmanager.js')
let game = require('./gamemanager.js');
let axios = require('axios')
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
        }
    }
})
client.login(config.server.token);