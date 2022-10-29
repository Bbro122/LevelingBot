import {EmbedBuilder, ButtonInteraction, CommandInteraction, Emoji, EmojiIdentifierResolvable, Guild, GuildMember, Message, ActionRowBuilder, MessageActionRowComponent, ButtonBuilder, ButtonStyle, MessageComponent, MessageComponentInteraction, SelectMenuBuilder, SelectMenuComponentOptionData, MessageSelectOption, ComponentEmojiResolvable, ComponentType, ChannelType, RestOrArray, AnyComponentBuilder, embedLength, ThreadChannel, italic } from "discord.js";
type Game = { id: string, msg: Message | null, promptDeck: string[], responseDeck: string[], players: Player[], round: number, timeouts: any[], host: string}
type Player = {id:string,prompts:string[],responses:string[]}
const cards = require('./cards.json')
let games:Game[] = []
class gameBuilder {
  players: Player[]
  round: number
  id: string
  promptDeck: string[]
  responseDeck: string[]
  host: string
  constructor(public interaction:CommandInteraction,public msg:Message) {
    this.players = []
    this.round = 0
    this.id = msg.channel.id
    this.promptDeck = cards.prompt
    this.responseDeck = cards.response
    this.host = interaction.user.id
  }
}
exports.createGame = async function(interaction:CommandInteraction) {
    let cahthread = interaction.guild?.channels.cache.find(chan => chan.name == 'cah-matches')
    let member = interaction.member
    if (cahthread && cahthread.type == ChannelType.GuildForum && member instanceof GuildMember) {
      let message = undefined
      let game: Game
      let embed = new EmbedBuilder()
        .setTitle(`${member.displayName}'s Cards Against Humanity Match`)
        .setDescription(`Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n1/10 players have joined`)
        .setColor('Gold')
        .setThumbnail(`https://cdn.discordapp.com/attachments/758884272572071944/971648962505351198/logo.png`)
        .addFields([{ name: member.displayName, value: `Level ${require('./userdata.json').users.find((user: UserProfile) => user.id = interaction.user.id).level}` }])
      let cahChan = await cahthread.threads.create({ name: `${interaction.user.username}s-uno-match`, message: { embeds: [embed], components: [createButtons([{ string: "🎮 Join Match", id: "join", style: ButtonStyle.Success }, { string: "Start Match", id: "start", style: ButtonStyle.Success, emoji: "814199679704891423" }, { string: "Cancel Match", id: "cancel", style: ButtonStyle.Danger, emoji: "814199666778308638" }])] } })
      interaction.reply(`[InDev] Cards Against Humanity starting in <#${cahChan.id}>`)
      const collector = cahChan?.createMessageComponentCollector({ componentType: ComponentType.Button })
      collector?.on('collect', async i => {
        console.log('received')
        if (!game) {
          game = new gameBuilder(interaction, i.message)
          games.push(game)
        }
        if (i.customId == 'join') {
          if (game.players.find(plr => plr.id == i.user.id)) {
            await i.reply({ content: 'You are already in this match.', ephemeral: true })
          } else if (i.member instanceof GuildMember) {
            game.players.push(newPlayer(i.user.id))
            let user = require('./userdata.json').users.find((user: UserProfile) => user.id == i.user?.id)
            embed?.addFields({ name: i.member?.displayName, value: `Level ${user ? user.level : '<Unknown>'}`, inline: false })
            embed.setDescription(`Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n${game.players.length}/4 players have joined`)
            await i.update({ embeds: [embed] })
          }
        } else if (i.user?.id == game.host) {
          if (i.customId == 'cancel') {
            if (i.user.id == interaction.user.id) {
              if (game) {
                games.splice(games.indexOf(game), 1)
              }
              cahChan.delete('Game cancelled')
              games.splice(games.indexOf(game), 1)
            } else {
              await i.reply({ content: "Only the host can perform this action", ephemeral: true })
            }
          } else if (i.customId == 'start') {
            if (game.players.length > 1) {
              collector.stop()
              for (let i = 0; i < game.players.length; i++) {
                const element = game.players[i];
                element.responses = [game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop()]
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
      interaction.reply('Could not find cah forum.')
    } 
}
async function startTurn(interaction: MessageComponentInteraction, game: Game) {
    if (game.msg instanceof Message) {
      let cardMaster = game.players[game.round % game.players.length]
      let member = interaction.guild?.members.cache.get(player.id) ? interaction.guild?.members.cache.get(player.id) : interaction.member
      let prompt = game.promptDeck[Math.floor(Math.random()*game.promptDeck.length)]
      await game.msg.edit({
        content: null,
        embeds: [{ "title": `${member instanceof GuildMember ? member.displayName : '<DATA ERROR>'} is the Card Master (${game.round + 1})`, "description": `Everyone must play a card\nClick the button below to play a card.\n${prompt}`, "color": 0xed0606}], components: [createButtons([{ string: "Play Card", id: "card", style: ButtonStyle.Primary }])],
      })
      let collector = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.Button, filter: i => i.user.id != player.id, maxUsers: game.players.length-1 })
      let plays:{id:string,response:string} = []
      collector?.on('collect', async i => {
      })
    }
}