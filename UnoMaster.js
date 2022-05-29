const { get } = require('./xpmanager')
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require('fs')
let can = require('canvas')
const reso = 0.5
function res(num) {
    return num * reso
}
async function rotatedImg(card) {
  const canvas = can.createCanvas(450,700)
  let ctx = canvas.getContext('2d')
  ctx.translate(225,350)
  ctx.rotate(3.14)
  ctx.translate(-225,-350)
  ctx.drawImage(await can.loadImage(`../cards/${card}.png`,450,700),0,0)
  return canvas
}
async function dispBoard(hands, game, hidden) {
  const canvas = can.createCanvas(res(7000), res(7000))
  let ctx = canvas.getContext('2d')
  let logo2 = await can.loadImage(`./cards/logo2.png`)
  ctx.drawImage(await can.loadImage('./cards/background.png'), 0, 0, res(7000), res(7000))
  ctx.drawImage(await can.loadImage('./cards/logo.png'), res(2500), res(2750), res(900), res(1400))
  ctx.drawImage(await can.loadImage(`./cards/${game.deck[0]}.png`), res(3600), res(2750), res(900), res(1400))
  ctx.translate(res(3500), res(3500))
  ctx.rotate(3.14)
  ctx.translate(-res(3500), -res(3500))
  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];
    for (let i = 0; i < hand.length; i++) {
      const card = hand[i]
      if (i > 9) {
        ctx.drawImage((hidden)?logo2:await rotatedImg(card), res(3500) - res(2300) - res(50) * (i - 10), res(50), res(450), res(700))
      } else {
        ctx.drawImage((hidden)?logo2:await rotatedImg(card), res(3500) - ((hand.length <= 10) ? res(230) * hand.length : res(2300)) + res(460) * i, res(50), res(450), res(700))
      }
    }
    ctx.translate(res(3500), res(3500))
    ctx.rotate((hands.length<3)?3.14:1.57)
    ctx.translate(-res(3500), -res(3500))
  }
  return canvas.toBuffer()
}
const newDeck = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g0", "gs", "gd", "gr", "gs", "gd", "gr", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b0", "bs", "bd", "br", "bs", "bd", "br", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y0", "ys", "yd", "yr", "ys", "yd", "yr", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r0", "rs", "rd", "rr", "rs", "rd", "rr"]
let games = []
function newGame(msg, host) {
  return { id: msg.channelId, msg: msg, deck: newDeck, players: [newPlayer(host)], round: 0, inLobby: true, timeouts: [], host: host.id }
}
function findGame(chanId) {
  return games.find(game => game.id == chanId)
}
function newPlayer(plr) {
  console.log(plr)
  return { "id": plr, "hand": [] }
}
function createButton(string, id, style, emoji, disabled) { // PRIMARY:Blue DANGER:Red SUCCESS:GREEN
  return { type: 'BUTTON', label: string, customId: id, style: style, emoji: emoji, url: null, disabled: disabled }
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
    a.splice(a.indexOf(randomElement), 1)
    b.push(randomElement)
  }
  return b
}
async function startTurn(game) {
  let player = game.players[game.round % game.players.length]
  let hands = []
  for (let i = 0; i < game.players.length; i++) {
    const player = game.players[(game.round+i) % game.players.length]
    hands.push(player.hand)
  }
  const attachment = new MessageAttachment(await dispBoard(hands,game,true), 'board.png');
  game.msg.edit({
    embeds: [{ "type": "rich", "title": `${player.id.displayName}'s Turn (${game.round})`, "description": `It is now your turn, you have 15 seconds to begin.`, "color": 0xed0606, "thumbnail": { "url": `attachment://board.png`, "height": 700, "width": 450 } }], components: [row([createButton("Begin Turn", "turn", "SUCCESS", null, false)])]
    , files: [attachment]
  })
}
async function startGame(interaction) {
  let game = findGame(interaction.channelId)
  game.deck = randomizeArray(game.deck)
  for (let i = 0; i < game.players.length; i++) {
    const element = game.players[i];
    element.deck = [game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop()]
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
    }], components: [row([createButton("🎮 Join Match", "join", "SUCCESS", null, false), createButton("Start Match", "start", "SUCCESS", "814199679704891423", false), createButton("Cancel Match", "cancel", "DANGER", "814199666778308638", false)])]
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
        await game.msg.edit({ embeds: [embed] })
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