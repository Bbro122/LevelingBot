"use strict";
// Imports
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const canvas_1 = __importDefault(require("canvas"));
const gamemanager_1 = __importDefault(require("./modules/gamemanager"));
const xpmanager_1 = __importDefault(require("./modules/xpmanager"));
const datamanager_1 = __importDefault(require("./modules/datamanager"));
const client = new discord_js_1.Client({ partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction, discord_js_1.Partials.GuildMember, discord_js_1.Partials.User], intents: 131071 });
let medals = ['🥇', '🥈', '🥉'];
let charMap = "`~1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]};:'.>,<qwertyuiopasdfghjklzxcvbnm /?|" + '"';
function checkModerator(interaction, reply) {
    var _a;
    let permissions = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions;
    if (permissions && typeof permissions != 'string') {
        if (permissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            return true;
        }
        else {
            if (reply) {
                interaction.reply("This command has been reserved for administration.");
            }
            return false;
        }
    }
}
function checkOwner(interaction, reply) {
    var _a, _b;
    let permissions = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions;
    if (permissions && typeof permissions != 'string') {
        if (((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.ownerId) == interaction.user.id) {
            return true;
        }
        else {
            if (reply) {
                interaction.reply("This command has been reserved for the server owner.");
            }
            return false;
        }
    }
}
function getWelcomeBanner(imagelink) {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = canvas_1.default.createCanvas(1200, 300);
        let context = canvas.getContext('2d');
        context.drawImage(yield canvas_1.default.loadImage(imagelink), 478, 51, 203, 203);
        context.drawImage(yield canvas_1.default.loadImage('./welcome.png'), 0, 0, 1200, 300);
        return canvas.toBuffer('image/png');
    });
}
function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
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
    datamanager_1.default.onStart(client);
    gamemanager_1.default.setup(client);
});
client.on('messageCreate', message => {
    var _a;
    if ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id) {
        let datamanager = datamanager_1.default.getServer(message.guild.id);
        let xpM = xpmanager_1.default.getXPManager(message.guild.id);
        let guild = message.guild;
        if (message.content.length > 5 && (guild === null || guild === void 0 ? void 0 : guild.id)) {
            xpM.addXP(message.author.id, random(15, 25), true);
        }
        if (guild && datamanager.getSetting('games.channel') == message.channel.id) {
            let values = gamemanager_1.default.getAnswer(guild.id);
            if (values && values.currentValue == message.content && guild.id) {
                xpM.addXP(message.author.id, values.reward, true);
                gamemanager_1.default.answer(guild.id);
            }
        }
    }
});
client.on('interactionCreate', (interaction) => {
    var _a, _b, _c;
    if (interaction.guildId) {
        let xpM = xpmanager_1.default.getXPManager(interaction.guildId);
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                //Xp Commands
                case 'level':
                    {
                        let user = interaction.options.get("user");
                        if (!user) {
                            user = interaction.user;
                        }
                        let xp = xpM.getXP(user.id);
                        interaction.reply(xpmanager_1.default.getLevel(xp).toString());
                    }
                    break;
                case 'addbounty':
                    {
                    }
                    break;
                case 'removebounty':
                    {
                    }
                    break;
                case 'setup':
                    {
                        if (checkOwner(interaction, true)) {
                            const modal = new discord_js_1.ModalBuilder()
                                .setCustomId('setup')
                                .setTitle(`Setup Menu`);
                            const row = new discord_js_1.ActionRowBuilder();
                            const gameChannel = new discord_js_1.TextInputBuilder()
                                .setCustomId('gameChannel')
                                .setLabel('ID of Game Channel')
                                .setStyle(discord_js_1.TextInputStyle.Short);
                            const countChannel = new discord_js_1.TextInputBuilder()
                                .setCustomId('countChannel')
                                .setLabel('ID of Count Channel')
                                .setStyle(discord_js_1.TextInputStyle.Short);
                            const unoChannel = new discord_js_1.TextInputBuilder()
                                .setCustomId('unoChannel')
                                .setLabel('ID of Uno Thread')
                                .setStyle(discord_js_1.TextInputStyle.Short);
                            const cahChannel = new discord_js_1.TextInputBuilder()
                                .setCustomId('cahChannel')
                                .setLabel('ID of Cah Thread')
                                .setStyle(discord_js_1.TextInputStyle.Short);
                            modal.setComponents([row.setComponents([gameChannel, countChannel, unoChannel, cahChannel])]);
                            interaction.showModal(modal);
                        }
                    }
                    break;
                default:
                    {
                        if (checkModerator(interaction, true)) {
                            switch (interaction.commandName) {
                                case 'xp':
                                    let amount = (_a = interaction.options.get('amount')) === null || _a === void 0 ? void 0 : _a.value;
                                    let type = (_b = interaction.options.get('type')) === null || _b === void 0 ? void 0 : _b.value;
                                    let user = (_c = interaction.options.get('user')) === null || _c === void 0 ? void 0 : _c.value;
                                    if (typeof type == 'string' && typeof amount == 'number' && typeof user == 'string' && interaction.guild) {
                                        switch (type) {
                                            case 'set':
                                                {
                                                    xpM.setXP(user, amount);
                                                    interaction.reply(`Set <@${user}>'s xp to ${amount}`);
                                                }
                                                break;
                                            case 'remove':
                                                {
                                                    xpM.addXP(user, -amount);
                                                    interaction.reply(`Removing ${amount} xp from <@${user}>`);
                                                }
                                                break;
                                            case 'give':
                                                {
                                                    xpM.addXP(user, amount);
                                                    interaction.reply(`Giving ${amount} xp to <@${user}>`);
                                                }
                                                break;
                                            default:
                                                interaction.reply('Type Error: Xp Command');
                                                break;
                                        }
                                    }
                                    else {
                                        interaction.reply('Data Error: Xp Command');
                                    }
                                    break;
                                default:
                                    {
                                        interaction.reply('Command Unknown. (Update in Progress)');
                                    }
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
        else if (interaction.isModalSubmit()) {
            if (interaction.customId == 'setup') {
            }
        }
    }
});
client.login(require('./token.json').token);
