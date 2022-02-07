//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
//______________________________/
const fs = require('fs')
const { Client, Intents, Message } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, WebhookClient } = require('discord.js');
const client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],intents: [new Intents(32767)],fetchAllMembers: true}); 
let miniTimer = {}
let currentWord = []
let xp = require('./xpmanager.js')
let game = require('./gamemanager.js')
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
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
    if (interaction.commandName == 'level') {
        let data = xp.get()
        let user = data.users.find(user => user.id == interaction.user.id)
        if (user) {
            interaction.reply(`**Level**: ${user.level}\n**Xp**: ${user.xp}/${xp.level(user.level)}`)
        } else {
            interaction.reply('**Level**: 0\n**Xp**: 0/100')
        }
    } else if (interaction.commandName == 'leaderboard') {
       let data = xp.get().users.sort((a,b)=>{return b.xp - a.xp})
       let fields = []
       for (let i = 0; i < data.length; i++) {
        if (i <= 9) {
            fields.push({"name":`${client.users.cache.get(data[i].id).username} (${data[i].level})`,"value":`Xp: ${data[i].xp}`,"inline":false})
        }
       }
       let embed = {title:"Leaderboard",description:"",fields:fields}
       interaction.reply({embeds:[embed]})
    } else if (interaction.commandName == 'scramble') {
        game.scramble()
    } else if (interaction.commandName == 'crash',interaction.user.id == '316243027423395841') {
     	require('./crash.js')()
    }
})
client.login(require("./config.json").token2);
