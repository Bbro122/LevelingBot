
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
//______________________________/-
import { APIEmbed, APIEmbedField, APIInteractionDataResolvedGuildMember, APIInteractionGuildMember } from "discord-api-types";
import { MessageAttachment, Client, Intents, MessageActionRow, Channel, CommandInteraction, Guild, GuildMember, Interaction, Message, MessageEmbed, Permissions, TextChannel, SelectMenuInteraction, MessageSelectMenu, EmbedField, MessageSelectMenuOptions, User, GuildMemberRoleManager, MessageButton } from "discord.js";
import { UserProfile, XpManager } from "./xpmanager";
import can from 'canvas';
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'], intents: [new Intents(32767)] });
let xp: XpManager = require('./xpmanager.js')
let game = require('./gamemanager.js');
let axios = require('axios')
let config = require("./config.json")
let medals = ['🥇', '🥈', '🥉']
let charMap = "`~1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]};:'.>,<qwertyuiopasdfghjklzxcvbnm /?|" + '"'
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
let reply = {
    silent: function (interaction: CommandInteraction | SelectMenuInteraction, reply: string) {
        interaction.reply({ content: reply, ephemeral: true })
    },
    error: function (interaction: CommandInteraction | SelectMenuInteraction, error: string) {
        interaction.reply({ content: `**Error |** ${error}`, ephemeral: true })
    },
    embed: function (interaction: CommandInteraction | SelectMenuInteraction, embed: MessageEmbed, row?: MessageActionRow) {
        interaction.reply({ embeds: [embed], components: row ? [row] : undefined })
    }
}
function remainingTime(milliseconds: number): string {
    let string = ''
    if (milliseconds > 3600000) {
        string = `${Math.floor(milliseconds / 3600000)} hour(s)`
        if (Math.floor((milliseconds - (Math.floor(milliseconds / 3600000) * 3600000)) / 60000) > 0) {
            string = string + ` ${Math.floor((milliseconds - (Math.floor(milliseconds / 3600000) * 3600000)) / 60000)} minute(s)`
        }
    } else if (milliseconds > 60000) {
        string = `${Math.floor(milliseconds / 60000)} minute(s)`
        if (Math.floor((milliseconds - (Math.floor(milliseconds / 60000) * 60000)) / 1000) > 0) {
            string = string + ` ${Math.floor((milliseconds - (Math.floor(milliseconds / 60000) * 60000)) / 1000)} seconds`
        }
    } else if (milliseconds > 1000) {
        string = `${Math.floor(milliseconds / 1000)} seconds`
    } else {
        return `${milliseconds} milliseconds`
    }
    return string
}
function strCheck(str: any) {
    if (typeof str == 'string') {
        return str;
    }
    else {
        return '';
    }
}
function checkOwner(interaction: CommandInteraction) {
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
async function getWelcomeBanner(imagelink: string) {
    let canvas = can.createCanvas(1200, 300)
    let context = canvas.getContext('2d')
    context.drawImage(await can.loadImage(imagelink), 478, 51, 203, 203)
    context.drawImage(await can.loadImage('./welcome.png'), 0, 0, 1200, 300)
    return canvas.toBuffer('image/png')
}
async function getImage(exp: number, requirement: number, username: any, number: any, level: any, imagelink: any, rank: any, ministry?: boolean, namecard?: boolean) {
    let canvas = can.createCanvas(1200, 300)
    let context = canvas.getContext('2d')
    context.fillStyle = '#171717'
    context.fillRect(0, 0, 1200, 300)
    context.fillStyle = '#171717'
    context.fillRect(325, 200, 800, 50)
    context.fillStyle = '#00EDFF'
    context.fillRect(325, 200, Math.round((exp - xp.level(level - 1)) / (requirement - xp.level(level - 1)) * 800), 50)
    context.drawImage(await can.loadImage(imagelink), 50, 50, 200, 200)
    //if (ministry) { context.drawImage(await can.loadImage('./MinistrySymbol.png'), 500, 71, 26, 30); context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300) }
    //else if (overwatch) { context.drawImage(await can.loadImage('./namecards/overwatch.png'), 0, 0, 1200, 300) }
    //else { context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300) }
    if (namecard) {
        context.drawImage(await can.loadImage(namecard?namecard:'./namecards/ministry.png'), 0, 0, 1200, 300)
    } else {
        if (ministry) {
            context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300)
        } else {
            context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300)
        }
    }
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
function checkMap(str: string) {
    let value = true
    charMap.toLowerCase().split('').forEach(char => {
        if (char == str) {
            console.log(char)
            value = false
        }
    })
    return value
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('guildMemberAdd', async (member: GuildMember) => {
    let guild = member.guild
    let mainchat = member.guild.channels.cache.get('632995958950723584')
    let url = member.displayAvatarURL().replace('webp', 'png')
    if (url) {
        getWelcomeBanner(url).then(buffer => {
            if (mainchat && mainchat instanceof TextChannel) {
                const attachment = new MessageAttachment(buffer, "Welcome.png")
                mainchat.send({ content: `<@${member.id}> has joined the server.`, files: [attachment] })
            }
        })
    }
    let members = 0
    await guild.members.fetch()
    guild.members.cache.forEach(member => {
        if (!member.user.bot) {
            members++
        }
    })
    if (!guild.channels.cache.find(chan => chan.name.startsWith('User-Count'))) {
        await guild.channels.create(`User-Count-${members}`, { type: 'GUILD_VOICE', permissionOverwrites: [{ id: guild.roles.everyone.id, deny: ['CONNECT'] }] })
    } else {
        guild.channels.cache.find(chan => chan.name.startsWith('User-Count'))?.setName(`User-Count-${members}`)
    }
})
client.on('userUpdate', async (oldUser, newUser) => {
    let member = client.guilds.cache.get(config.server.mainserver)?.members.cache.get(newUser.id)
    if (member && member.manageable && !member.nickname && checkMap(member.displayName.charAt(0))) {
        //member.setNickname(`[p] ${member.displayName}`)
        //member.createDM().then(async channel => {
        //try { await channel.send('Your nickname or username change was unpingable, and a pingable nickname was automatically given in the Wolf-Co Server.') }
        //catch (err) { console.log(err) }
        //})
    }
})
client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (newMember && newMember.manageable && checkMap(newMember.displayName.charAt(0))) {
        //newMember.setNickname(`[p] ${newMember.displayName}`)
        //newMember.createDM().then(async channel => {
        //try { await channel.send('Your nickname or username change was unpingable, and a pingable nickname was automatically given in the Wolf-Co Server.') }
        //catch (err) { console.log(err) }
        //})
    }
})
client.on('ready', async () => {
    client.guilds.cache.forEach(async guild => {
        await guild.members.fetch()
        let members = 0
        guild.members.cache.forEach(member => {
            if (!member.user.bot) {
                members++
            }
        })
        if (!guild.channels.cache.find(chan => chan.name.startsWith('User-Count'))) {
            await guild.channels.create(`User-Count-${members}`, { type: 'GUILD_VOICE', permissionOverwrites: [{ id: guild.roles.everyone.id, deny: ['CONNECT'] }] })
        } else {
            guild.channels.cache.find(chan => chan.name.startsWith('User-Count'))?.setName(`User-Count-${members}`)
        }
    })
    let mainserver = client.guilds.cache.get(config.server.mainserver)
    client.application?.commands.set(require('./commands.json'))
    if (mainserver) {
        game.setup(client, client.channels.cache.get(config.server.gamechannel))
        xp.setup(client)
        if (config.server.game) {
            game.selGame()
        }
    } else {
        console.log("Server not found")
    }
})
client.on('messageCreate', async (msg: Message) => {
    if (msg.guild?.id == config.server.mainserver && msg.channel instanceof TextChannel) {
        if (msg.author.bot == false) {
            if (msg.content.length > 5) {
                xp.give({ author: msg.author, channel: msg.channel }, 15 + Math.floor(Math.random() * 10), true)
            }
            if (msg.channel.id == config.server.gamechannel && msg.content.length >= 1) {
                game.checkWord(msg)
            } else if (msg.channel.id == config.server.countchannel) {
                require('./counting.js')(client, msg)
            }
        } else if (msg.author.id == client.user?.id && msg.channel.id == '1001697908636270602' && msg.content.startsWith('givexp')) {
            let args = msg.content.split(' ').splice(0, 1)
            let id = args[0]
            if (id !== 'null') {
                if (args[1] == 'chat') {
                    xp.give({ author: msg.author, channel: msg.channel }, 0.5, false)
                    msg.channel.send('giving 0.5 xp')
                } else if (args[1] == 'login') {
                    xp.give({ author: msg.author, channel: msg.channel }, 15 + Math.floor(Math.random() * 10), true)
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
        if (interaction.commandName == 'overwatch') {
            interaction.deferReply()
            let data = await axios.get('https://api.overwatcharcade.today/api/v1/overwatch/today')
            let modes = data.data.data.modes
            let fields: APIEmbedField[] = []
            modes.forEach((mode: { "name": string, "description": string }) => {
                fields.push({ name: mode.name, value: mode.description })
            });
            let embed = new MessageEmbed()
                .addFields(fields)
                .setDescription('These are all the arcade games today.\nChanges at 7pm CST')
                .setTitle('Overwatch Arcade Today')
            interaction.editReply({ embeds: [embed] })
        }
        if (interaction.commandName == 'function' && checkOwner(interaction)) {
            let func = interaction.options.get('user')?.value
            if (typeof func == 'string') {
                eval(func)
            }
        } else if (interaction.commandName == 'boostingsince') {
            let member = interaction.options.get('user')?.member
            if (member instanceof GuildMember) {
                interaction.reply(member.premiumSinceTimestamp ? member.premiumSinceTimestamp.toString() : '0')
            } else {
                interaction.reply('No')
                console.log(member)
            }
        } else if (interaction.commandName == 'level') {
            await interaction.deferReply()
            let data = xp.get()
            let user: UserProfile | undefined
            let member: GuildMember | APIInteractionDataResolvedGuildMember | undefined | null = interaction.options.get('user')?.member
            if (member instanceof GuildMember) {
                user = data.users.find(user => user.id == interaction.options.get('user')?.value)
            } else {
                member = interaction.member
                user = data.users.find(user => user.id == interaction.user.id)
            }
            if (member instanceof GuildMember) {
                let data2 = xp.get().users.sort((a, b) => { return b.xp - a.xp })
                data2.findIndex(user2 => user2 == user)
                if (user) {
                    getImage(user.xp, xp.level(user.level), member.user.username, member.user.discriminator, user.level, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(user2 => user2 == user) + 1, (member.roles instanceof GuildMemberRoleManager) ? member.roles.cache.has('785054691008577536') : false, user.namecard).then(buffer => {
                        const attachment = new MessageAttachment(buffer, "LevelCard.png")
                        interaction.editReply({ files: [attachment] })
                    })
                } else {
                    getImage(55, xp.level(0), member.user.username, member.user.discriminator, 0, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(user2 => user2 == user) + 1, (member.roles instanceof GuildMemberRoleManager) ? member.roles.cache.has('785054691008577536') : false, user.namecard).then(buffer => {
                        const attachment = new MessageAttachment(buffer, "LevelCard.png")
                        interaction.editReply({ files: [attachment] })
                    })
                }
            }
        } else if (interaction.commandName == 'create') {
            require('./UnoMaster.js').startNewGame(interaction)
        } else if (interaction.commandName == 'leaderboard') {
            await interaction.guild?.members.fetch()
            let data = xp.get().users.sort((a, b) => { return b.xp - a.xp })
            let fields: APIEmbedField[] = []
            for (let i = 0; i <= 9; i++) {
                if (interaction.guild?.members.cache.get(data[i].id)) {
                    fields.push({ "name": `${medals[i] ? medals[i] : (i + 1)} | ${interaction.guild.members.cache.get(data[i].id)?.displayName} (${data[i].level})`, "value": `Xp: ${data[i].xp}`, "inline": false })
                } else {
                    fields.push({ "name": `${medals[i] ? medals[i] : (i + 1)} | <@${data[i].id}>`, "value": `Xp: ${data[i].xp}`, "inline": false })
                }
            }
            let embed = new MessageEmbed()
                .setTitle('XP Leaderboard')
                .addFields(fields)
            reply.embed(interaction, embed)
        } else if (interaction.commandName == 'daily') {
            let data = xp.get()
            if (interaction.channel) {
                xp.give({ author: interaction.user, channel: interaction.channel }, 0)
                let user = data.users.find(prof => prof.id == interaction.user.id)
                if (user) {
                    if (Date.now() > user.epoch) {
                        let gems = Math.round(Math.random() * 10) + 10
                        let exp = Math.round(Math.random() * 25) + 25
                        user.epoch = Date.now() + 64800000
                        xp.give({ author: interaction.user, channel: interaction.channel }, exp)
                        xp.giveGems(user.id, gems)
                        interaction.reply(`You earned ${gems} gems, and ${exp} experience.`)
                        xp.write(data)
                    } else {
                        reply.silent(interaction, `you can run this command again in ${remainingTime(user.epoch - Date.now())}`)
                    }
                } else {
                    reply.error(interaction, 'User Error')
                }
            } else {
                reply.error(interaction, 'Channel Error')
            }
        } else if (interaction.commandName == 'flip') {
            let bet = interaction.options.get('amount')?.value
            let data = xp.get()
            let user = data.users.find(prof => prof.id == interaction.user.id)
            let timeout = xp.timeouts().find(timeout => timeout.id == interaction.user.id && timeout.type == 'flipCD')
            if (timeout) {
                reply.error(interaction, `You can't use this command for ${remainingTime(timeout.endTime - Date.now())}`)
            } else {
                if (typeof bet == 'number' && bet >= 25) {
                    if (user && user.gems >= bet && interaction.channel) {
                        xp.timeout(interaction.user.id, 'flipCD', 120000)
                        if (Math.round(Math.random())) {
                            xp.giveGems(user.id, bet * 2)
                            interaction.reply(`<a:showoff:1004215186439274516> You won ${bet * 2} gems!`)
                        } else {
                            xp.giveGems(user.id, -bet)
                            interaction.reply(`<:kek:1004270229397970974> You lost ${-bet} gems.`)
                        }
                    } else {
                        reply.error(interaction, 'You do not have enough gems for this bet.')
                    }
                } else {
                    reply.error(interaction, 'The Minimum bet is 25 gems.')
                }
            }
        } else if (interaction.commandName == 'game' && checkOwner(interaction)) {
            if (interaction.options.get('type')?.value == 'scramble') {
                game.scramble()
                interaction.reply('Starting a new unscramble.')
            } else {
                game.math()
                interaction.reply('Creating a new math problem.')
            }
        } else if (interaction.commandName == 'give' && checkOwner(interaction)) {
            let user = interaction.options.get('user')?.user
            let amount = interaction.options.get('amount')?.value
            if (user && typeof amount == 'number') {
                if (interaction.options.get('type')?.value == 'xp') {
                    if (interaction.channel) {
                        xp.give({ author: user, channel: interaction.channel }, amount, false)
                        interaction.reply(`Giving ${amount} xp to ${user}`)
                    }
                } else if (interaction.options.get('type')?.value == 'gems') {
                    xp.giveGems(user.id, amount)
                    interaction.reply(`Giving ${amount} gems to ${user}`)
                }
            }
        } else if (interaction.commandName == 'gems') {
            let data = xp.get()
            let user
            if (interaction.options.get('user')?.user) {
                user = data.users.find(user => user.id == interaction.options.get('user')?.user?.id)
                if (user) {
                    interaction.reply(`<a:showoff:1004215186439274516> They have ${user.gems} gems.`)
                } else {
                    interaction.reply(`<:kek:1004270229397970974> This guy is broke.`)
                }
            } else {
                user = data.users.find(user => user.id == interaction.user.id)
                if (user) {
                    interaction.reply(`<a:showoff:1004215186439274516> You have ${user.gems} gems.`)
                } else {
                    interaction.reply(`<:kek:1004270229397970974> You're broke.`)
                }
            }
        } else if (interaction.commandName == 'shop') {
            let data = xp.get()
            let user = data.users.find(user => user.id == interaction.user.id)
            if (user) {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('shop')
                            .addOptions([
                                {
                                    "label": "Server Boost | 2x xp- 1 hour",
                                    "description": "This item costs 100 gems",
                                    "value": "2_1_100"
                                },
                                {
                                    "label": "Server Boost | 2x xp- 6 hours",
                                    "description": "This item costs 500 gems",
                                    "value": "2_6_500"
                                },
                                {
                                    "label": "Server Boost | 2x xp- 24 hours",
                                    "description": "This item costs 2000 gems",
                                    "value": "2_24_2000"
                                },
                                {
                                    "label": "Server Boost | 4x xp- 1 hour",
                                    "description": "This item costs 300 gems",
                                    "value": "4_1_300"
                                }
                            ])
                            .setMinValues(1)
                            .setMaxValues(1)
                    )
                const embed = new MessageEmbed()
                    .setTitle('Booster Shop')
                    .setDescription('Welcome to the shop, spend your gems here.\nBoosters can be used with /item\nAll sales are final')
                interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
            } else {
                interaction.reply(`No userdata found.`)
            }

        } else if (interaction.commandName == 'publicshop' && checkOwner(interaction)) {
            let data = xp.get()
            let user = data.users.find(user => user.id == interaction.user.id)
            if (user) {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('shop')
                            .addOptions([
                                {
                                    "label": "Server Boost | 2x xp- 1 hour",
                                    "description": "This item costs 100 gems",
                                    "value": "0_2_1_100"
                                },
                                {
                                    "label": "Server Boost | 2x xp- 6 hours",
                                    "description": "This item costs 500 gems",
                                    "value": "0_2_6_500"
                                },
                                {
                                    "label": "Server Boost | 2x xp- 24 hours",
                                    "description": "This item costs 2000 gems",
                                    "value": "0_2_24_2000"
                                },
                                {
                                    "label": "Server Boost | 4x xp- 1 hour",
                                    "description": "This item costs 300 gems",
                                    "value": "0_4_1_300"
                                },
                                {
                                    "label": "Overwatch Namecard",
                                    "description": "Costs 300",
                                    "value": "1_overwatch_300"
                                },
                                {
                                    "label": "Magma Namecard",
                                    "description": "Costs 600",
                                    "value": "1_magma_600"
                                },
                                {
                                    "label": "Ministry Namecard",
                                    "description": "Costs 10000000",
                                    "value": "1_ministry_10000000"
                                },
                                {
                                    "label": "Red-Sky Namecard",
                                    "description": "Costs 600",
                                    "value": "1_red-sky_600"
                                }
                            ])
                            .setMinValues(1)
                            .setMaxValues(1)
                    )
                const embed = new MessageEmbed()
                    .setTitle('Shop')
                    .setDescription('Welcome to the shop, spend your gems here.\nBoosters/Namecards can be used with /items\nAll sales are final')
                interaction.reply({ embeds: [embed], components: [row], ephemeral: false })
            } else {
                interaction.reply(`No userdata found.`)
            }

        } else if (interaction.commandName == 'items') {
            let data = xp.get()
            let user = data.users.find(user => user.id == interaction.user.id)
            if (user && user.items.length > 0) {
                let fields: EmbedField[] = []
                let nameoptions: any[] = []
                let boostoptions: any[] = []
                let embed = new MessageEmbed()
                    .setTitle('Inventory')
                    .setDescription('View all your items here.\nUse the select menu to use an item.')
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('namecard')
                            .setStyle('PRIMARY')
                            .setLabel('Set Namecard'),
                        new MessageButton()
                            .setCustomId('booster')
                            .setStyle('PRIMARY')
                            .setLabel('Use booster')
                    )
                user.items.forEach(item => {
                    fields.push(item.display)
                    if (item.type == 'booster') {
                        boostoptions.push({ label: item.display.name, description: item.display.value, value: user?.items.findIndex(sitem => sitem == item).toString() })
                    } else if (item.type == 'namecard') {
                        nameoptions.push({ label: item.display.name, description: item.display.value, value: user?.items.findIndex(sitem => sitem == item).toString() })
                    }
                })
                //const row = new MessageActionRow()
                //  .addComponents(
                //    new MessageSelectMenu()
                //      .setCustomId('use')
                //    .addOptions(options)
                //  .setMinValues(1)
                //.setMaxValues(1)
                // )
                embed.setFields(fields)
                interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
                let collector = interaction.channel?.createMessageComponentCollector({ componentType: 'BUTTON', filter: i => i.user.id == interaction.user.id, time: 60000, max: 1 })
                collector?.on('collect', async i => {
                    if (i.customId == 'namecard') {
                        let embed = new MessageEmbed()
                            .setTitle('Namecard Inventory')
                            .setDescription('Use the selector menu below to equip a namecard.')
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('usenamecard')
                                    .addOptions(nameoptions)
                            )
                        i.reply({ embeds: [embed], components: [row], ephemeral: true })
                        let collect = i.channel?.createMessageComponentCollector({ componentType: 'SELECT_MENU', filter: a => a.user.id == i.user.id, time: 60000, max: 1 })
                        if (collect) {
                        collect.on('collect', async interaction => {
                            let data = xp.get()
                            let user = data.users.find(user => user.id == interaction.user.id)
                            if (user) {
                                user.namecard = user.items[typeof interaction.values[0] == 'number' ? interaction.values[0] : 0].data.file
                            }
                            interaction.reply({ephemeral: true,content:'Sucessfully set namecard'})
                        })
                        } else {
                            i.followUp('error')
                        }
                    } else if (i.customId == 'booster') {
                        let embed = new MessageEmbed()
                            .setTitle('Booster Inventory')
                            .setDescription('Use the selector menu below to use a booster.')
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('use')
                                    .addOptions(boostoptions)
                            )
                        i.reply({ embeds: [embed], components: [row], ephemeral: true })
                    }
                })
            }
        } else if (interaction.commandName == 'punish' && checkOwner(interaction)) {
            require('./punisher.js').punish(interaction)
        } else if (interaction.commandName == 'punishments' && checkOwner(interaction)) {
            require('./punisher.js').getpunishments(interaction.options.get('user')?.user, interaction)
        } else if (interaction.commandName == 'rule') {
            let rule: string = strCheck(interaction.options.get('rule')?.value)
            let embed = new MessageEmbed()
                .setTitle(interaction.options.getSubcommand())
                .setDescription(rule)
            reply.embed(interaction, embed)
        }
    } else if (interaction.isSelectMenu()) {
        if (interaction.customId == 'shop') {
            let args = interaction.values[0].split('_')
            let data = xp.get()
            let user = data.users.find(user => user.id == interaction.user.id)
            if (user) {
                if (user.items == undefined) {
                    user.items = []
                }
                if (args[0] == '0' && user.gems > parseInt(args[3])) {
                    user.items.push({ type: 'booster', display: { name: `${args[1]}x Booster`, value: `Lasts ${args[2]}h`, inline: false }, data: { multiplier: args[1], length: parseInt(args[2]) } })
                    user.gems = user.gems - parseInt(args[3])
                    xp.write(data)
                    reply.silent(interaction, `Successfully bought booster. Use it by running /items in #bot-cmds.`)
                } else if (args[0] == '1' && user.gems > parseInt(args[2])) {
                    let name = `${args[1]} Namecard`
                    name[0].toUpperCase()
                    user.items.push({ type: 'namecard', display: { name: name, value: `Equip in your inventory`, inline: false }, data: { file: `./namecards/${args[1]}.png` } })
                    user.gems = user.gems - parseInt(args[3])
                    xp.write(data)
                    reply.silent(interaction, `Successfully bought namecard. Equip it using /items in #bot-cmds.`)
                }
            } else {
                reply.error(interaction, `You can't afford this item.`)
            }
        } else if (interaction.customId == 'use') {
            if (xp.getMultiplier() == 1) {
                let index = interaction.values[0]
                let data = xp.get()
                let user = data.users.find(user => user.id == interaction.user.id)
                if (user) {
                    let booster = user.items[parseInt(index)]
                    xp.setMultiplier(booster.data.multiplier, booster.data.length * 3600000)
                    user.items.splice(parseInt(index), 1)
                    interaction.reply(`@here | <@${interaction.user.id}> has activated a ${booster.data.multiplier}x XP Booster for ${remainingTime(booster.data.length * 3600000)}`)
                } else {
                    reply.error(interaction, 'User not found.')
                }
            } else {
                reply.error(interaction, 'A booster is already active.')
            }
        }
    }
})
client.login(config.server.token);
