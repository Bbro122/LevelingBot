import { AttachmentBuilder, Client, ActionRowBuilder, CommandInteraction, GuildMember, Interaction, Message, Embed, TextChannel, SelectMenuInteraction, SelectMenuBuilder, EmbedField, SelectMenuOptionBuilder, User, GuildMemberRoleManager, ButtonBuilder, ButtonInteraction, Partials, GatewayIntentBits, AnyAPIActionRowComponent, AnyComponentBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonStyle, ComponentType, channelLink } from "discord.js";
const fs = require('fs')
let timeouts: any[] = []
let client: Client | undefined
exports.setup = function setup(client1: Client) {
  client = client1
  StartTimers()
}
function write(polls: any) {
  fs.writeFileSync("./polls.json", JSON.stringify(polls))
}
function read() {
  return require("./polls.json")
}
async function endPoll(poll: { u?: any; d?: any; id?: string; voters?: any; chan?: any, end: number }) {
  if (client instanceof Client) {
    let channel = client.channels.cache.get(poll.chan)
    if (channel instanceof TextChannel&&client.user) {
      let msg = await channel.messages.fetch(poll.id?poll.id:'1067633299197001768')
      let string
      if (poll.u > poll.d) {
        string = 'Community Approval'
      } else if (poll.u < poll.d) {
        string = 'Community Disapproval'
      } else {
        string = 'Community Mixed Approval'
      }
      if (msg && msg.embeds) {
        const embed = new EmbedBuilder()
          .setAuthor({ name: "Total Votes- " + poll.voters.length })
          .setTitle(msg.embeds[0].title)
          .setDescription(msg.embeds[0].description)
          .addFields([{ name: "Poll Closed", value: string }])
          .setFooter({ text: "Bot managed by the ministry." })
        const row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('y')
              .setLabel(Math.round(poll.u / poll.voters.length) * 100 + '%')
              .setStyle(ButtonStyle.Success)
              .setEmoji('814199679704891423')
              .setDisabled(true)

          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId('n')
              .setLabel(Math.round(poll.d / poll.voters.length) * 100 + '%')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('814199666778308638')
              .setDisabled(true)
          )
        await msg.edit({ embeds: [embed], components: [row] })
        let polls = read()
        polls.polls.splice(polls.polls.indexOf(poll), 1)
        write(polls)
      }
    }
  }
}
function StartTimers() {
  let polls = require("./polls.json")
  polls.polls.forEach((poll: { end: number }) => {
    let timeout = {
      "timeout": setTimeout(() => { endPoll(poll) }, poll.end * 1000 - Date.now()),
      "poll": poll
    }
    timeouts.push(timeout)
  })
}
function toSeconds(string: string) {
  const lastChar = string.length - 1
  if (string.charAt(lastChar) == "h") {
    return parseFloat(string) * 3600
  } else if (string.charAt(lastChar) == "m") {
    return parseFloat(string) * 60
  } else if (string.charAt(lastChar) == "s") {
    return parseFloat(string)
  } else if (string.charAt(lastChar) == "d") {
    return parseFloat(string) * 86400
  } else { return parseFloat(string) }
}

