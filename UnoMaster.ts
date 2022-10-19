import { ButtonInteraction, CommandInteraction, Emoji, EmojiIdentifierResolvable, Guild, GuildMember, Message, ActionRowBuilder, MessageActionRowComponent, ButtonBuilder, ButtonStyle, MessageComponent, MessageComponentInteraction, SelectMenuBuilder, SelectMenuComponentOptionData, MessageSelectOption, ComponentEmojiResolvable, ComponentType, ChannelType, RestOrArray, AnyComponentBuilder, embedLength } from "discord.js";
import { UserProfile } from "./xpmanager";
const { get } = require('./xpmanager')
import {AttachmentBuilder, EmbedBuilder} from 'discord.js';
const fs = require('fs')
let can = require('canvas')
let displayValues = [["Red ", "Blue ", "Green ", "Yellow "], ["Draw 2", "Reverse", "Skip"]]
const reso = 0.1
type Player = { "id": string, "hand": (string | undefined)[] }
type Game = { id: string, msg: Message, deck: string[], players: Player[], round: number, inLobby: boolean, timeouts: any[], host: string }
const newDeck = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g0", "gs", "gd", "gr", "gs", "gd", "gr", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b0", "bs", "bd", "br", "bs", "bd", "br", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y0", "ys", "yd", "yr", "ys", "yd", "yr", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r0", "rs", "rd", "rr", "rs", "rd", "rr"]
let games: Game[] = []


function res(num: number) {
  return num * reso
}
function getLabel(card: string) {
  let label = ''
  displayValues[0].forEach(color => {
    if (card.startsWith(color.charAt(0).toLowerCase())) {
      label = color
    }
  })
  let success = false
  displayValues[1].forEach(type => {
    if (card.endsWith(type.charAt(0).toLowerCase())) {
      label = label + type
      success = true
    }
  })
  if (!success) {
    label = label + card.charAt(1)
  }
  return label
}


async function rotatedImg(card: string) {
  const canvas = can.createCanvas(450, 700)
  let ctx = canvas.getContext('2d')
  ctx.translate(225, 350)
  ctx.rotate(3.14)
  ctx.translate(-225, -350)
  ctx.drawImage(await can.loadImage(`./cards/${card}.png`, 450, 700), 0, 0)
  return canvas
}


async function dispBoard(hands: (string | undefined)[][], game: Game, hidden: boolean) {
  console.log(hands[0])
  const canvas = can.createCanvas(res(7000), res(7000))
  let ctx = canvas.getContext('2d')
  let logo2 = await can.loadImage(`./cards/logo2.png`)
  //ctx.drawImage(await can.loadImage('./cards/wood.jpg'), 0, 0, res(7000), res(7000))
  ctx.drawImage(await can.loadImage('./cards/logo.png'), res(2500), res(2750), res(900), res(1400))
  ctx.drawImage(await can.loadImage(`./cards/${game.deck[0]}.png`), res(3600), res(2750), res(900), res(1400))
  ctx.translate(res(3500), res(3500))
  ctx.rotate(3.14)
  ctx.translate(-res(3500), -res(3500))
  for (let i = 0; i < hands[0].length; i++) {
    const card = hands[0][i]
    if (i > 9) {
      ctx.drawImage((hidden) ? logo2 : await rotatedImg(card ? card : 'logo'), res(3500) - res(2300) - res(50) * (i - 10), res(50), res(450), res(700))
    } else {
      ctx.drawImage((hidden) ? logo2 : await rotatedImg(card ? card : 'logo'), res(3500) - ((hands[0].length <= 10) ? res(230) * hands[0].length : res(2300)) + res(460) * i, res(50), res(450), res(700))
    }
  }
  ctx.translate(res(3500), res(3500))
  ctx.rotate((hands.length < 3) ? 3.14 : 1.57)
  ctx.translate(-res(3500), -res(3500))
  for (let i = 1; i < hands.length; i++) {
    const hand = hands[i];
    for (let i = 0; i < hand.length; i++) {
      const card = hand[i]
      if (i > 9) {
        ctx.drawImage(logo2, res(3500) - res(2300) - res(50) * (i - 10), res(50), res(450), res(700))
      } else {
        ctx.drawImage(logo2, res(3500) - ((hand.length <= 10) ? res(230) * hand.length : res(2300)) + res(460) * i, res(50), res(450), res(700))
      }
    }
    ctx.translate(res(3500), res(3500))
    ctx.rotate((hands.length < 3) ? 3.14 : 1.57)
    ctx.translate(-res(3500), -res(3500))
  }
  return canvas.toBuffer()
}


