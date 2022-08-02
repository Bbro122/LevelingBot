//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
//______________________________/
import { strCheck , numCheck , boolCheck } from "./typecheck"
import { APIEmbed, APIEmbedField, APIInteractionDataResolvedGuildMember, APIInteractionGuildMember } from "discord-api-types";
import { CommandInteraction, Guild, GuildMember, Interaction, Message, MessageEmbed, Permissions } from "discord.js";
const can = require('canvas')
const { Client, Intents } = require('discord.js');
const { MessageAttachment } = require('discord.js');
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'], intents: [new Intents(32767)], fetchAllMembers: true });
let xp = require('./xpmanager.js')
let game = require('./gamemanager.js');
let config = require("./config.json")
type UserProfile = { "id": string, "xp": number, "level": number }
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
function checkOwner(interaction: CommandInteraction) {
    //if (interaction.user.id == '316243027423395841') {
    let permissions = interaction.member?.permissions
    if (permissions instanceof Permissions) {
    if (permissions.has('ADMINISTRATOR')) {
        return true
    } else {
        interaction.reply("This command is reserved for Ministry usage only.")
        return false
    }
    }
}
async function getImage(exp: number, requirement: number, username: any, number: any, level: any, imagelink: any, rank: any) {
    let canvas = can.createCanvas(1200, 300)
    let context = canvas.getContext('2d')
    context.fillStyle = '#171717'
    context.fillRect(0, 0, 1200, 300)
    context.fillStyle = '#171717'
    context.fillRect(325, 200, 800, 50)
    context.fillStyle = '#00EDFF'
    context.fillRect(325, 200, Math.round((exp - xp.level(level - 1)) / (requirement - xp.level(level - 1)) * 800), 50)
    context.drawImage(await can.loadImage(imagelink), 50, 50, 200, 200)
    context.drawImage(await can.loadImage('./Overlay.png'), 0, 0, 1200, 300)
    context.fillStyle = '#ffffff'
    context.font = '40px Arial'
    context.fillText(`Rank #${rank}`, 325, 100)
    context.fillText(username, 325, 190)
    let wid = context.measureText(username).width
    context.font = '30px Arial'
    context.fillText(number, 335 + wid, 192)
    context.fillText(`${exp - xp.level(level - 1)} / ${requirement - xp.level(level - 1)} XP`, 1125 - context.measureText(`${exp - xp.level(level - 1)} / ${requirement - xp.level(level - 1)} XP`).width, 192)
    context.fillStyle = '#00EDFF'
    context.fillText("Level", 960, 75)
    context.font = '60px Arial'
    context.fillText(level, 1043, 75)
    return canvas.toBuffer('image/png')
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('ready', async () => {
    try { client.guilds.cache.get(config.mainserver).commands.set(require('./commands.json')) } catch (err) { console.log(err) }
    game.setup(client, client.channels.cache.get(config.gamechannel))
    if (config.game) {
        game.selGame()
    }
})
client.on('messageCreate', async (msg: Message) => {
    if (msg.guild?.id == config.mainserver) {
        if (msg.author.bot == false) {
            if (msg.content.length > 5) {
                xp.give(msg, 15 + Math.floor(Math.random() * 10), true, client)
            }
            if (msg.channel.id == config.gamechannel&&msg.content.length>=1) {
                game.checkWord(msg)
            } else if (msg.channel.id == config.countchannel) {
                require('./counting.js')(client, msg)
            }
        } else if (msg.author.id == client.user.id && msg.channel.id == '1001697908636270602' && msg.content.startsWith('givexp')) {
            let args = msg.content.split(' ').splice(0, 1)
            let id = args[0]
            if (id !== 'null') {
                if (args[1] == 'chat') {
                    xp.give(msg, 0.5, false, client)
                    msg.channel.send('giving 0.5 xp')
                } else if (args[1] == 'login') {
                    xp.give(msg, 15 + Math.floor(Math.random() * 10), true, client)
                    msg.channel.send('giving 15-25 xp')
                }
            } else {
                msg.channel.send('id is null')
            }
        }
    }
})
client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName == 'level') {
            await interaction.deferReply()
            let data = xp.get()
            let user: UserProfile | undefined
            let member: GuildMember | APIInteractionDataResolvedGuildMember | undefined | null = interaction.options.get('user')?.member
            if (member instanceof GuildMember) {
                user = data.users.find((user: UserProfile) => user.id == interaction.options.get('user')?.value)
            } else {
                member = interaction.member!
                user = data.users.find((user: UserProfile) => user.id == interaction.user.id)
            }
            if (member instanceof GuildMember) {
                let data2 = xp.get().users.sort((a: UserProfile, b: UserProfile) => { return b.xp - a.xp })
                data2.findIndex((user2: UserProfile) => user2 == user)
                if (user) {
                    getImage(user.xp, xp.level(user.level), member.user.username, member.user.discriminator, user.level, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex((user2: UserProfile) => user2 == user) + 1).then(buffer => {
                        const attachment = new MessageAttachment(buffer, "LevelCard.png")
                        interaction.editReply({ files: [attachment] })
                    })
                } else {
                    getImage(55, xp.level(0), member.user.username, member.user.discriminator, 0, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex((user2: UserProfile) => user2 == user) + 1).then(buffer => {
                        const attachment = new MessageAttachment(buffer, "LevelCard.png")
                        interaction.editReply({ files: [attachment] })
                    })
                }
            }
        } else if (interaction.commandName == 'leaderboard') {
            await interaction.guild?.members.fetch()
            let data = xp.get().users.sort((a, b) => { return b.xp - a.xp })
            let fields: APIEmbedField[] = []
            function get(user:any) {
                if (interaction.guild?.members.cache.get(user)) {
                    fields.push({ "name": `🥇 ${interaction.guild.members.cache.get(user)?.displayName} (${user.level})`, "value": `Xp: ${data[0].xp}`, "inline": false })
                } else {
                    fields.push({ "name": `🥇 [Unknown Error- ${user.id}]`, "value": `Xp: ${user.xp}`, "inline": false })
                }
            }
            if (interaction.guild?.members.cache.get(data[0].id)) {
                fields.push({ "name": `🥇 ${interaction.guild.members.cache.get(data[0].id)?.displayName} (${data[0].level})`, "value": `Xp: ${data[0].xp}`, "inline": false })
            } else {
                fields.push({ "name": `🥇 [Unknown Error- ${data[0].id}]`, "value": `Xp: ${data[0].xp}`, "inline": false })
            }
            if (interaction.guild?.members.cache.get(data[1].id)) {
                fields.push({ "name": `🥈 ${interaction.guild.members.cache.get(data[1].id)?.displayName} (${data[1].level})`, "value": `Xp: ${data[1].xp}`, "inline": false })
            } else {
                fields.push({ "name": `🥈 [Unknown Error- ${data[1].id}]`, "value": `Xp: ${data[1].xp}`, "inline": false })
            }
            if (interaction.guild?.members.cache.get(data[1].id)) {
                fields.push({ "name": `🥉 ${interaction.guild.members.cache.get(data[2].id)?.displayName} (${data[2].level})`, "value": `Xp: ${data[2].xp}`, "inline": false })
            } else {
                fields.push({ "name": `🥉 [Unknown Error- ${data[2].id}]`, "value": `Xp: ${data[2].xp}`, "inline": false })
            }
            for (let i = 3; i <= 9; i++) {
                if (interaction.guild?.members.cache.get(data[i].id)) {
                    fields.push({ "name": `${i + 1}. ${interaction.guild.members.cache.get(data[i].id)?.displayName} (${data[i].level})`, "value": `Xp: ${data[i].xp}`, "inline": false })
                } else {
                    fields.push({ "name": `${i + 1}. [Unknown Error- ${data[i].id}]`, "value": `Xp: ${data[i].xp}`, "inline": false })
                }
            }
            let embed = { title: "Leaderboard", description: "", fields: fields }
            interaction.reply({ embeds: [embed] })
        } else if (interaction.commandName == 'scramble' && checkOwner(interaction)) {
            game.scramble()
        } else if (interaction.commandName == 'math' && checkOwner(interaction)) {
            game.math()
        } else if (interaction.commandName == 'crash' && checkOwner(interaction)) {
            require('./crash.js')()
        } else if (interaction.commandName == 'punish' && checkOwner(interaction)) {
            require('./punisher.js').punish(interaction)
        } else if (interaction.commandName == 'punishments' && checkOwner(interaction)) {
            require('./punisher.js').punishments(interaction.options.get('user')?.value,interaction)
        } else if (interaction.commandName == 'rule') {
            let rule: string = strCheck(interaction.options.get('rule')?.value)
                let embed = new MessageEmbed()
                    .setTitle(interaction.options.getSubcommand())
                    .setDescription(rule)
                await interaction.reply({ embeds: [embed] })
        } else if (interaction.commandName == 'givexp' && checkOwner(interaction)) {
            await interaction.deferReply()
            if (interaction.options.get('user')) {
                xp.give({author:interaction.user,channel:interaction.channel},interaction.options.get('amount')?.value,false,client)
                await interaction.editReply(`<@${interaction.options.get('user')?.value}> has received ${interaction.options.get('amount')?.value} xp.`)
            } else {
                xp.giveall(interaction)
                await interaction.editReply(`All users have received ${interaction.options.get('amount')?.value} xp.`)
            }
        } else if (interaction.commandName == 'test' && checkOwner(interaction)) {
            require('./UnoMaster.js').startNewGame(interaction)
        }// else if (unoids.includes(interaction.customId)) {require('./UnoMaster.js').command(interaction)}
    } else if (interaction.isButton()) {
        require('./punisher').punishConfirm(interaction)
    }
})
client.login(config.token);
