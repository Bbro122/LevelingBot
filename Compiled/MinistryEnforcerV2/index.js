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
function getImage(user, dUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const lastRequirement = (user.level > 1) ? datamanager_1.default.levelRequirement(user.level - 1) : 0;
        const avatarURL = dUser.avatarURL({ extension: 'png' });
        const requirement = datamanager_1.default.levelRequirement(user.level);
        let canvas = canvas_1.default.createCanvas(1200, 300);
        let context = canvas.getContext('2d');
        context.fillStyle = '#171717';
        context.fillRect(0, 0, 1200, 300);
        context.fillStyle = '#171717';
        context.fillRect(325, 200, 800, 50);
        context.fillStyle = '#00EDFF';
        context.fillRect(325, 200, Math.round(((user.xp - lastRequirement) / (requirement - lastRequirement)) * 800), 50);
        context.drawImage(yield canvas_1.default.loadImage(avatarURL ? avatarURL : '../namecards/default.png'), 50, 50, 200, 200);
        context.drawImage(yield canvas_1.default.loadImage('./namecards/default.png'), 0, 0, 1200, 300);
        // Rank Info
        context.fillStyle = '#ffffff';
        context.font = '40px Arial';
        context.fillText(`Rank #${datamanager_1.default.getGlobalRank(user.xp)}`, 325, 100);
        // Username
        context.fillText(dUser.username, 325, 190);
        let wid = context.measureText(dUser.username).width;
        // Requirements + Discriminator
        context.font = '30px Arial';
        context.fillText(dUser.discriminator, 335 + wid, 192);
        context.fillText(`${user.xp - lastRequirement} / ${requirement - lastRequirement} XP`, 1125 - context.measureText(`${user.xp - datamanager_1.default.getLevel(user.level - 1)} / ${datamanager_1.default.levelRequirement(user.level) - datamanager_1.default.getLevel(user.level - 1)} XP`).width, 192);
        context.fillStyle = '#00EDFF';
        // Top Right Level
        context.fillText("Level", 960, 75);
        context.font = '60px Arial';
        context.fillText(user.level.toString(), 1043, 75);
        return canvas.toBuffer('image/png');
    });
}
client.on('ready', () => {
    var _a;
    client.guilds.fetch();
    (_a = client.application) === null || _a === void 0 ? void 0 : _a.commands.set([]);
    client.guilds.cache.forEach(guild => {
        guild.commands.set(require('./commands.json'));
    });
    //dataManager.onStart(client)
    gamemanager_1.default.setup(client);
});
client.on('messageCreate', message => {
    var _a;
    if ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id) {
        let serverManager = datamanager_1.default.getManager(message.guild.id);
        let user = serverManager.getUser(message.author.id);
        let guild = message.guild;
        if (message.content.length > 5 && (guild === null || guild === void 0 ? void 0 : guild.id)) {
            user.addXP(random(15, 25));
        }
        if (guild) {
            let values = gamemanager_1.default.getAnswer(guild.id);
            if (values && values.currentValue == message.content && guild.id) {
                user.addXP(values.reward);
                gamemanager_1.default.answer(guild.id);
            }
        }
    }
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    if (interaction.guildId) {
        let serverManager = datamanager_1.default.getManager(interaction.guildId);
        let user = serverManager.getUser(interaction.user.id);
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                //Xp Commands
                case 'level':
                    { // Untested 
                        let auser = (_a = interaction.options.get("user")) === null || _a === void 0 ? void 0 : _a.user;
                        if (auser) {
                            auser = interaction.user;
                            user = serverManager.getUser(auser.id);
                        }
                        let attachment = new discord_js_1.AttachmentBuilder(yield getImage(user, interaction.user));
                        interaction.reply({ files: [attachment] });
                    }
                    break;
                case 'stats':
                    {
                        if (!(interaction.member instanceof discord_js_1.GuildMember))
                            return;
                        let embed = new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
                            .setFields([
                            { name: 'XP', value: user.xp.toString(), inline: true },
                            { name: 'Coins', value: (user.wallet + user.bank).toString(), inline: true },
                            { name: 'Gems', value: user.getGlobalUser().gems.toString(), inline: true },
                            { name: 'Level', value: user.level.toString(), inline: true }
                        ]);
                        interaction.reply({ embeds: [embed] });
                    }
                    break;
                case 'balance':
                    {
                        if (!(interaction.member instanceof discord_js_1.GuildMember))
                            return;
                        let embed = new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
                            .setFields([
                            { name: 'Wallet', value: (user.wallet).toString(), inline: true },
                            { name: 'Bank', value: (user.bank).toString(), inline: true },
                            { name: 'Gems', value: user.getGlobalUser().gems.toString(), inline: true },
                        ]);
                        interaction.reply({ embeds: [embed] });
                    }
                    break;
                case 'daily':
                    { // Time Delay Untested
                        console.log(user.epoch);
                        if (Date.now() >= (user.epoch + 64800000)) {
                            let xp = random(150, 250);
                            let gem = random(1, 5);
                            let currency = random(25, 50);
                            user.addXP(xp);
                            user.addWallet(currency);
                            let guser = user.getGlobalUser();
                            guser.addGems(gem);
                            guser.addXP(xp);
                            let embed = new discord_js_1.EmbedBuilder()
                                .setColor('LuminousVividPink')
                                .setTitle('Daily Rewards')
                                .setDescription('Come back tomorrow for more rewards!')
                                .setFields([{ name: 'XP', inline: true, value: xp.toString() }, { name: 'Currency', inline: true, value: currency.toString() }, { name: 'Gems', inline: true, value: gem.toString() }]);
                            user.setEpoch();
                            interaction.reply({ embeds: [embed] });
                        }
                        else {
                            interaction.reply(`You can recieve more rewards at <t:${Math.round((user.epoch + 64800000) / 1000)}:t>`);
                        }
                    }
                    break;
                case 'flip': { // Untested Code
                    let bet = (_b = interaction.options.get('bet')) === null || _b === void 0 ? void 0 : _b.value;
                    console.log(bet);
                    console.log(user.wallet);
                    if (typeof bet == 'number' && user.wallet > bet) {
                        let win = random(0, 1);
                        let embed = new discord_js_1.EmbedBuilder()
                            .setThumbnail(win ? 'https://cdn.discordapp.com/attachments/1040422701195603978/1106274390527705168/R.gif' : 'https://cdn.discordapp.com/attachments/858439510425337926/1106440676884893716/broken_coin.png')
                            .setTitle(win ? `It's your Lucky day!` : `Better luck next time`)
                            .setDescription(win ? `Successfully earned ${bet} coins` : `Lost ${bet} coins`)
                            .setColor('Yellow');
                        if (win == 0) {
                            user.addWallet(-bet);
                        }
                        else {
                            user.addWallet(bet);
                        }
                        yield interaction.reply({ embeds: [embed] });
                    }
                    else {
                        interaction.reply('Your gonna need more coins to make this bet.');
                    }
                    break;
                }
                case 'setup':
                    {
                        if (checkOwner(interaction, true) && !(interaction.channel instanceof discord_js_1.StageChannel)) {
                            let embed = new discord_js_1.EmbedBuilder()
                                .setTitle('Server Setup Menu')
                                .setDescription('Use the selection menu below to modify different parts of the server.');
                            let row = new discord_js_1.ActionRowBuilder()
                                .addComponents(new discord_js_1.StringSelectMenuBuilder()
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
                                .setCustomId('setup'));
                            interaction.reply({ embeds: [embed], components: [row] });
                            let collect = (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, idle: 120000, max: 1, filter: c => c.user.id == interaction.user.id && c.customId == 'setup' });
                            function collector(collect) {
                                collect === null || collect === void 0 ? void 0 : collect.on('collect', (int) => __awaiter(this, void 0, void 0, function* () {
                                    var _a, _b, _c;
                                    collect.stop();
                                    switch (int.values[0]) {
                                        case 'gdelay':
                                            {
                                                let emb = new discord_js_1.EmbedBuilder()
                                                    .setTitle('Set Game Delay')
                                                    .setDescription('Select a number below in hours.');
                                                let row2 = new discord_js_1.ActionRowBuilder()
                                                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
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
                                                    .setCustomId('delay'));
                                                yield int.update({ embeds: [emb], components: [row2] });
                                                let collect = (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({ filter: t => t.customId == 'delay' && t.user.id == interaction.user.id, componentType: discord_js_1.ComponentType.StringSelect, idle: 120000, max: 1 });
                                                collect === null || collect === void 0 ? void 0 : collect.on('collect', (int) => __awaiter(this, void 0, void 0, function* () {
                                                    let manager = datamanager_1.default.getManager(interaction.guildId);
                                                    manager.setSetting('gameDelay', Number(int.values[0]) * 3600000);
                                                    let collect = interaction.channel.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, idle: 120000, max: 1, filter: c => c.user.id == interaction.user.id && c.customId == 'setup' });
                                                    if (collect) {
                                                        yield int.update({ embeds: [embed], components: [row] });
                                                        collector(collect);
                                                    }
                                                }));
                                            }
                                            break;
                                        case 'gchan':
                                            {
                                                let emb = new discord_js_1.EmbedBuilder()
                                                    .setTitle('Set Game Channel')
                                                    .setDescription('Select a channel below.');
                                                let row2 = new discord_js_1.ActionRowBuilder()
                                                    .addComponents(new discord_js_1.ChannelSelectMenuBuilder()
                                                    .setCustomId('channel')
                                                    .setChannelTypes([discord_js_1.ChannelType.GuildText]));
                                                yield int.update({ embeds: [emb], components: [row2] });
                                                let collect = (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.createMessageComponentCollector({ filter: t => t.customId == 'channel' && t.user.id == interaction.user.id, componentType: discord_js_1.ComponentType.ChannelSelect, idle: 120000, max: 1 });
                                                collect === null || collect === void 0 ? void 0 : collect.on('collect', (channel) => __awaiter(this, void 0, void 0, function* () {
                                                    let manager = datamanager_1.default.getManager(interaction.guildId);
                                                    manager.setSetting('gameChannel', channel.values[0]);
                                                    let collect = interaction.channel.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, idle: 120000, max: 1, filter: c => c.user.id == interaction.user.id && c.customId == 'setup' });
                                                    if (collect) {
                                                        yield channel.update({ embeds: [embed], components: [row] });
                                                        collector(collect);
                                                    }
                                                }));
                                            }
                                            break;
                                        case 'gbool':
                                            let emb = new discord_js_1.EmbedBuilder()
                                                .setTitle('Set if games are enabled.')
                                                .setDescription('Select Enabled or Disabled');
                                            let row2 = new discord_js_1.ActionRowBuilder()
                                                .addComponents(new discord_js_1.StringSelectMenuBuilder()
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
                                                .setCustomId('bool'));
                                            yield int.update({ embeds: [emb], components: [row2] });
                                            let collect = (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.createMessageComponentCollector({ filter: t => t.customId == 'bool' && t.user.id == interaction.user.id, componentType: discord_js_1.ComponentType.StringSelect, idle: 120000, max: 1 });
                                            collect === null || collect === void 0 ? void 0 : collect.on('collect', (int) => __awaiter(this, void 0, void 0, function* () {
                                                let manager = datamanager_1.default.getManager(interaction.guildId);
                                                manager.setSetting('gameBool', eval(int.values[0]));
                                                let collect = interaction.channel.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, idle: 120000, max: 1, filter: c => c.user.id == interaction.user.id && c.customId == 'setup' });
                                                if (collect) {
                                                    yield int.update({ embeds: [embed], components: [row] });
                                                    collector(collect);
                                                }
                                            }));
                                            break;
                                        default:
                                            break;
                                    }
                                }));
                            }
                            if (collect) {
                                collector(collect);
                            }
                        }
                    }
                    break;
                default:
                    {
                        if (checkModerator(interaction, true)) {
                            switch (interaction.commandName) {
                                case 'xp':
                                    let amount = (_d = interaction.options.get('amount')) === null || _d === void 0 ? void 0 : _d.value;
                                    let type = (_e = interaction.options.get('type')) === null || _e === void 0 ? void 0 : _e.value;
                                    //let user = serverManager.getUser((interaction.options.get('user')?.value as unknown as User).id)
                                    if (typeof type == 'string' && typeof amount == 'number') {
                                        switch (type) {
                                            case 'set':
                                                {
                                                    user.setXP(amount);
                                                    interaction.reply(`Set <@${user}>'s xp to ${amount}`);
                                                }
                                                break;
                                            case 'remove':
                                                {
                                                    user.addXP(-amount);
                                                    interaction.reply(`Removing ${amount} xp from <@${user}>`);
                                                }
                                                break;
                                            case 'give':
                                                {
                                                    user.addXP(amount);
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
    }
}));
client.login(require('./token.json').token);