function newGame(msg: Message, host: string) {
  return { id: msg.channelId, msg: msg, deck: newDeck, players: [newPlayer(host)], round: 0, inLobby: true, timeouts: [], host: host }
}


function newPlayer(plr: string) {
  return { "id": plr, "hand": [] }
}


function createButtons(rawButtons:{string: string, id: string, style: ButtonStyle, emoji?: ComponentEmojiResolvable | null, disabled?: boolean}[]) { // PRIMARY:Blue DANGER:Red SUCCESS:GREEN
  let buttons:ButtonBuilder[] = []
  rawButtons.forEach(buttonData=>{
    let button = new ButtonBuilder()
    .setCustomId(buttonData.id)
    .setLabel(buttonData.string)
    .setStyle(buttonData.style)
    .setDisabled(buttonData.disabled)
    if (buttonData.emoji) {
      button.setEmoji(buttonData.emoji)
    }
    buttons.push(button)
  })
  let row = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(buttons)
  return row
}
function randomizeArray(array: any[]) {
  let a = array.slice()
  let b = []
  for (let i = 0; i < array.length; i++) {
    const randomElement = a[Math.floor(Math.random() * a.length)]
    a.splice(a.indexOf(randomElement), 1)
    b.push(randomElement)
  }
  return b
}


async function startTurn(interaction: MessageComponentInteraction, game: Game) {
  let player = game.players[game.round % game.players.length]
  let member = interaction.guild?.members.cache.get(player.id) ? interaction.guild?.members.cache.get(player.id) : interaction.member
  let hands: (string | undefined)[][] = []
  hands.push(player.hand)
  for (let i = 0; i < game.players.length; i++) {
    const plr = game.players[(game.round + i) % game.players.length]
    if (plr != player) {
      hands.push(plr.hand)
    }
  }
  const attachment = new AttachmentBuilder(await dispBoard(hands, game, true));
  await game.msg.edit({ content: '<a:loading:1011794755203645460>', embeds: [], components: [] })
  await game.msg.edit({
    content: null,
    embeds: [{ "title": `${member instanceof GuildMember ? member.displayName : '<DATA ERROR>'}'s turn (${game.round + 1})`, "description": `15 Seconds until turn forfeited`, "color": 0xed0606, "thumbnail": { "url": `attachment://board.png`, "height": 700, "width": 450 } }], components: [createButtons([{string:"Begin Turn", id:"turn", style:ButtonStyle.Primary}])],
    files: [attachment]
  })
  let collector = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.Button, filter: i => i.user.id == player.id, time: 20000, max: 1 })
  collector?.on('collect', async i => {
    await i.deferReply({ ephemeral: true })
    const attachment = new AttachmentBuilder(await dispBoard(hands, game, false));
    await game.msg.edit({ content: '<a:loading:1011794755203645460>', embeds: [], components: [] })
    await game.msg.edit({
      content: null,
      embeds: [{ "title": `${i.member instanceof GuildMember ? i.member.displayName : i.user.id} has begun round ${game.round + 1}`, "description": `They have 30 seconds to play or draw a card.`, "color": 0xed0606, "thumbnail": { "url": `attachment://board.png`, "height": 700, "width": 450 } }], components: undefined,
      files: Array.from(game.msg.attachments.values())
    })
    let playableCards = [{ label: 'Draw', value: 'draw' }]
    player.hand.forEach(card => {
      if (playableCards.find(card1 => card1.value == card) == undefined && (card?.startsWith(game.deck[0].charAt(0)) || card?.charAt(1) == game.deck[0].charAt(1))) {
        playableCards.push({ label: getLabel(card), value: card })
      }
    })
    let SelectMenu = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
        new SelectMenuBuilder()
        .setCustomId('playcard')
        .addOptions(playableCards)
    )
    await i.editReply({
      components: [SelectMenu],
      files: [attachment],
      embeds: [
        new EmbedBuilder()
          .setTitle('Time to make your move')
          .setDescription(`It is now your turn, you have 30 seconds to play or draw a card.`)
          .setColor(0xed0606)
          .setThumbnail(`attachment://board.png`)
      ]
    })
    let collector = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 35000, max: 1 })
    collector?.on('collect', async interaction => {
      player.hand.splice(player.hand.findIndex(card => card == interaction.values[0]), 1)
      if (player.hand.length == 0) {
        let embed = new EmbedBuilder()
          .setTitle(`Game Over`)
          .setDescription(`${interaction.user.username} has won the game.`)
        await game.msg.channel.send({ embeds: [embed] })
      } else {
        game.deck.splice(0, 0, interaction.values[0])
        let embed = new EmbedBuilder()
          .setTitle(`Round ${game.round + 1}`)
          .setDescription(`${interaction.user.username} Played a ${getLabel(interaction.values[0])}`)
          .setThumbnail(`attachment://board.png`)
        if (interaction.values[0].startsWith('w'))
        await game.msg.edit({ embeds: [embed], components: [] })
        let msg = await interaction.channel?.send('<a:loading:1011794755203645460>')
        if (msg instanceof Message) {
          game.msg = msg
        }
        game.round++
        startTurn(interaction, game)
      }
    })
  })
}


