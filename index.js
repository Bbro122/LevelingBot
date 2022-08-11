"use strict";
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
const client = new discord_js_1.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'], intents: [new discord_js_1.Intents(32767)] });
let xp = require('./xpmanager.js');
let game = require('./gamemanager.js');
let config = require("./config.json");
let medals = ['🥇', '🥈', '🥉'];
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
let reply = {
    silent: function (interaction, reply) {
        interaction.reply({ content: reply, ephemeral: true });
    },
    error: function (interaction, error) {
        interaction.reply({ content: `**Error |** ${error}`, ephemeral: true });
    },
    embed: function (interaction, embed, row) {
        interaction.reply({ embeds: [embed], components: row ? [row] : undefined });
    }
};
function remainingTime(milliseconds) {
    let string = '';
    if (milliseconds > 3600000) {
        string = `${Math.floor(milliseconds / 3600000)} hour(s)`;
        if (Math.floor((milliseconds - (Math.floor(milliseconds / 3600000) * 3600000)) / 60000) > 0) {
            string = string + ` ${Math.floor((milliseconds - (Math.floor(milliseconds / 3600000) * 3600000)) / 60000)} minute(s)`;
        }
    }
    else if (milliseconds > 60000) {
        string = `${Math.floor(milliseconds / 60000)} minute(s)`;
        if (Math.floor((milliseconds - (Math.floor(milliseconds / 60000) * 60000)) / 1000) > 0) {
            string = string + ` ${Math.floor((milliseconds - (Math.floor(milliseconds / 60000) * 60000)) / 1000)} seconds`;
        }
    }
    else if (milliseconds > 1000) {
        string = `${Math.floor(milliseconds / 1000)} seconds`;
    }
    else {
        return `${milliseconds} milliseconds`;
    }
    return string;
}
function strCheck(str) {
    if (typeof str == 'string') {
        return str;
    }
    else {
        return '';
    }
}
function checkOwner(interaction) {
    var _a;
    let permissions = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions;
    if (permissions instanceof discord_js_1.Permissions) {
        if (permissions.has('ADMINISTRATOR')) {
            return true;
        }
        else {
            interaction.reply("This command is reserved for Ministry usage only.");
            return false;
        }
    }
}
function getImage(exp, requirement, username, number, level, imagelink, rank) {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = canvas_1.default.createCanvas(1200, 300);
        let context = canvas.getContext('2d');
        context.fillStyle = '#171717';
        context.fillRect(0, 0, 1200, 300);
        context.fillStyle = '#171717';
        context.fillRect(325, 200, 800, 50);
        context.fillStyle = '#00EDFF';
        context.fillRect(325, 200, Math.round((exp - xp.level(level - 1)) / (requirement - xp.level(level - 1)) * 800), 50);
        context.drawImage(yield canvas_1.default.loadImage(imagelink), 50, 50, 200, 200);
        context.drawImage(yield canvas_1.default.loadImage('./Overlay.png'), 0, 0, 1200, 300);
        context.fillStyle = '#ffffff';
        context.font = '40px Arial';
        context.fillText(`Rank #${rank}`, 325, 100);
        context.fillText(username, 325, 190);
        let wid = context.measureText(username).width;
        context.font = '30px Arial';
        context.fillText(number, 335 + wid, 192);
        context.fillText(`${exp - xp.level(level - 1)} / ${requirement - xp.level(level - 1)} XP`, 1125 - context.measureText(`${exp - xp.level(level - 1)} / ${requirement - xp.level(level - 1)} XP`).width, 192);
        context.fillStyle = '#00EDFF';
        context.fillText("Level", 960, 75);
        context.font = '60px Arial';
        context.fillText(level, 1043, 75);
        return canvas.toBuffer('image/png');
    });
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    let mainserver = client.guilds.cache.get(config.server.mainserver);
    if (mainserver) {
        try {
            mainserver.commands.set(require('./commands.json'));
        }
        catch (err) {
            console.log(err);
        }
        game.setup(client, client.channels.cache.get(config.server.gamechannel));
        xp.setup(client);
        if (config.server.game) {
            game.selGame();
        }
    }
    else {
        console.log("Server not found");
    }
}));
client.on('messageCreate', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id) == config.server.mainserver && msg.channel instanceof discord_js_1.TextChannel) {
        if (msg.author.bot == false) {
            if (msg.content.length > 5) {
                xp.give({ author: msg.author, channel: msg.channel }, 15 + Math.floor(Math.random() * 10), true);
            }
            if (msg.channel.id == config.server.gamechannel && msg.content.length >= 1) {
                game.checkWord(msg);
            }
            else if (msg.channel.id == config.server.countchannel) {
                require('./counting.js')(client, msg);
            }
        }
        else if (msg.author.id == ((_b = client.user) === null || _b === void 0 ? void 0 : _b.id) && msg.channel.id == '1001697908636270602' && msg.content.startsWith('givexp')) {
            let args = msg.content.split(' ').splice(0, 1);
            let id = args[0];
            if (id !== 'null') {
                if (args[1] == 'chat') {
                    xp.give({ author: msg.author, channel: msg.channel }, 0.5, false);
                    msg.channel.send('giving 0.5 xp');
                }
                else if (args[1] == 'login') {
                    xp.give({ author: msg.author, channel: msg.channel }, 15 + Math.floor(Math.random() * 10), true);
                    msg.channel.send('giving 15-25 xp');
                }
            }
            else {
                msg.channel.send('id is null');
            }
        }
    }
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (interaction.isCommand()) {
        if (interaction.commandName == 'level') {
            yield interaction.deferReply();
            let data = xp.get();
            let user;
            let member = (_c = interaction.options.get('user')) === null || _c === void 0 ? void 0 : _c.member;
            if (member instanceof discord_js_1.GuildMember) {
                user = data.users.find(user => { var _a; return user.id == ((_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.value); });
            }
            else {
                member = interaction.member;
                user = data.users.find(user => user.id == interaction.user.id);
            }
            if (member instanceof discord_js_1.GuildMember) {
                let data2 = xp.get().users.sort((a, b) => { return b.xp - a.xp; });
                data2.findIndex(user2 => user2 == user);
                if (user) {
                    getImage(user.xp, xp.level(user.level), member.user.username, member.user.discriminator, user.level, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(user2 => user2 == user) + 1).then(buffer => {
                        const attachment = new discord_js_1.MessageAttachment(buffer, "LevelCard.png");
                        interaction.editReply({ files: [attachment] });
                    });
                }
                else {
                    getImage(55, xp.level(0), member.user.username, member.user.discriminator, 0, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(user2 => user2 == user) + 1).then(buffer => {
                        const attachment = new discord_js_1.MessageAttachment(buffer, "LevelCard.png");
                        interaction.editReply({ files: [attachment] });
                    });
                }
            }
        }
        else if (interaction.commandName == 'leaderboard') {
            yield ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.members.fetch());
            let data = xp.get().users.sort((a, b) => { return b.xp - a.xp; });
            let fields = [];
            for (let i = 0; i <= 9; i++) {
                if ((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.members.cache.get(data[i].id)) {
                    fields.push({ "name": `${medals[i] ? medals[i] : (i + 1)} | ${(_f = interaction.guild.members.cache.get(data[i].id)) === null || _f === void 0 ? void 0 : _f.displayName} (${data[i].level})`, "value": `Xp: ${data[i].xp}`, "inline": false });
                }
                else {
                    fields.push({ "name": `${medals[i] ? medals[i] : (i + 1)} | <@${data[i].id}>`, "value": `Xp: ${data[i].xp}`, "inline": false });
                }
            }
            let embed = new discord_js_1.MessageEmbed()
                .setTitle('XP Leaderboard')
                .addFields(fields);
            reply.embed(interaction, embed);
        }
        else if (interaction.commandName == 'daily') {
            let data = xp.get();
            if (interaction.channel) {
                xp.give({ author: interaction.user, channel: interaction.channel }, 0);
                let user = data.users.find(prof => prof.id == interaction.user.id);
                if (user) {
                    if (Date.now() > user.epoch) {
                        let gems = Math.round(Math.random() * 10) + 10;
                        let exp = Math.round(Math.random() * 25) + 25;
                        user.epoch = Date.now() + 64800000;
                        xp.give({ author: interaction.user, channel: interaction.channel }, exp);
                        xp.giveGems(user.id, gems);
                        interaction.reply(`You earned ${gems} gems, and ${exp} experience.`);
                        xp.write(data);
                    }
                    else {
                        reply.silent(interaction, `you can run this command again in ${remainingTime(user.epoch - Date.now())}`);
                    }
                }
                else {
                    reply.error(interaction, 'User Error');
                }
            }
            else {
                reply.error(interaction, 'Channel Error');
            }
        }
        else if (interaction.commandName == 'flip') {
            let bet = (_g = interaction.options.get('amount')) === null || _g === void 0 ? void 0 : _g.value;
            let data = xp.get();
            let user = data.users.find(prof => prof.id == interaction.user.id);
            let timeout = xp.timeouts().find(timeout => timeout.id == interaction.user.id && timeout.type == 'flipCD');
            if (timeout) {
                reply.error(interaction, `You can't use this command for ${remainingTime(timeout.endTime - Date.now())}`);
            }
            else {
                if (typeof bet == 'number' && bet >= 25) {
                    if (user && user.gems >= bet && interaction.channel) {
                        xp.timeout(interaction.user.id, 'flipCD', 120000);
                        if (Math.round(Math.random())) {
                            xp.giveGems(user.id, bet * 2);
                            interaction.reply(`<a:showoff:1004215186439274516> You won ${bet * 2} gems!`);
                        }
                        else {
                            xp.giveGems(user.id, -bet);
                            interaction.reply(`<:kek:1004270229397970974> You lost ${-bet} gems.`);
                        }
                    }
                    else {
                        reply.error(interaction, 'You do not have enough gems for this bet.');
                    }
                }
                else {
                    reply.error(interaction, 'The Minimum bet is 25 gems.');
                }
            }
        }
        else if (interaction.commandName == 'game' && checkOwner(interaction)) {
            if (((_h = interaction.options.get('type')) === null || _h === void 0 ? void 0 : _h.value) == 'scramble') {
                game.scramble();
                interaction.reply('Starting a new unscramble.');
            }
            else {
                game.math();
                interaction.reply('Creating a new math problem.');
            }
        }
        else if (interaction.commandName == 'give' && checkOwner(interaction)) {
            let user = (_j = interaction.options.get('user')) === null || _j === void 0 ? void 0 : _j.user;
            let amount = (_k = interaction.options.get('amount')) === null || _k === void 0 ? void 0 : _k.value;
            if (user && typeof amount == 'number') {
                if (((_l = interaction.options.get('type')) === null || _l === void 0 ? void 0 : _l.value) == 'xp') {
                    if (interaction.channel) {
                        xp.give({ author: user, channel: interaction.channel }, amount, false);
                        interaction.reply(`Giving ${amount} xp to ${user}`);
                    }
                }
                else if (((_m = interaction.options.get('type')) === null || _m === void 0 ? void 0 : _m.value) == 'gems') {
                    xp.giveGems(user.id, amount);
                    interaction.reply(`Giving ${amount} gems to ${user}`);
                }
            }
        }
        else if (interaction.commandName == 'gems') {
            let data = xp.get();
            let user;
            if ((_o = interaction.options.get('user')) === null || _o === void 0 ? void 0 : _o.user) {
                user = data.users.find(user => { var _a, _b; return user.id == ((_b = (_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id); });
                if (user) {
                    interaction.reply(`<a:showoff:1004215186439274516> They have ${user.gems} gems.`);
                }
                else {
                    interaction.reply(`<:kek:1004270229397970974> This guy is broke.`);
                }
            }
            else {
                user = data.users.find(user => user.id == interaction.user.id);
                if (user) {
                    interaction.reply(`<a:showoff:1004215186439274516> You have ${user.gems} gems.`);
                }
                else {
                    interaction.reply(`<:kek:1004270229397970974> You're broke.`);
                }
            }
        }
        else if (interaction.commandName == 'shop') {
            let data = xp.get();
            let user = data.users.find(user => user.id == interaction.user.id);
            if (user) {
                const row = new discord_js_1.MessageActionRow()
                    .addComponents(new discord_js_1.MessageSelectMenu()
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
                    .setMaxValues(1));
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle('Booster Shop')
                    .setDescription('Welcome to the shop, spend your gems here.\nBoosters can be used with /item\nAll sales are final');
                interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            }
            else {
                interaction.reply(`No userdata found.`);
            }
        }
        else if (interaction.commandName == 'items') {
            let data = xp.get();
            let user = data.users.find(user => user.id == interaction.user.id);
            if (user && user.items.length > 0) {
                let fields = [];
                let options = [];
                let embed = new discord_js_1.MessageEmbed()
                    .setTitle('Inventory')
                    .setDescription('View all your items here.\nUse the select menu to use an item.');
                user.items.forEach(item => {
                    fields.push(item.display);
                    if (item.type == 'booster') {
                        options.push({ label: item.display.name, description: item.display.value, value: user === null || user === void 0 ? void 0 : user.items.findIndex(sitem => sitem == item).toString() });
                    }
                });
                const row = new discord_js_1.MessageActionRow()
                    .addComponents(new discord_js_1.MessageSelectMenu()
                    .setCustomId('use')
                    .addOptions(options)
                    .setMinValues(1)
                    .setMaxValues(1));
                embed.setFields(fields);
                interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            }
            else {
                reply.error(interaction, 'You have no items.');
            }
        }
        else if (interaction.commandName == 'punish' && checkOwner(interaction)) {
            require('./punisher.js').punish(interaction);
        }
        else if (interaction.commandName == 'punishments' && checkOwner(interaction)) {
            require('./punisher.js').getpunishments((_p = interaction.options.get('user')) === null || _p === void 0 ? void 0 : _p.user, interaction);
        }
        else if (interaction.commandName == 'rule') {
            let rule = strCheck((_q = interaction.options.get('rule')) === null || _q === void 0 ? void 0 : _q.value);
            let embed = new discord_js_1.MessageEmbed()
                .setTitle(interaction.options.getSubcommand())
                .setDescription(rule);
            reply.embed(interaction, embed);
        }
    }
    else if (interaction.isButton()) {
        require('./punisher').punishConfirm(interaction);
    }
    else if (interaction.isSelectMenu()) {
        if (interaction.customId == 'shop') {
            let args = interaction.values[0].split('_');
            let data = xp.get();
            let user = data.users.find(user => user.id == interaction.user.id);
            if (user && user.gems > parseInt(args[2])) {
                if (user.items == undefined) {
                    user.items = [];
                }
                user.items.push({ type: 'booster', display: { name: `${args[0]}x Booster`, value: `Lasts ${args[1]}h`, inline: false }, data: { multiplier: args[0], length: parseInt(args[1]) } });
                user.gems = user.gems - parseInt(args[2]);
                xp.write(data);
                reply.silent(interaction, `Successfully bought item.`);
            }
            else {
                reply.error(interaction, `You can't afford this item.`);
            }
        }
        else if (interaction.customId == 'use') {
            if (xp.getMultiplier() == 1) {
                let index = interaction.values[0];
                let data = xp.get();
                let user = data.users.find(user => user.id == interaction.user.id);
                if (user) {
                    let booster = user.items[parseInt(index)];
                    xp.setMultiplier(booster.data.multiplier, booster.data.length * 3600000);
                    user.items.splice(parseInt(index), 1);
                    interaction.reply(`@here | <@${interaction.user.id}> has activated a ${booster.data.multiplier}x XP Booster for ${remainingTime(booster.data.length * 3600000)}`);
                }
                else {
                    reply.error(interaction, 'User not found.');
                }
            }
            else {
                reply.error(interaction, 'A booster is already active.');
            }
        }
    }
}));
client.login(config.server.token);
