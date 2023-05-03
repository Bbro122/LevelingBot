// Imports

import { AttachmentBuilder, Client, ActionRowBuilder, CommandInteraction, GuildMember, Interaction, Message, Embed, TextChannel, SelectMenuInteraction, SelectMenuBuilder, EmbedField, SelectMenuOptionBuilder, User, GuildMemberRoleManager, ButtonBuilder, ButtonInteraction, Partials, GatewayIntentBits, AnyAPIActionRowComponent, AnyComponentBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonStyle, ComponentType, StringSelectMenuInteraction, StringSelectMenuBuilder, StageChannel, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuBuilder, NewsChannel, PublicThreadChannel, VoiceChannel, PrivateThreadChannel, PartialDMChannel, DMChannel, InteractionCollector, CacheType } from "discord.js";
import can from 'canvas';
import gameManager from "./modules/gamemanager"
import xpManager from "./modules/xpmanager"
import dataManager from './modules/datamanager'
import fs from 'fs'
import axios from 'axios'

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
// async function getImage(exp: number, username: any, number: any, level: any, imagelink?: any) {
//     let canvas = can.createCanvas(1200, 300)
//     let context = canvas.getContext('2d')
//     context.fillStyle = '#171717'
//     context.fillRect(0, 0, 1200, 300)
//     context.fillStyle = '#171717'
//     context.fillRect(325, 200, 800, 50)
//     context.fillStyle = '#00EDFF'
//     context.fillRect(325, 200, Math.round((exp - xpmanager.getLevel(level - 1)) / (requirement - xpmanager.getLevel(level - 1)) * 800), 50)
//     context.drawImage(await can.loadImage(imagelink), 50, 50, 200, 200)
//     //if (ministry) { context.drawImage(await can.loadImage('./MinistrySymbol.png'), 500, 71, 26, 30); context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300) }
//     //else if (overwatch) { context.drawImage(await can.loadImage('./namecards/overwatch.png'), 0, 0, 1200, 300) }
//     //else { context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300) }
//     if (namecard) {
//         context.drawImage(await can.loadImage((namecard && typeof namecard == 'string') ? namecard : './namecards/ministry.png'), 0, 0, 1200, 300)
//     } else {
//         if (ministry) {
//             context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300)
//         } else {
//             context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300)
//         }
//     }
//     context.fillStyle = '#ffffff'
//     context.font = '40px Arial'
//     context.fillText(`Rank #${rank}`, 325, 100)
//     context.fillText(username, 325, 190)
//     let wid = context.measureText(username).width
//     context.font = '30px Arial'
//     context.fillText(number, 335 + wid, 192)
//     context.fillText(`${exp - xpmanager.getLevel(level - 1)} / ${requirement - xpmanager.getLevel(level - 1)} XP`, 1125 - context.measureText(`${exp - xpmanager.getLevel(level - 1)} / ${requirement - xpmanager.getLevel(level - 1)} XP`).width, 192)
//     context.fillStyle = '#00EDFF'
//     context.fillText("Level", 960, 75)
//     context.font = '60px Arial'
//     context.fillText(level, 1043, 75)
//     return canvas.toBuffer('image/png')
// }
client.on('ready', () => {
    dataManager.onStart(client)
    gameManager.setup(client)
})
client.on('messageCreate', message => {
    if (message.guild?.id) {
        let datamanager = dataManager.getServer(message.guild.id)
        let xpM = xpManager.getXPManager(message.guild.id)
        let guild = message.guild
        if (message.content.length > 5 && guild?.id) {
            xpM.addXP(message.author.id, random(15, 25), true)
        }
        if (guild && datamanager.getSetting('games.channel') == message.channel.id) {
            let values = gameManager.getAnswer(guild.id)
            if (values && values.currentValue == message.content && guild.id) {
                xpM.addXP(message.author.id, values.reward, true)
                gameManager.answer(guild.id)
            }
        }
    }
})
client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.guildId) {
        let xpM = xpManager.getXPManager(interaction.guildId)
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                //Xp Commands
                case 'level': {
                    let user = interaction.options.get("user") as unknown as User
                    if (!user) { user = interaction.user }
                    let xp = xpM.getXP(user.id)
                    interaction.reply(xpManager.getLevel(xp).toString())
                }
                    break;
                case 'addbounty': {

                }

                    break;

                case 'removebounty': {

                }
                    break;
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
                        let collect = interaction.channel?.createMessageComponentCollector({ filter: t => t.customId == 'setup', componentType: ComponentType.StringSelect, idle: 120000, max: 1 })
                        function collector(collect: InteractionCollector<SelectMenuInteraction<CacheType>>) {
                            collect?.on('collect', async int => {
                                collect.stop()
                                switch (int.values[0]) {
                                    case 'gdelay':
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

                                        await (interaction as CommandInteraction).editReply({ embeds: [emb], components: [row2] });
                                        let collect = (interaction.channel as DMChannel | PartialDMChannel | NewsChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel<boolean> | VoiceChannel | null)?.createMessageComponentCollector({ filter: t => t.customId == 'setup', componentType: ComponentType.StringSelect, idle: 120000, max: 1 })
                                        collect?.on('collect', async int => {
                                            let settings = dataManager.getServer(interaction.guildId as string).getSettings();
                                            settings.games.delay = Number(int.values[0]);
                                            dataManager.write(settings);
                                            let collect = (interaction.channel as TextChannel).createMessageComponentCollector();
                                            if (collect) {
                                                await (interaction as CommandInteraction).editReply({ embeds: [embed], components: [row] });
                                                collector(collect as InteractionCollector<SelectMenuInteraction<CacheType>>)
                                            }
                                        })
                                        break;
                                    case 'gchan':

                                        break;
                                    case 'gbool':

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
                    break
                default: {
                    if (checkModerator(interaction, true)) {
                        switch (interaction.commandName) {
                            case 'xp':
                                let amount = interaction.options.get('amount')?.value
                                let type = interaction.options.get('type')?.value
                                let user = interaction.options.get('user')?.value
                                if (typeof type == 'string' && typeof amount == 'number' && typeof user == 'string' && interaction.guild) {
                                    switch (type) {
                                        case 'set': {
                                            xpM.setXP(user, amount)
                                            interaction.reply(`Set <@${user}>'s xp to ${amount}`)
                                        }
                                            break;
                                        case 'remove': {
                                            xpM.addXP(user, -amount)
                                            interaction.reply(`Removing ${amount} xp from <@${user}>`)
                                        }
                                            break;
                                        case 'give': {
                                            xpM.addXP(user, amount)
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
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId == 'setup') {

            }
        }
    }
})
client.login(require('./token.json').token);