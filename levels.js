//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
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
async function getImage(xp, requirement, username, number, level, imagelink, rank) {
    let canvas = can.createCanvas(1200, 300)
    let context = canvas.getContext('2d')
    context.fillStyle = '#171717'
    context.fillRect(0, 0, 1200, 300)
    context.fillStyle = '#171717'
    context.fillRect(325, 200, 800, 50)
    context.fillStyle = '#647DFF'
    context.fillRect(325, 200, Math.round(xp / requirement * 800), 50)
    context.drawImage(await can.loadImage(imagelink), 50, 50, 200, 200)
    context.drawImage(await can.loadImage('./Overlay.png'), 0, 0, 1200, 300)
    context.fillStyle = '#ffffff'
    context.font = '40px Arial'
    context.fillText(`Rank #${rank}`, 325, 100)
    context.fillText(username, 325, 190)
    let wid = context.measureText(username).width
    context.font = '30px Arial'
    context.fillText(number, 335 + wid, 192)
    context.fillText(`${xp} / ${requirement} XP`, 1125 - context.measureText(`${xp} / ${requirement} XP`).width, 192)
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
        let user = data.users.find(user => user.id == interaction.user.id)
        let data2 = xp.get().users.sort((a,b)=>{return b.xp - a.xp})
        data2.findIndex(user2 => user2 == user)
        if (user) {
            getImage(user.xp,xp.level(user.level),interaction.user.username,interaction.user.discriminator,user.level,interaction.member.displayAvatarURL().replace('webp','png'),data2.findIndex(user2 => user2 == user)+1).then(buffer => {
                const attachment = new MessageAttachment(buffer,"LevelCard.png")
                interaction.editReply({files:[attachment]})
            })
            //`**Level**: ${user.level}\n**Xp**: ${user.xp}/${xp.level(user.level)}`)
        } else {
            await interaction.editReply('**Level**: 0\n**Xp**: 0/100')
        }
    } else if (interaction.commandName == 'leaderboard') {
       await interaction.guild.members.fetch()
       let data = xp.get().users.sort((a,b)=>{return b.xp - a.xp})
       let fields = []
       if (client.users.cache.get(data[0].id)) {
        fields.push({"name":`🥇 ${client.users.cache.get(data[0].id).username} (${data[0].level})`,"value":`Xp: ${data[0].xp}`,"inline":false})
        } else {
            fields.push({"name":`🥇 [Unknown Error- ${data[0].id}]`,"value":`Xp: ${data[0].xp}`,"inline":false})
       }
       if (client.users.cache.get(data[1].id)) {
        fields.push({"name":`🥈 ${client.users.cache.get(data[1].id).username} (${data[1].level})`,"value":`Xp: ${data[1].xp}`,"inline":false})
        } else {
            fields.push({"name":`🥈 [Unknown Error- ${data[1].id}]`,"value":`Xp: ${data[1].xp}`,"inline":false})
       }
       if (client.users.cache.get(data[1].id)) {
        fields.push({"name":`🥉 ${client.users.cache.get(data[2].id).username} (${data[2].level})`,"value":`Xp: ${data[2].xp}`,"inline":false})
        } else {
            fields.push({"name":`🥉 [Unknown Error- ${data[2].id}]`,"value":`Xp: ${data[2].xp}`,"inline":false})
       }
       for (let i = 3; i < data.length; i++) {
        if (i <= 9) {
            if (client.users.cache.get(data[i].id)) {
            fields.push({"name":`${i+1}. ${client.users.cache.get(data[i].id).username} (${data[i].level})`,"value":`Xp: ${data[i].xp}`,"inline":false})
            } else {
                fields.push({"name":`${i+1}. [Unknown Error- ${data[i].id}]`,"value":`Xp: ${data[i].xp}`,"inline":false})
            }
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
    } else if (interaction.commandName == 'test'&&checkOwner(interaction)) {
        require('./UnoMaster.js').startNewGame(interaction)
    } else if (unoids.includes(interaction.customId)) {require('./UnoMaster.js').command(interaction)}
})
client.login(require("./config.json").token2);
