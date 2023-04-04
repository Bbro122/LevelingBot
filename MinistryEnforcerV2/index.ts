import { APIEmbed, APIEmbedField, APIInteractionDataResolvedGuildMember } from "discord-api-types";
import { AttachmentBuilder, Client, ActionRowBuilder, CommandInteraction, GuildMember, Interaction, Message, Embed, TextChannel, SelectMenuInteraction, SelectMenuBuilder, EmbedField, SelectMenuOptionBuilder, User, GuildMemberRoleManager, ButtonBuilder, ButtonInteraction, Partials, GatewayIntentBits, AnyAPIActionRowComponent, AnyComponentBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonStyle, ComponentType, StringSelectMenuInteraction, StringSelectMenuBuilder, StageChannel } from "discord.js";
//import { UserProfile, XpManager } from "./xpmanager";
import can from 'canvas';
import { XpManager } from "./modules/types";
let xpmanager:XpManager = require('./modules/xpmanager')
let fs = require('fs')
const client = new Client({ partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User], intents: 131071 });
let game = require('./gamemanager.js');
let axios = require('axios')
let config = require("./config.json")
let medals = ['🥇', '🥈', '🥉']
let charMap = "`~1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]};:'.>,<qwertyuiopasdfghjklzxcvbnm /?|" + '"'
function checkOwner(interaction: CommandInteraction, reply?: string) {
    let permissions = interaction.member?.permissions
    if (permissions && typeof permissions != 'string') {
        if (permissions.has(PermissionFlagsBits.Administrator)) {
            return true
        } else {
            if (reply) {
                interaction.reply("This command is reserved for Ministry usage only.")
            }
            return false
        }
    }
}
async function getWelcomeBanner(imagelink: string) {
    let canvas = can.createCanvas(1200, 300)
    let context = canvas.getContext('2d')
    context.drawImage(await can.loadImage(imagelink), 478, 51, 203, 203)
    context.drawImage(await can.loadImage('./welcome.png'), 0, 0, 1200, 300)
    return canvas.toBuffer('image/png')
}
async function getImage(exp: number, requirement: number, username: any, number: any, level: any, imagelink: any, rank: any, ministry?: boolean, namecard?: string) {
    let canvas = can.createCanvas(1200, 300)
    let context = canvas.getContext('2d')
    context.fillStyle = '#171717'
    context.fillRect(0, 0, 1200, 300)
    context.fillStyle = '#171717'
    context.fillRect(325, 200, 800, 50)
    context.fillStyle = '#00EDFF'
    context.fillRect(325, 200, Math.round((exp - xpmanager.getLevel(level - 1)) / (requirement - xpmanager.getLevel(level - 1)) * 800), 50)
    context.drawImage(await can.loadImage(imagelink), 50, 50, 200, 200)
    //if (ministry) { context.drawImage(await can.loadImage('./MinistrySymbol.png'), 500, 71, 26, 30); context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300) }
    //else if (overwatch) { context.drawImage(await can.loadImage('./namecards/overwatch.png'), 0, 0, 1200, 300) }
    //else { context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300) }
    if (namecard) {
        context.drawImage(await can.loadImage((namecard && typeof namecard == 'string') ? namecard : './namecards/ministry.png'), 0, 0, 1200, 300)
    } else {
        if (ministry) {
            context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300)
        } else {
            context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300)
        }
    }
    context.fillStyle = '#ffffff'
    context.font = '40px Arial'
    context.fillText(`Rank #${rank}`, 325, 100)
    context.fillText(username, 325, 190)
    let wid = context.measureText(username).width
    context.font = '30px Arial'
    context.fillText(number, 335 + wid, 192)
    context.fillText(`${exp - xpmanager.getLevel(level - 1)} / ${requirement - xpmanager.getLevel(level - 1)} XP`, 1125 - context.measureText(`${exp - xpmanager.getLevel(level - 1)} / ${requirement - xpmanager.getLevel(level - 1)} XP`).width, 192)
    context.fillStyle = '#00EDFF'
    context.fillText("Level", 960, 75)
    context.font = '60px Arial'
    context.fillText(level, 1043, 75)
    return canvas.toBuffer('image/png')
}
client.on('ready', () => {

})
client.on('interactionCreate', (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            //Xp Commands
            case 'level': {
                let user = interaction.options.get("user") as unknown as User
                if (!user) {user = interaction.user}
                let xp = xpmanager.getXP(interaction.guild?.id?interaction.guild.id:'',user.id)
                interaction.reply(xpmanager.getLevel(xp).toString())
            }
                break;
            case 'addbounty': {
                
            }
                
                break;
        
            case 'removebounty': {

            }
                break;
        }
    }
})
//client.login(config.server.token);