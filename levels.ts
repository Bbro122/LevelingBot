//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |

import { GuildMember } from "discord.js";

//______________________________/
const fs = require('fs')
const can = require('canvas')
const { Client, Intents, Message } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, WebhookClient } = require('discord.js');
const client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],intents: [new Intents(32767)],fetchAllMembers: true}); 
let miniTimer = {}
let currentWord = []
let xp = require('./xpmanager.js')
let game = require('./gamemanager.js');
const { assert } = require('console');
const unoids = ["join","start","cancel"]
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
function checkOwner(interaction) {
    if (interaction.user.id=='316243027423395841') {
        return true
    } else {
        interaction.reply("Unpermitted Access- This command is only usable by the regretful one.")
        return false
    }
}
async function getImage(exp: number, requirement: number, username: any, number: any, level: any, imagelink: any, rank: any) {
    let canvas = can.createCanvas(1200, 300)
    let context = canvas.getContext('2d')
    context.fillStyle = '#171717'
    context.fillRect(0, 0, 1200, 300)
    context.fillStyle = '#171717'
    context.fillRect(325, 200, 800, 50)
    context.fillStyle = '#00EDFF'
    context.fillRect(325, 200, Math.round((exp-xp.level(level-1)) / (requirement-xp.level(level-1)) * 800), 50)
    context.drawImage(await can.loadImage(imagelink), 50, 50, 200, 200)
    context.drawImage(await can.loadImage('./Overlay.png'), 0, 0, 1200, 300)
    context.fillStyle = '#ffffff'
    context.font = '40px Arial'
    context.fillText(`Rank #${rank}`, 325, 100)
    context.fillText(username, 325, 190)
    let wid = context.measureText(username).width
    context.font = '30px Arial'
    context.fillText(number, 335 + wid, 192)
    context.fillText(`${exp-xp.level(level-1)} / ${requirement-xp.level(level-1)} XP`, 1125 - context.measureText(`${exp-xp.level(level-1)} / ${requirement-xp.level(level-1)} XP`).width, 192)
    context.fillStyle = '#00EDFF'
    context.fillText("Level", 960, 75)
    context.font = '60px Arial'
    context.fillText(level, 1043, 75)
    return canvas.toBuffer('image/png')
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('ready',async () => {
    try{client.guilds.cache.get('632995494305464331').commands.set(require('./commands.json'))}catch(err){console.log(err)}
    game.selGame(client.channels.cache.get('740652127164301454'),client)
})
client.on('messageCreate',async msg => {
    if (msg.guild.id == '632995494305464331') {
    if (msg.author.bot == false) {
    if (msg.content.length > 5) {
        xp.give(msg,15 + Math.floor(Math.random()*10),true,client)
    }
    if (msg.channel.id=='740652127164301454') {
        game.checkWord(msg)
    } else if (msg.channel.id == '840394626220687360') {
        require('./counting.js')(client,msg)
    }
}
}
})
client.on('interactionCreate',async interaction => {
    console.log(interaction.commandName)
    if (interaction.commandName == 'level') {
        await interaction.deferReply()
        let data = xp.get()
        let user: { xp: number; level: any; };
        let member: GuildMember
        if (interaction.options.get('user')) {
        member = interaction.options.get('user').member
        user = data.users.find((user: { id: any; }) => user.id == interaction.options.get('user').value)
        } else {
            member = interaction.member
            user = data.users.find((user: { id: any; }) => user.id == interaction.user.id)
        }
        let data2 = xp.get().users.sort((a,b)=>{return b.xp - a.xp})
        data2.findIndex(user2 => user2 == user)
        if (user) {
            getImage(user.xp,xp.level(user.level),member.user.username,member.user.discriminator,user.level,member.displayAvatarURL().replace('webp','png'),data2.findIndex(user2 => user2 == user)+1).then(buffer => {
                const attachment = new MessageAttachment(buffer,"LevelCard.png")
                interaction.editReply({files:[attachment]})
            })
        } else {
            getImage(55,xp.level(0),member.user.username,member.user.discriminator,0,member.displayAvatarURL().replace('webp','png'),data2.findIndex(user2 => user2 == user)+1).then(buffer => {
                const attachment = new MessageAttachment(buffer,"LevelCard.png")
                interaction.editReply({files:[attachment]})
            })
        }
    } else if (interaction.commandName == 'leaderboard') {
       await interaction.guild.members.fetch()
       let data = xp.get().users.sort((a,b)=>{return b.xp - a.xp})
       let fields = []
       if (client.users.cache.get(data[0].id)) {
        fields.push({"name":`🥇 ${interaction.guild.members.cache.get(data[0].id).dislayName} (${data[0].level})`,"value":`Xp: ${data[0].xp}`,"inline":false})
        } else {
            fields.push({"name":`🥇 [Unknown Error- ${data[0].id}]`,"value":`Xp: ${data[0].xp}`,"inline":false})
       }
       if (client.users.cache.get(data[1].id)) {
        fields.push({"name":`🥈 ${interaction.guild.members.cache.get(data[1].id).dislayName} (${data[1].level})`,"value":`Xp: ${data[1].xp}`,"inline":false})
        } else {
            fields.push({"name":`🥈 [Unknown Error- ${data[1].id}]`,"value":`Xp: ${data[1].xp}`,"inline":false})
       }
       if (client.users.cache.get(data[1].id)) {
        fields.push({"name":`🥉 ${interaction.guild.members.cache.get(data[2].id).dislayName} (${data[2].level})`,"value":`Xp: ${data[2].xp}`,"inline":false})
        } else {
            fields.push({"name":`🥉 [Unknown Error- ${data[2].id}]`,"value":`Xp: ${data[2].xp}`,"inline":false})
       }
       for (let i = 3; i <= 9; i++) {
            if (interaction.guild.members.cache.get(data[i].id)) {
            fields.push({"name":`${i+1}. ${interaction.guild.members.cache.get(data[i].id).dislayName} (${data[i].level})`,"value":`Xp: ${data[i].xp}`,"inline":false})
            } else {
                fields.push({"name":`${i+1}. [Unknown Error- ${data[i].id}]`,"value":`Xp: ${data[i].xp}`,"inline":false})
            }
       }
       assert()
       let embed = {title:"Leaderboard",description:"",fields:fields}
       interaction.reply({embeds:[embed]})
    } else if (interaction.commandName == 'scramble'&&checkOwner(interaction)) {
        game.scramble()
    } else if (interaction.commandName == 'crash'&&checkOwner(interaction)) {
     	require('./crash.js')()
    } else if (interaction.commandName == 'givexp'&&checkOwner(interaction)) {
        interaction.deferReply()
        xp.giveall(interaction)
        interaction.editReply('All users have received 1 xp.')
    } else if (interaction.commandName == 'test'&&checkOwner(interaction)) {
        require('./UnoMaster.js').startNewGame(interaction)
    } else if (unoids.includes(interaction.customId)) {require('./UnoMaster.js').command(interaction)}
})
client.login(require("./config.json").token2);
