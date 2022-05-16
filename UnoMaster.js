const { get } = require('./xpmanager')
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require('fs')
let can = require('canvas')

async function dispCards(cards) {
let canvas = can.createCanvas((cards.length<10) ? Math.round(460*(cards.length%10)):4590,Math.round(760+(760*Math.floor(cards.length/10))))
for (let i = 0; i < cards.length; i++) {
    const element = cards[i];
    let context = canvas.getContext("2d")
    context.drawImage(await can.loadImage(`./cards/${element}.png`),Math.round(460*(i%10)),Math.round(760*Math.floor(i/10)))
}
return canvas.toBuffer()
}

const newDeck = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g0", "gs", "gd", "gr", "gs", "gd", "gr", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b0", "bs", "bd", "br", "bs", "bd", "br", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y0", "ys", "yd", "yr", "ys", "yd", "yr", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r0", "rs", "rd", "rr", "rs", "rd", "rr"]
let games = []
function newGame(msg,host) {
  return {id:msg.channelId, msg: msg, deck: newDeck, players: [newPlayer(host)], round: 0, inLobby: true, timeouts: [], host: host.id }
}
function findGame(chanId) {
  return games.find(game => game.id == chanId)
}
function newPlayer(plr) {
  console.log(plr)
  return { "id": plr, "hand": []}
}
function createButton(string, id, style, emoji,disabled) { // PRIMARY:Blue DANGER:Red SUCCESS:GREEN
  return { type: 'BUTTON', label: string, customId: id, style: style, emoji: emoji, url: null, disabled: disabled}
}
function row(array) {
  return { type: 'ACTION_ROW', components: array }
}
function randomizeArray(array) {
  let a = array.slice()
  let b = []
  for (let i = 0; i < array.length; i++) {
    console.log(a.length)
    const randomElement = a[Math.floor(Math.random() * a.length)]
    a.splice(a.indexOf(randomElement),1)
    b.push(randomElement)
  }
  return b
}
async function startTurn(game) {
  let player = game.players[game.round%game.players.length]
  let cards = []
  for (let i = 0; i < player.hand.length; i++) {
    const element = game.player.hand[i]
    cards.push("logo")  
  }
  const attachment = new MessageAttachment(await dispCards(cards),'card.png');
  game.msg.edit({
    embeds: [{"type": "rich","title": `${player.id.displayName}'s Turn (${game.round})`,"description": `It is now your turn, you have 15 seconds to begin.`,"color": 0xed0606,"thumbnail": {"url": `attachment://cards.png`,"height": 700, "width": 450}}], components: [row([createButton("Begin Turn", "turn", "SUCCESS", null,false)])]
    ,files:[attachment]
  })
}
async function startGame(interaction) {
  let game = findGame(interaction.channelId)
  game.deck = randomizeArray(game.deck)
  for (let i = 0; i < game.players.length; i++) {
    const element = game.players[i];
    element.deck = [game.deck.pop(),game.deck.pop(),game.deck.pop(),game.deck.pop(),game.deck.pop(),game.deck.pop(),game.deck.pop()]
    console.log(element.id.displayName + " " + element.deck)
  }
  startTurn(game)
}
exports.startNewGame = async function startNewGame(interaction) {
  let gameChan = await interaction.guild.channels.create("Test")
  let msg = await gameChan.send({
    embeds: [{
      "type": "rich",
      "title": `${interaction.member.displayName}'s Uno Match`,
      "description": `Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n1/4 players have joined`,
      "color": 0xed0606,
      "thumbnail": {
        "url": `https://cdn.discordapp.com/attachments/758884272572071944/971648962505351198/logo.png`,
        "height": 700,
        "width": 450
      },
      "fields": [{ name: interaction.member.displayName, value: `Level ${require('./userdata.json').users.find(user => user.id = interaction.user.id).level}` }]
    }], components: [row([createButton("🎮 Join Match", "join", "SUCCESS", null,false), createButton("Start Match", "start", "SUCCESS", "814199679704891423",false), createButton("Cancel Match", "cancel", "DANGER", "814199666778308638",false)])]
  })
  games.push(newGame(msg, interaction.member))
  interaction.reply(`[Unfinished] Game starting in <#${gameChan.id}>`)
}
exports.command = async function (interaction) {
  await interaction.deferReply({ ephemeral: true })
  if (interaction.customId == 'join') {
    let game = findGame(interaction.channelId)
    if (game) {
      if (game.players.find(plr => plr.id == interaction.member)) {
        await interaction.editReply({ content: 'You are already in this match.', ephemeral: true })
      } else {
        game.players.push(newPlayer(interaction.member))
        let embed = game.msg.embeds[0]
        let user = require('./userdata.json').users.find(user => user.id == interaction.member.id)
        embed.description = `Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n${game.players.length}/4 players have joined`
        embed.fields.push({ name: interaction.member.displayName, value: `Level ${user.level}` })
        await game.msg.edit({embeds:[embed]})
      }
    }
  } else if (interaction.customId == 'cancel') {
    let game = findGame(interaction.channelId)
    if (game) {
      if (interaction.user.id == game.host) {
        interaction.channel.delete()
        games.splice(games.indexOf(game), 1)
      } else {
        await interaction.editReply({ content: "Only the host can perform this action", ephemeral: true })
      }
    }
  } else if (interaction.customId == 'start') {
    let game = findGame(interaction.channelId)
    if (game) {
      if (interaction.member.id == game.host) {
        console.log(game.players.length)
        if (game.players.length > 1) {
          startGame(interaction)
        } else {
          await interaction.editReply({ content: "There must be more than 1 player for the game to start", ephemeral: true })
        }
      } else {
        await interaction.editReply({ content: "Only the host can perform this action", ephemeral: true })
      }
    }
  }
}