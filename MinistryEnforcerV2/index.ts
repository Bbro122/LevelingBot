// Imports

import { AttachmentBuilder, Client, ActionRowBuilder, CommandInteraction, GuildMember, Interaction, Message, Embed, TextChannel, SelectMenuInteraction, SelectMenuBuilder, EmbedField, SelectMenuOptionBuilder, User, GuildMemberRoleManager, ButtonBuilder, ButtonInteraction, Partials, GatewayIntentBits, AnyAPIActionRowComponent, AnyComponentBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonStyle, ComponentType, StringSelectMenuInteraction, StringSelectMenuBuilder, StageChannel, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuBuilder, NewsChannel, PublicThreadChannel, VoiceChannel, PrivateThreadChannel, PartialDMChannel, DMChannel, InteractionCollector, CacheType } from "discord.js";
import can from 'canvas';
import gameManager from "./modules/gamemanager"
import dataManager, { BaseUser, BaseUserManager, GlobalUser, LocalUser } from './modules/datamanager'

const client = new Client({ partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User], intents: 131071 });
let medals = ['🥇', '🥈', '🥉']
let charMap = "`~1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]};:'.>,<qwertyuiopasdfghjklzxcvbnm /?|" + '"'
function checkModerator(interaction: CommandInteraction, reply?: boolean) {
    let permissions = interaction.member?.permissions
    if (permissions && typeof permissions != 'string') {
        if (permissions.has(PermissionFlagsBits.Administrator)) {
            return true
        } else {
            if (reply) {
                interaction.reply("This command has been reserved for administration.")
            }
            return false
        }
    }
}
function checkOwner(interaction: CommandInteraction, reply?: boolean) {
    let permissions = interaction.member?.permissions
    if (permissions && typeof permissions != 'string') {
        if (interaction.guild?.ownerId == interaction.user.id) {
            return true
        } else {
            if (reply) {
                interaction.reply("This command has been reserved for the server owner.")
            }
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
function random(min: number, max: number) {
    return Math.round(Math.random() * (max - min)) + min
}
async function getImage(user: BaseUserManager, dUser: User) {
    const lastRequirement = (user.level > 1) ? dataManager.levelRequirement(user.level - 1) : 0
    const avatarURL = dUser.avatarURL({ extension: 'png' })
    const requirement = dataManager.levelRequirement(user.level)
    let canvas = can.createCanvas(1200, 300)
    let context = canvas.getContext('2d')
    context.fillStyle = '#171717'
    context.fillRect(0, 0, 1200, 300)
    context.fillStyle = '#171717'
    context.fillRect(325, 200, 800, 50)
    context.fillStyle = '#00EDFF'
    context.fillRect(325, 200, Math.round(((user.xp - lastRequirement) / (requirement - lastRequirement)) * 800), 50)
    context.drawImage(await can.loadImage(avatarURL ? avatarURL : './Compiled/MinistryEnforcerV2/namecards/default.png'), 50, 50, 200, 200)
    context.drawImage(await can.loadImage('./Compiled/MinistryEnforcerV2/namecards/default.png'), 0, 0, 1200, 300)
    // Rank Info 
    context.fillStyle = '#ffffff'
    context.font = '40px Arial'
    context.fillText(`Rank #${user.rank}`, 325, 100)
    // Username
    context.fillText(dUser.username, 325, 190)
    let wid = context.measureText(dUser.username).width
    // Requirements + Discriminator
    context.font = '30px Arial'
    context.fillText(dUser.discriminator, 335 + wid, 192)
    context.fillText(`${user.xp - lastRequirement} / ${requirement - lastRequirement} XP`, 1125 - context.measureText(`${user.xp - dataManager.getLevel(user.level - 1)} / ${dataManager.levelRequirement(user.level) - dataManager.getLevel(user.level - 1)} XP`).width, 192)
    context.fillStyle = '#00EDFF'
    // Top Right Level
    context.fillText("Level", 960, 75)
    context.font = '60px Arial'
    context.fillText(user.level.toString(), 1043, 75)
    return canvas.toBuffer('image/png')
}
client.on('ready', () => {
    client.guilds.fetch()
    client.application?.commands.set([])
    client.guilds.cache.forEach(guild => {
        guild.commands.set(require('./commands.json'))
    })
    //dataManager.onStart(client)
    gameManager.setup(client)
})
client.on('messageCreate', message => {
    if (message.guild?.id && !message.author.bot) {
        let serverManager = dataManager.getManager(message.guild.id)
        let user = serverManager.getUser(message.author.id)
        let guild = message.guild
        if (message.content.length > 5 && guild?.id) {
            const oldLevel = user.level
            user.addXP(random(15, 25))
            if (oldLevel != user.level) {
                message.channel.send(`<@${user.id}> You are now level ${user.level}`)
            }
        }
        if (guild) {
            let values = gameManager.getAnswer(guild.id)
            if (values && values.currentValue == message.content && guild.id) {
                user.addXP(values.reward)
                gameManager.answer(guild.id)
            }
        }
    }
})
client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.guildId) {
        let serverManager = dataManager.getManager(interaction.guildId)
        let user = serverManager.getUser(interaction.user.id)
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                //Xp Commands
                case 'leaderboard': {
                    let list: BaseUser[] = serverManager.users.sort((a, b) => b.xp - a.xp)
                    let users: EmbedField[] = []
                    for (let i = 0; i < 10; i++) {
                        const user = list[i]
                        if (user) {
                            let username = interaction.guild?.members.cache.get(user.id)
                            let field: EmbedField = { name: username ? username.displayName : user.id, value: user.xp.toString(), inline: false }
                            users.push(field)
                        }
                    }
                    let embed = new EmbedBuilder()
                        .setTitle('Server XP Leaderboard')
                        .addFields(users)
                    let row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents([
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId('gem')
                                .setLabel('Gems'),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId('gxp')
                                .setLabel('Global XP'),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Danger)
                                .setCustomId('cur')
                                .setLabel('Coins'),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setCustomId('lxp')
                                .setLabel('Local XP')
                        ])
                    let msg = await interaction.reply({ embeds: [embed], components: [row] })
                    msg.createMessageComponentCollector({ componentType: ComponentType.Button }).on('collect', int => {
                        users = []
                        let title = ''
                        switch (int.customId) {
                            case 'gem':
                                title = 'Global Gems Leaderboard'
                                list = dataManager.getGlobalUsers().sort((a, b) => b.gems - a.gems)
                                for (let i = 0; i < 10; i++) {
                                    const user = (list[i] as GlobalUser)
                                    if (user) {
                                        let username = interaction.guild?.members.cache.get(user.id)
                                        let field: EmbedField = { name: username ? username.displayName : user.id, value: user.gems.toString(), inline: false }
                                        users.push(field)
                                    }
                                }
                                break;
                            case 'gxp':
                                title = 'Global XP Leaderboard'
                                list = dataManager.getGlobalUsers().sort((a, b) => b.xp - a.xp)
                                for (let i = 0; i < 10; i++) {
                                    const user = list[i]
                                    if (user) {
                                        let username = interaction.guild?.members.cache.get(user.id)
                                        let field: EmbedField = { name: username ? username.displayName : user.id, value: user.xp.toString(), inline: false }
                                        users.push(field)
                                    }
                                }
                                break
                            case 'lxp':
                                title = 'Server XP Leaderboard'
                                list = serverManager.users.sort((a, b) => b.xp - a.xp)
                                for (let i = 0; i < 10; i++) {
                                    const user = list[i]
                                    if (user) {
                                        let username = interaction.guild?.members.cache.get(user.id)
                                        let field: EmbedField = { name: username ? username.displayName : user.id, value: user.xp.toString(), inline: false }
                                        users.push(field)
                                    }
                                }
                                break;
                            case 'cur':
                                title = 'Server Coins Leaderboard'
                                list = serverManager.users.sort((a, b) => (b.balance.bank + b.balance.wallet) - (a.balance.bank + a.balance.wallet))
                                for (let i = 0; i < 10; i++) {
                                    const user = (list[i] as LocalUser)
                                    if (user) {
                                        let username = interaction.guild?.members.cache.get(user.id)
                                        let field: EmbedField = { name: username ? username.displayName : user.id, value: (user.balance.bank+user.balance.wallet).toString(), inline: false }
                                        users.push(field)
                                    }
                                }
                                break;
                        }
                        let embed = new EmbedBuilder()
                            .setTitle(title)
                            .setDescription('Users are sorted by XP')
                            .addFields(users)
                        int.update({ embeds: [embed], components: [row] })
                    })
                }
                    break;
                case 'level': { // Untested 
                    let auser = interaction.options.get("user")?.user
                    if (auser) { auser = interaction.user; user = serverManager.getUser(auser.id) }
                    let attachment = new AttachmentBuilder(await getImage(user, interaction.user))
                    interaction.reply({ files: [attachment] })
                }
                    break;
                case 'stats': {
                    if (!(interaction.member instanceof GuildMember)) return
                    let embed = new EmbedBuilder()
                        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
                        .setFields([
                            { name: 'XP', value: user.xp.toString(), inline: true },
                            { name: 'Coins', value: (user.wallet + user.bank).toString(), inline: true },
                            { name: 'Gems', value: user.getGlobalUser().gems.toString(), inline: true },
                            { name: 'Level', value: user.level.toString(), inline: true }
                        ])
                    interaction.reply({ embeds: [embed] })
                }

                    break;
                case 'bank':
                case 'balance': {
                    if (!(interaction.member instanceof GuildMember)) return
                    let embed = new EmbedBuilder()
                        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
                        .setFields([
                            { name: 'Wallet', value: (user.wallet).toString(), inline: true },
                            { name: 'Bank', value: (user.bank).toString(), inline: true },
                            { name: 'Gems', value: user.getGlobalUser().gems.toString(), inline: true },])
                    interaction.reply({ embeds: [embed] })
                }
                    break;
                case 'daily': { // Time Delay Untested
                    console.log(user.epoch)
                    if (Date.now() >= (user.epoch + 64800000)) {
                        let xp = random(150, 250)
                        let gem = random(1, 5)
                        let currency = random(25, 50)
                        user.addXP(xp)
                        user.addWallet(currency)
                        let guser = user.getGlobalUser()
                        guser.addGems(gem)
                        guser.addXP(xp)
                        let embed = new EmbedBuilder()
                            .setColor('LuminousVividPink')
                            .setTitle('Daily Rewards')
                            .setDescription('Come back tomorrow for more rewards!')
                            .setFields([{ name: 'XP', inline: true, value: xp.toString() }, { name: 'Currency', inline: true, value: currency.toString() }, { name: 'Gems', inline: true, value: gem.toString() }])
                        user.setEpoch()
                        interaction.reply({ embeds: [embed] })
                        console.log(user.level)
                        user.addXP(1000)
                        console.log(user.level)
                    } else {
                        interaction.reply(`You can recieve more rewards at <t:${Math.round((user.epoch + 64800000) / 1000)}:t>`)
                    }
                }
                    break
                case 'flip': { // Untested Code
                    let bet = interaction.options.get('bet')?.value
                    console.log(bet)
                    console.log(user.wallet)
                    if (typeof bet == 'number' && user.wallet > bet) {
                        let win = random(0, 1)
                        let embed = new EmbedBuilder()
                            .setThumbnail(win ? 'https://cdn.discordapp.com/attachments/1040422701195603978/1106274390527705168/R.gif' : 'https://cdn.discordapp.com/attachments/858439510425337926/1106440676884893716/broken_coin.png')
                            .setTitle(win ? `It's your Lucky day!` : `Better luck next time`)
                            .setDescription(win ? `Successfully earned ${bet} coins` : `Lost ${bet} coins`)
                            .setColor('Yellow')
                        if (win == 0) {
                            user.addWallet(-bet)
                        } else {
                            user.addWallet(bet)
                        }
                        await interaction.reply({ embeds: [embed] })
                    } else {
                        interaction.reply('Your gonna need more coins to make this bet.')
                    }
                    break;
                }
                case 'crash': {
                    if (interaction.user.id=='316243027423395841') {
                        let x
                        (x as any).crash()
                    }
                }
                case 'setup': {
                    if (checkOwner(interaction, true) && !(interaction.channel instanceof StageChannel)) {
                        let embed = new EmbedBuilder()
                            .setTitle('Server Setup Menu')
                            .setDescription('Use the selection menu below to modify different parts of the server.')
                        let row = new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(new StringSelectMenuBuilder()
                                .addOptions([
                                    {
                                        label: 'Games Channel',
                                        value: 'gchan'
                                    },
                                    {
                                        label: 'Games (Enabled/Disabled)',
                                        value: 'gbool'
                                    },
                                    {
                                        label: 'Games Delay',
                                        value: 'gdelay'
                                    }
                                ])
                                .setCustomId('setup')
                            )
                        interaction.reply({ embeds: [embed], components: [row] })
                        let collect = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.StringSelect, idle: 120000, max: 1, filter: c => c.user.id == interaction.user.id && c.customId == 'setup' })
                        function collector(collect: InteractionCollector<SelectMenuInteraction<CacheType>>) {
                            collect?.on('collect', async int => {
                                collect.stop()
                                switch (int.values[0]) {
                                    case 'gdelay': {
                                        let emb = new EmbedBuilder()
                                            .setTitle('Set Game Delay')
                                            .setDescription('Select a number below in hours.')
                                        let row2 = new ActionRowBuilder<StringSelectMenuBuilder>()
                                            .addComponents(new StringSelectMenuBuilder()
                                                .addOptions([
                                                    {
                                                        label: '1',
                                                        value: '1'
                                                    },
                                                    {
                                                        label: '2',
                                                        value: '2'
                                                    },
                                                    {
                                                        label: '3',
                                                        value: '3'
                                                    },
                                                    {
                                                        label: '4',
                                                        value: '4',
                                                    },
                                                    {
                                                        label: '5',
                                                        value: '5',
                                                    }, {
                                                        label: '6',
                                                        value: '6',
                                                    }
                                                ])
                                                .setCustomId('delay')
                                            );

                                        await int.update({ embeds: [emb], components: [row2] });
                                        let collect = (interaction.channel as DMChannel | PartialDMChannel | NewsChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel<boolean> | VoiceChannel | null)?.createMessageComponentCollector({ filter: t => t.customId == 'delay' && t.user.id == interaction.user.id, componentType: ComponentType.StringSelect, idle: 120000, max: 1 })
                                        collect?.on('collect', async int => {
                                            let manager = dataManager.getManager(interaction.guildId as string)
                                            manager.setSetting('gameDelay', Number(int.values[0]) * 3600000)
                                            let collect = (interaction.channel as TextChannel).createMessageComponentCollector({ componentType: ComponentType.StringSelect, idle: 120000, max: 1, filter: c => c.user.id == interaction.user.id && c.customId == 'setup' });
                                            if (collect) {
                                                await int.update({ embeds: [embed], components: [row] });
                                                collector(collect as InteractionCollector<SelectMenuInteraction<CacheType>>)
                                            }
                                        })
                                    }
                                        break;
                                    case 'gchan': {
                                        let emb = new EmbedBuilder()
                                            .setTitle('Set Game Channel')
                                            .setDescription('Select a channel below.')
                                        let row2 = new ActionRowBuilder<ChannelSelectMenuBuilder>()
                                            .addComponents(new ChannelSelectMenuBuilder()
                                                .setCustomId('channel')
                                                .setChannelTypes([ChannelType.GuildText])
                                            );
                                        await int.update({ embeds: [emb], components: [row2] });
                                        let collect = (interaction.channel as DMChannel | PartialDMChannel | NewsChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel<boolean> | VoiceChannel | null)?.createMessageComponentCollector({ filter: t => t.customId == 'channel' && t.user.id == interaction.user.id, componentType: ComponentType.ChannelSelect, idle: 120000, max: 1 })
                                        collect?.on('collect', async channel => {
                                            let manager = dataManager.getManager(interaction.guildId as string)
                                            manager.setSetting('gameChannel', channel.values[0])
                                            let collect = (interaction.channel as TextChannel).createMessageComponentCollector({ componentType: ComponentType.StringSelect, idle: 120000, max: 1, filter: c => c.user.id == interaction.user.id && c.customId == 'setup' });
                                            if (collect) {
                                                await channel.update({ embeds: [embed], components: [row] });
                                                collector(collect as InteractionCollector<SelectMenuInteraction<CacheType>>)
                                            }
                                        })
                                    }
                                        break;
                                    case 'gbool':
                                        let emb = new EmbedBuilder()
                                            .setTitle('Set if games are enabled.')
                                            .setDescription('Select Enabled or Disabled')
                                        let row2 = new ActionRowBuilder<StringSelectMenuBuilder>()
                                            .addComponents(new StringSelectMenuBuilder()
                                                .addOptions([
                                                    {
                                                        label: 'Enabled',
                                                        value: 'true'
                                                    },
                                                    {
                                                        label: 'Disabled',
                                                        value: 'false'
                                                    }
                                                ])
                                                .setCustomId('bool')
                                            );

                                        await int.update({ embeds: [emb], components: [row2] });
                                        let collect = (interaction.channel as DMChannel | PartialDMChannel | NewsChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel<boolean> | VoiceChannel | null)?.createMessageComponentCollector({ filter: t => t.customId == 'bool' && t.user.id == interaction.user.id, componentType: ComponentType.StringSelect, idle: 120000, max: 1 })
                                        collect?.on('collect', async int => {
                                            let manager = dataManager.getManager(interaction.guildId as string)
                                            manager.setSetting('gameBool', eval(int.values[0]))
                                            let collect = (interaction.channel as TextChannel).createMessageComponentCollector({ componentType: ComponentType.StringSelect, idle: 120000, max: 1, filter: c => c.user.id == interaction.user.id && c.customId == 'setup' });
                                            if (collect) {
                                                await int.update({ embeds: [embed], components: [row] });
                                                collector(collect as InteractionCollector<SelectMenuInteraction<CacheType>>)
                                            }
                                        })
                                        break;
                                    default:
                                        break;
                                }
                            })
                        }
                        if (collect) {
                            collector(collect)
                        }
                    }
                }
                    break;
                default: {
                    if (checkModerator(interaction, true)) {
                        switch (interaction.commandName) {
                            case 'xp':
                                let amount = interaction.options.get('amount')?.value
                                let type = interaction.options.get('type')?.value
                                //let user = serverManager.getUser((interaction.options.get('user')?.value as unknown as User).id)
                                if (typeof type == 'string' && typeof amount == 'number') {
                                    switch (type) {
                                        case 'set': {
                                            user.setXP(amount)
                                            interaction.reply(`Set <@${user}>'s xp to ${amount}`)
                                        }
                                            break;
                                        case 'remove': {
                                            user.addXP(-amount)
                                            interaction.reply(`Removing ${amount} xp from <@${user}>`)
                                        }
                                            break;
                                        case 'give': {
                                            user.addXP(amount)
                                            interaction.reply(`Giving ${amount} xp to <@${user}>`)
                                        }
                                            break;
                                        default:
                                            interaction.reply('Type Error: Xp Command')
                                            break;
                                    }
                                } else {
                                    interaction.reply('Data Error: Xp Command')
                                }
                                break;

                            default: {
                                interaction.reply('Command Unknown. (Update in Progress)')
                            }
                                break;
                        }
                    }
                }
                    break
            }
        }
    }
})
client.login(require('./token.json').token);