exports.startNewGame = async function startNewGame(interaction: CommandInteraction) {
  let unochan = interaction.guild?.channels.cache.find(chan => chan.id == '1031792184539742229')
  if (unochan&&unochan.type==ChannelType.GuildForum) {
  let gameChan = await interaction.guild?.channels.create({name:`${interaction.user.username}s-uno-match`})
  let member = interaction.member
  if (gameChan && member instanceof GuildMember) {
    let msg = await gameChan.send({
      embeds: [{
        "title": `${member.displayName}'s Uno Match`,
        "description": `Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n1/4 players have joined`,
        "color": 0xed0606,
        "thumbnail": {
          "url": `https://cdn.discordapp.com/attachments/758884272572071944/971648962505351198/logo.png`,
          "height": 700,
          "width": 450
        },
        "fields": [{ name: member.displayName, value: `Level ${require('./userdata.json').users.find((user: UserProfile) => user.id = interaction.user.id).level}` }]
      }], components: [createButtons([{string:"🎮 Join Match", id:"join", style:ButtonStyle.Success},{string:"Start Match", id:"start", style: ButtonStyle.Success,emoji:"814199679704891423"},{string:"Cancel Match", id:"cancel", style:ButtonStyle.Danger, emoji:"814199666778308638"}])]
    })
    if (msg) {
      let game: Game = newGame(msg, interaction.user.id)
      games.push(game)
      interaction.reply(`[InDev] Game starting in <#${gameChan.id}>`)
      const collector = gameChan?.createMessageComponentCollector({ componentType: ComponentType.Button })
      collector?.on('collect', async i => {
        if (i.customId == 'join') {
          if (game.players.find(plr => plr.id == i.user.id)) {
            await i.reply({ content: 'You are already in this match.', ephemeral: true })
          } else if (i.member instanceof GuildMember) {
            game.players.push(newPlayer(i.user.id))
            let embed = game.msg.embeds[0]
            let user = require('./userdata.json').users.find((user: UserProfile) => user.id == i.user?.id)
            embed.fields.push({ name: i.member?.displayName, value: `Level ${user.level}`, inline: false })
            let newEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setDescription(`Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n${game.players.length}/4 players have joined`)
            .addFields(embed.fields)
            .setColor('Gold')
            .setThumbnail('https://cdn.discordapp.com/attachments/758884272572071944/971648962505351198/logo.png')
            await i.update({ embeds: [newEmbed] })
          }
        } else if (i.user?.id == game.host) {
          if (i.customId == 'cancel') {
            if (i.user.id == game.host) {
              i.channel?.delete()
              games.splice(games.indexOf(game), 1)
            } else {
              await i.reply({ content: "Only the host can perform this action", ephemeral: true })
            }
          } else if (i.customId == 'start') {
            if (game.players.length > 1) {
              collector.stop()
              game.deck = randomizeArray(game.deck)
              for (let i = 0; i < game.players.length; i++) {
                const element = game.players[i];
                element.hand = [game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop()]
              }
              startTurn(i, game)
            } else {
              await i.reply({ content: "There must be more than 1 player for the game to start", ephemeral: true })
            }
          }
        } else {
          await i.reply({ content: 'Command is only available to host', ephemeral: true })
        }
      })
    } else {
      await gameChan.delete()
      await interaction.reply('Failed to create game')
    }
  }
} else {
  interaction.reply('Could not find uno forum.')
}
}