//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
//______________________________/
const fs = require('fs')
const { Client, Intents, Message } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, WebhookClient } = require('discord.js');
const client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],intents: [new Intents(32767)],fetchAllMembers: true}); 
let timeouts = []
let miniTimer = {}
let currentWord = []
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
function level(lvl) {
    return (5 * (lvl**2) + (50 * lvl) + 100)
}
function createTimeout(id,time) {
    let timeout = {}
    if (time) {
	timeout = {id:id,timeout:setTimeout(() => timeouts.splice(timeouts.findIndex(timet => timet.timeout == timeout),1),time)}
    } else {
	timeout = {id:id,timeout:setTimeout(() => timeouts.splice(timeouts.findIndex(timet => timet.timeout == timeout),1),60000)}  
    }
    timeouts.push(timeout)
}
function read() {
    return require("./userdata.json")
}
function selectGame() {
    scramble({channel:client.channels.cache.get('909980741553758290')})
}
function write(file) {
    if (file.name == 'users') {fs.writeFileSync('./userdata.json',JSON.stringify(file))}
}
function scramble(interaction) {
    miniTimer = setTimeout(() => selectGame(),600000)
    let words = require('./scramble.json')
    currentWord = words[Math.floor(Math.random()*(words.length))]
    let wordArr = []
    for (let i = 0; i < currentWord.length; i++) {
	    wordArr.push(currentWord.charAt(i))
    }
    for (let i = wordArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArr[i], wordArr[j]] = [wordArr[j], wordArr[i]];
    }
    let embed = {
        "type": "rich",
        "title": `Unscramble the word`,
        "description": wordArr.join(''),
        "color": 0x00FFFF,
        "footer": {
          "text": `You have 10 minutes to unscramble for 20 xp`
        }
    }
    interaction.channel.send({embeds:[embed]})
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('ready',async () => {
    try{client.guilds.cache.get('632995494305464331').commands.set(require('./commands.json'))}catch(err){console.log(err)}
    selectGame({channel:909980741553758290})
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
    if (msg.content.toLowerCase() == currentWord) {
        msg.channel.send(`<@${msg.author.username}> got the word.`)
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
        } else {
            user = {id:msg.author.id,xp:Math.round(Math.random() * 10) + 15,level:0}
            data.users.push(user)
            write(data)
        }
        currentWord = ''
    } else if (msg.channel.id == '931368551900672080') {
        require('./counting.js')(client,msg)
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
    } else if (interaction.commandName == 'scramble') {
        scramble(interaction)
    }
})
client.login(require("./config.json").token2);
