import { EmbedBuilder, ButtonInteraction, CommandInteraction, Emoji, EmojiIdentifierResolvable, Guild, GuildMember, Message, ActionRowBuilder, MessageActionRowComponent, ButtonBuilder, ButtonStyle, MessageComponent, MessageComponentInteraction, SelectMenuBuilder, SelectMenuComponentOptionData, MessageSelectOption, ComponentEmojiResolvable, ComponentType, ChannelType, RestOrArray, AnyComponentBuilder, embedLength, ThreadChannel, italic, APIEmbedField } from "discord.js";
import { isThisTypeNode } from "typescript";
import { UserProfile } from "../xpmanager";
const cards = require('./cards.json')
let games: Game[] = []
function createButtons(rawButtons: { string: string, id: string, style: ButtonStyle, emoji?: ComponentEmojiResolvable | null, disabled?: boolean }[]) { // PRIMARY:Blue DANGER:Red SUCCESS:GREEN
  let buttons: ButtonBuilder[] = []
  rawButtons.forEach(buttonData => {
    let button = new ButtonBuilder()
      .setCustomId(buttonData.id)
      .setLabel(buttonData.string)
      .setStyle(buttonData.style)
      .setDisabled(false)
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
class Game {
  players: Player[];
  round: number;
  id: string;
  promptDeck: string[];
  responseDeck: string[];
  host: string;
  constructor(public interaction: CommandInteraction, public msg: Message) {
    this.players = []
    this.round = 0
    this.id = msg.channel.id
    this.promptDeck = cards.prompt
    this.responseDeck = cards.response
    this.host = interaction.user.id
  }
}
class Player {
  id: string;
  prompt: string[];
  response: string[];
  constructor(public identifier: string, public game: Game) {
    let response = []
    for (let i = 0; i < 7; i++) {
      const element = game.responseDeck.pop()
      response.push(element ? element : '')
    }
    this.id = identifier
    this.prompt = []
    this.response = response
  }
}
exports.createGame = async function (interaction: CommandInteraction) {
  let cahthread = interaction.guild?.channels.cache.find(chan => chan.name == 'cah-matches')
  let member = interaction.member
  if (cahthread && cahthread.type == ChannelType.GuildForum && member instanceof GuildMember) {
    let message = undefined
    let game: Game
    let embed = new EmbedBuilder()
      .setTitle(`${member.displayName}'s Cards Against Humanity Match`)
      .setDescription(`Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n1/10 players have joined`)
      .setColor('Gold')
      .addFields([{ name: member.displayName, value: `Level ${require('../userdata.json').users.find((user: UserProfile) => user.id = interaction.user.id).level}` }])
    let cahChan = await cahthread.threads.create({ name: `${interaction.user.username}s-uno-match`, message: { embeds: [embed], components: [createButtons([{ string: "🎮 Join Match", id: "join", style: ButtonStyle.Success }, { string: "Start Match", id: "start", style: ButtonStyle.Success, emoji: "814199679704891423" }, { string: "Cancel Match", id: "cancel", style: ButtonStyle.Danger, emoji: "814199666778308638" }])] } })
    interaction.reply(`[InDev] Cards Against Humanity starting in <#${cahChan.id}>`)
    const collector = cahChan?.createMessageComponentCollector({ componentType: ComponentType.Button })
    collector?.on('collect', async i => {
      console.log('received')
      if (!game) {
        game = new Game(interaction, i.message)
        game.players.push(new Player(game.host, game))
        games.push(game)
      }
      switch (i.customId) {
        case 'join': {
          if (game.players.find(plr => plr.id === i.user.id)) {
            await i.reply({ content: 'You are already in this match.', ephemeral: true })
          } else if (i.member instanceof GuildMember) {
            game.players.push(new Player(i.user.id, game))
            let user = require('../userdata.json').users.find((user: UserProfile) => user.id == i.user?.id)
            embed?.addFields({ name: i.member?.displayName, value: `Level ${user ? user.level : '<Unknown>'}`, inline: false })
            embed.setDescription(`Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n${game.players.length}/4 players have joined`)
            await i.update({ embeds: [embed] })
          }
        }
        case 'start':
        case 'cancel': {
          if (i.user.id == interaction.user.id) {
            switch (i.customId) {
              case 'start':
                if (game.players.length > 1) {
                  collector.stop()
                  for (let i = 0; i < game.players.length; i++) {
                    const element = game.players[i];
                    let array = [game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop()]
                    array.forEach(card => {
                      if (typeof card == 'undefined') {
                        array.splice(array.indexOf(card), 1)
                      }
                    })
                    element.response = array
                  }
                  startTurn(i, game)
                } else {
                  await i.reply({ content: "There must be more than 1 player for the game to start", ephemeral: true })
                }
                break;
            
              case 'cancel':
                cahChan.delete('Game cancelled')
                games.splice(games.indexOf(game), 1)
                break;
            }
          } else {
            i.reply({ ephemeral: true, content: 'You dont control this game.' })
          }
        }
        default: {
          i.reply({ ephemeral: true, content: 'Invalid Command' })
        }
      }
    })
  } else {
    interaction.reply('Could not find cah forum.')
  }
}
async function startTurn(interaction: MessageComponentInteraction, game: Game) {
  if (game.msg instanceof Message) {
    let cardMaster = game.players[game.round % game.players.length]
    let member = interaction.guild?.members.cache.get(cardMaster.id) ? interaction.guild?.members.cache.get(cardMaster.id) : interaction.member
    let prompt = game.promptDeck[Math.floor(Math.random() * game.promptDeck.length)]
    await game.msg.edit({
      content: null,
      embeds: [{ "title": `${member instanceof GuildMember ? member.displayName : '<DATA ERROR>'} is the Card Master (${game.round + 1})`, "description": `Everyone must play a card\nClick the button below to play a card.\n${prompt}`, "color": 0xed0606 }], components: [createButtons([{ string: "Play Card", id: "card", style: ButtonStyle.Primary }])],
    })
    let collector = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.Button, filter: i => i.user.id != cardMaster.id, maxUsers: game.players.length - 1 })
    let plays: { id: string, response: string }[] = []
    collector?.on('collect', async i => {
      let player = game.players.find(plr => plr.id == i.user.id)
      if (i.customId == 'card' && player) {
        let cards: { name: string; value: string; }[] = []
        let menuCards = []
        for (let i = 0; i < player?.response.length; i++) {
          const card = player?.response[i];
          cards.push({ name: i.toString(), value: card })
          menuCards.push({ label: card.slice(0, 100), value: i.toString() })
        }
        let embed = new EmbedBuilder()
          .setTitle(`Time to choose`)
          .setDescription(`The following numbers correspond to the card your gonna play. Choose wisely.`)
          .setColor('Gold')
          .addFields(cards)
        let row = new ActionRowBuilder<SelectMenuBuilder>()
          .addComponents(new SelectMenuBuilder()
            .setCustomId('playcard')
            .addOptions(menuCards)
          )
        i.reply({ ephemeral: true, embeds: [embed], components: [row] })
        let collector = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, filter: interaction => interaction.user.id == i.user.id, max: 1 })
        collector?.on('collect', async interaction => {
          let card = cards.find(card => card.name == interaction.values[0])
          if (card?.value && interaction.customId == 'playcard') {
            plays.push({ id: interaction.user.id, response: card.value })
            interaction.message.edit({ components: undefined, embeds: [], content: 'Successfully played card.' })
          }
        })
      }
    })
    collector?.on('end', reason => {
      //while (plays.length<game.players.length-1) {}
      //interaction.message.edit({content:"all replies received"})
    })
  }
}