
import { Channel, Client, CommandInteraction, Message, TextChannel } from "discord.js"

let client: Client
let channel: TextChannel
let currentWord: string
let miniTimer: NodeJS.Timeout
function randomize(min:number, max:number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
exports.setup = function setup(client1: Client,channel1: TextChannel) {
    client=client1
    channel=channel1
}
exports.selGame = function selectGame() {
    if (randomize(0,1)) {
        exports.scramble()
    } else {
        exports.math()
    }
}
exports.math = function math() {
    miniTimer = setTimeout(() => exports.selGame(),7200000)
    let time = new Date().getHours()
    if (time >= 7&&time<=22) {
        let termCount = randomize(2,require('./config.json').server.maxTerms)
        let terms:string=''
        let expressions = ['+','-','*']
        for (let i = 0; i < termCount; i++) {
            terms = terms+randomize(5,25).toString()+" "
            if (i+1<termCount) {
                terms = terms+expressions[randomize(0,2)]+" "
            }
        }
        currentWord = eval(terms).toString()
        let embed = {
            "type": "rich",
            "title": `Solve the problem`,
            "description": terms,
            "color": 0x00FFFF,
            "footer": {
              "text": `You have 2 hours to solve for 50 xp`
            }
        }
        if (channel) {
        channel.send({embeds:[embed]})
        } else {
            client.channels.cache.get(require('./config.json').server.gamechannel)
        }
    }
}
exports.scramble = function scramble() {
    miniTimer = setTimeout(() => exports.selGame(),7200000)
    let time = new Date().getHours()
    if (time >= 7&&time<=22) {
    let words:string[] = require('./scramble.json')
    currentWord = words[Math.floor(Math.random()*(words.length))]
    let wordArr:string[]=[]
    for (let i = 0; i < currentWord['length']; i++) {
	    wordArr.push(currentWord.charAt(i))
    }
    function Randomize() {
    for (let i = wordArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArr[i], wordArr[j]] = [wordArr[j], wordArr[i]];
    }
    }
    Randomize()
    if (wordArr.join('')==currentWord) {Randomize()}
    let embed = {
        "type": "rich",
        "title": `Unscramble the word`,
        "description": wordArr.join(''),
        "color": 0x00FFFF,
        "footer": {
          "text": `You have 2 hours to unscramble for 50 xp`
        }
    }
    if (channel) {
        channel.send({embeds:[embed]})
        } else {
            client.channels.cache.get(require('./config.json').server.gamechannel)
        }
    }
}
exports.checkWord = function (msg:Message) {
    if (msg.content.toLowerCase() == currentWord) {
    msg.channel.send(`<@${msg.author.id}> solved the problem.`)
    require('./xpmanager.js').give(msg,50,false,client)
    currentWord = ''
    }
}