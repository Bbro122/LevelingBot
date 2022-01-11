//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
//______________________________/
const fs = require('fs')
const { Client, Intents } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, WebhookClient } = require('discord.js');
const client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],intents: [new Intents(32767);],fetchAllMembers: true}); 
let timeouts = []
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
function level(lvl) {
    return (5 * (lvl**2) + (50 * lvl) + 100)
}
function createTimeout(id) {
    let timeout = {id:id,timeout:setTimeout(() => timeouts.splice(timeouts.findIndex(timet => timet.timeout == timeout),1),60000)}
    timeouts.push(timeout)
}
function read() {
    return require("./userdata.json")
}
function write(file) {
    if (file.name == 'users') {fs.writeFileSync('./userdata.json',JSON.stringify(file))}
}
function scramble() {
    
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('ready',async () => {
    try{client.guilds.cache.get('632995494305464331').commands.set(require('./commands.json'))}catch(err){console.log(err)}
})
client.on('messageCreate',async msg => {
    if (msg.guild.id == '632995494305464331') {
    if (msg.author.bot == false) {
    if (msg.content.length > 5&&timeouts.find(timeout => timeout.id == msg.author.id) == undefined) {
        console.log(timeouts)
        let data = read()
        let user = data.users.find(user => user.id == msg.author.id)
        if (user) {
            let xpgain = Math.round(Math.random() * 10) + 15
            user.xp = user.xp + xpgain
            if (user.xp >= level(user.level)) {
                user.level++
                msg.channel.send(`**Level Up! You\'re now level ${user.level}.** \n ${level(user.level) - user.xp} xp is needed for your next level.`)
            }

            write(data)
            createTimeout(msg.author.id)
        } else {
            user = {id:msg.author.id,xp:Math.round(Math.random() * 10) + 15,level:0}
            data.users.push(user)
            write(data)
            createTimeout(msg.author.id)
        }
    }
}
}
})
client.on('interactionCreate',async interaction => {
    if (interaction.commandName == 'level') {
        let data = read()
        let user = data.users.find(user => user.id == interaction.user.id)
        if (user) {
            interaction.reply(`**Level**: ${user.level}\n**Xp**: ${user.xp}/${level(user.level)}`)
        } else {
            interaction.reply('**Level**: 0\n**Xp**: 0/100')
        }
    } else if (interaction.commandName == 'leaderboard') {
       let data = read().users.sort((a,b)=>{return b.xp - a.xp})
       let fields = []
       for (let i = 0; i < data.length; i++) {
        if (i <= 9) {
            fields.push({"name":`${client.users.cache.get(data[i].id).username} (${data[i].level})`,"value":`Xp: ${data[i].xp}`,"inline":false})
        }
       }
       let embed = {title:"Leaderboard",description:"",fields:fields}
       interaction.reply({embeds:[embed]})
    }
})
client.login(require("./config.json").token2);
