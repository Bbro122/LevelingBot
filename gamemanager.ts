import { Embed } from "@discordjs/builders"
import { ActionRowBuilder, Channel, Client, CommandInteraction, EmbedBuilder, Message, SelectMenuBuilder, StageChannel, TextChannel } from "discord.js"
let axios = require('axios')
let client: Client
let channel: TextChannel
let currentWord: string
let miniTimer: NodeJS.Timeout
function randomize(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
exports.setup = function setup(client1: Client, channel1: TextChannel) {
    client = client1
    channel = channel1
}
exports.selGame = function selectGame() {
    let random = randomize(0, 2)
    if (random==0) {
        exports.scramble()
    } else if (random==1) {
        exports.math()
    } else if (random==2) {
        exports.trivia()
    }
}
exports.math = function math() {
    miniTimer = setTimeout(() => exports.selGame(), 3600000)
    let time = new Date().getHours()
    if (time >= 7 && time <= 22) {
        let termCount = randomize(2, require('./config.json').server.maxTerms)
        let terms: string = ''
        let expressions = ['+', '-', '*']
        for (let i = 0; i < termCount; i++) {
            terms = terms + randomize(5, 25).toString() + " "
            if (i + 1 < termCount) {
                terms = terms + expressions[randomize(0, 2)] + " "
            }
        }
        currentWord = eval(terms).toString()
        let embed = new Embed()
            .setTitle(`Solve the problem`)
            .setDescription(terms)
            .setColor(0x00FFFF)
            .setFooter({ text: `You have 2 hours to solve for 50 xp` })
        if (channel) {
            channel.send({ embeds: [embed] })
        } else {
            client.channels.cache.get(require('./config.json').server.gamechannel)
        }
    }
}
exports.trivia = async function trivia() {
    let trivia
    try {
        trivia = await axios.get('https://the-trivia-api.com/api/questions?limit=1&difficulty=easy')
    } catch (error) {
        exports.math()
        return
    }
    miniTimer = setTimeout(() => {exports.selGame()}, 3600000)
    let time = new Date().getHours()
    if (time >= 7 && time <= 22) {
        let question = trivia.data[0]
        let answers = [question.correctAnswer].concat(question.incorrectAnswers)
        function Randomize() {
            for (let i = answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]];
            }
        }
        Randomize()
        answers.forEach(answer => {
            answers[answers.findIndex(a => a == answer)] = answer.slice(0,100)
        })
        let embed = new EmbedBuilder()
        .setColor('LuminousVividPink')
        .setTitle(question.category)
        .setDescription(question.question)
        .addFields([{value:answers[0],name:'A.'},{value:answers[1],name:'B.'},{value:answers[2],name:'C.'},{value:answers[3],name:'D.'}])
        .setFooter({text:'Do not enter the answer by letter, answer correctly for 50 xp'})
        let row = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
            new SelectMenuBuilder()
            .addOptions({value:answers[0],label:answers[0]},{value:answers[1],label:answers[1]},{value:answers[2],label:answers[2]},{value:answers[3],label:answers[3]})
            .setCustomId('guess')
        )
        if (channel) {
            channel.send({embeds: [embed],components: [row] }).then(msg => {
                setTimeout(() => {msg.edit({components:undefined})}, 3600000)
            })
            let collector = channel.createMessageComponentCollector({time:3600000})
            let users:string[] = []
            collector.on('collect', interaction => {
                if (users.includes(interaction.user.id)) {
                    interaction.reply({ephemeral:true,content:'Question already attempted.'})
                } else if (interaction.isSelectMenu()) {
                    users.push(interaction.user.id)
                    if (interaction.values[0]==question.correctAnswer) {
                        interaction.reply(`<@${interaction.user.id}> Chose the correct answer.`)
                        require('./xpmanager.js').give({author:interaction.user,channel:channel}, 50, false, client)
                    } else {
                        interaction.reply(`<@${interaction.user.id}> Chose incorrectly.`)
                    }
                }
            })
        } else {
            client.channels.cache.get(require('./config.json').server.gamechannel)
        }
    }
}
exports.scramble = function scramble() {
    miniTimer = setTimeout(() => exports.selGame(), 3600000)
    let time = new Date().getHours()
    if (time >= 7 && time <= 22) {
        let words: string[] = require('./scramble.json')
        currentWord = words[Math.floor(Math.random() * (words.length))]
        let wordArr: string[] = []
        for (let i = 0; i < currentWord['length']; i++) {
            wordArr.push(currentWord.charAt(i))
        }
        function Randomize() {
            for (let i = wordArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [wordArr[i], wordArr[j]] = [wordArr[j], wordArr[i]];
            }
        }
        while (wordArr.join('') == currentWord) { Randomize() }
        let embed = new Embed()
            .setTitle(`Unscramble the word`)
            .setDescription(wordArr.join(''))
            .setColor(0x00FFFF)
            .setFooter({ text: `You have 2 hours to unscramble for 50 xp` })
        if (channel) {
            channel.send({ embeds: [embed] })
        } else {
            client.channels.cache.get(require('./config.json').server.gamechannel)
        }
    }
}
exports.checkWord = function (msg: Message) {
    if (currentWord&&msg.content.toLowerCase() == currentWord.toLowerCase()&&!(msg.channel instanceof StageChannel)) {
        msg.channel.send(`<@${msg.author.id}> solved the problem.`)
        require('./xpmanager.js').give(msg, 50, false, client)
        currentWord = ''
    }
}