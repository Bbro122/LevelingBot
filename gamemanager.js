let Client
let channel = {}
let currentWord;
exports.selGame = function selectGame(channel1,client) {
    if (channel1) {
        channel = channel1
    }
    if (client) {
        Client = client
    }
    exports.scramble()
}
exports.scramble = function scramble(channel1,client) {
    if (channel1) {
        channel = channel1
    }
    if (client) {
        Client = client
    }
    miniTimer = setTimeout(() => exports.selGame(),7200000)
    let words = require('./scramble.json')
    currentWord = words[Math.floor(Math.random()*(words.length))]
    let wordArr = []
    for (let i = 0; i < currentWord.length; i++) {
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
          "text": `You have 10 minutes to unscramble for 20 xp`
        }
    }
    if (channel == {}) {
    console.warn("Channel Unassigned")
    } else {channel.send({embeds:[embed]})}
}
exports.checkWord = function (msg) {
    if (msg.content.toLowerCase() == currentWord) {
    msg.channel.send(`<@${msg.author.id}> got the word.`)
    require('./xpmanager.js').give(msg,50,false,Client)
    currentWord = null
    }
}