exports.createPoll = async function createPoll(interaction: CommandInteraction) {
  await interaction.deferReply()
  let channel = interaction.guild?.channels.cache.get(interaction.options.get('channel')?.value as string)
  if (channel instanceof TextChannel && client && client.user?.id) {
    if (channel.guild.members.cache.get(client.user?.id)?.permissions.has(['ViewChannel', 'ReadMessageHistory', 'SendMessages', 'EmbedLinks'])) {
      let time = toSeconds(interaction.options.get('time')?.value as string)
      if (30 < time) {
        let polls = read()
        let pollobj = { u: 0, d: 0, id: '', voters: [], chan: channel.id, end: time + Math.floor(Date.now() / 1000) }
        interaction.editReply(`Starting a poll in ${channel.id} until ${new Date(pollobj.end * 1000).toLocaleString('en-us', { timeZoneName: 'short' }).replace(/:\d{2}\s/, ' ')}.`)
        const embed = new EmbedBuilder()
          .setAuthor({ name: "Total Votes- 0" })
          .setTitle(interaction.options.get('title')?.value as string)
          .setDescription(interaction.options.get('description')?.value as string)
          .setFooter({ text: "Bot managed by the ministry." })
        const row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('y')
              .setLabel('0%')
              .setStyle(ButtonStyle.Success)
              .setEmoji('814199679704891423'),

          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId('n')
              .setLabel('0%')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('814199666778308638'),
          );
        let msg = await channel.send({ embeds: [embed], components: [row] })
        pollobj.id = msg.id
        polls.polls.push(pollobj)
        write(polls)
        let timeout = {
          "timeout": setTimeout(() => { endPoll(pollobj) }, pollobj.end * 1000 - Date.now()),
          "poll": pollobj
        }
        timeouts.push(timeout)
      }
    } else {
      await interaction.editReply("**Channel Error-** Insufficient Permission \n Required: ['VIEW_CHANNEL','READ_MESSAGE_HISTORY','SEND_MESSAGES','EMBED_LINKS']")
    }
  } else {
    await interaction.editReply("**Channel Error-** The channel requested is not text based")
  }
}
exports.vote = function vote(interaction: ButtonInteraction) {
  let polls = read()
  let poll = polls.polls.find((poll: { id: any; }) => poll.id == interaction.message.id)
  if (poll.voters.includes(interaction.user.id)) {
    interaction.reply({ ephemeral: true, content: "You cannot vote twice on the same poll" })
  } else {
    poll.voters.push(interaction.user.id)
    if (interaction.customId.startsWith("y")) { poll.u = poll.u + 1 }
    else if (interaction.customId.startsWith("n")) { poll.d = poll.d + 1 }
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Total Votes- " + poll.voters.length })
      .setTitle(interaction.message.embeds[0].title)
      .setDescription(interaction.message.embeds[0].description)
      .setFooter({ text: "Bot managed by the ministry." })
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('y')
          .setLabel(Math.round((poll.u / poll.voters.length) * 100) + '%')
          .setStyle(ButtonStyle.Success)
          .setEmoji('814199679704891423'),

      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('n')
          .setLabel(Math.round((poll.d / poll.voters.length) * 100) + '%')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('814199666778308638')
      )
    interaction.reply({ ephemeral: true, content: "Succesfully Voted" })
    interaction.message.edit({ embeds: [embed], components: [row] })
    write(polls)
  }
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
// client.on('ready', async () => {
//   client.guilds.cache.forEach((guild: { commands: { set: (arg0: any) => void; }; }) => {
//     try { guild.commands.set(command) } catch (err) { console.log(err) }
//   })
//   StartTimers()
// })
// client.on("interactionCreate", async (interaction: { isCommand: () => any; commandName: string; deferReply: () => any; reply: (arg0: { components: any[]; content: string; }) => any; isButton: () => any; customId: string; message: { id: any; }; }) => {
//   if (interaction.isCommand()) {
//     if (interaction.commandName === "createpoll") {
//       await interaction.deferReply()
//       createPoll(interaction)
//     } else if (r) {
//       let row = new MessageActionRow()
//         .addComponents(
//           new MessageButton()
//             .setLabel("Invite")
//             .setStyle('LINK')
//             .setURL("https://discord.com/api/oauth2/authorize?client_id=585248628281573397&permissions=8&scope=applications.commands%20bot")
//         )
//       await interaction.reply({ components: [row], content: "Click button to invite the bot." })
//     }
//   } else if (interaction.isButton()) {
//     if (interaction.customId.startsWith("y") || interaction.customId.startsWith("n")) {
//       console.log(interaction.message.id)
//       vote(interaction)
//     }
//   }
// })

// client.login(require("./config.json").token2);
