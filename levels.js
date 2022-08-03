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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var can = require('canvas');
var _a = require('discord.js'), Client = _a.Client, Intents = _a.Intents;
var MessageAttachment = require('discord.js').MessageAttachment;
var client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'], intents: [new Intents(32767)], fetchAllMembers: true });
var xp = require('./xpmanager.js');
var game = require('./gamemanager.js');
var config = require("./config.json");
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
function remainingTime(milliseconds) {
    var string = '';
    if (milliseconds > 3600000) {
        string = "".concat(Math.floor(milliseconds / 3600000), " hour(s) ").concat(Math.floor((milliseconds - (Math.floor(milliseconds / 3600000) * 3600000)) / 60000), " minute(s)");
    }
    else if (milliseconds > 60000) {
        string = "".concat(Math.floor(milliseconds / 60000), " minute(s) ").concat(Math.floor((milliseconds - (Math.floor(milliseconds / 60000) * 60000)) / 1000), " seconds");
    }
    else if (milliseconds > 1000) {
        string = "".concat(Math.floor(milliseconds / 1000), " seconds");
    }
    else {
        return "".concat(milliseconds, " milliseconds");
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
    var permissions = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions;
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
    return __awaiter(this, void 0, void 0, function () {
        var canvas, context, _a, _b, _c, _d, wid;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    canvas = can.createCanvas(1200, 300);
                    context = canvas.getContext('2d');
                    context.fillStyle = '#171717';
                    context.fillRect(0, 0, 1200, 300);
                    context.fillStyle = '#171717';
                    context.fillRect(325, 200, 800, 50);
                    context.fillStyle = '#00EDFF';
                    context.fillRect(325, 200, Math.round((exp - xp.level(level - 1)) / (requirement - xp.level(level - 1)) * 800), 50);
                    _b = (_a = context).drawImage;
                    return [4 /*yield*/, can.loadImage(imagelink)];
                case 1:
                    _b.apply(_a, [_e.sent(), 50, 50, 200, 200]);
                    _d = (_c = context).drawImage;
                    return [4 /*yield*/, can.loadImage('./Overlay.png')];
                case 2:
                    _d.apply(_c, [_e.sent(), 0, 0, 1200, 300]);
                    context.fillStyle = '#ffffff';
                    context.font = '40px Arial';
                    context.fillText("Rank #".concat(rank), 325, 100);
                    context.fillText(username, 325, 190);
                    wid = context.measureText(username).width;
                    context.font = '30px Arial';
                    context.fillText(number, 335 + wid, 192);
                    context.fillText("".concat(exp - xp.level(level - 1), " / ").concat(requirement - xp.level(level - 1), " XP"), 1125 - context.measureText("".concat(exp - xp.level(level - 1), " / ").concat(requirement - xp.level(level - 1), " XP")).width, 192);
                    context.fillStyle = '#00EDFF';
                    context.fillText("Level", 960, 75);
                    context.font = '60px Arial';
                    context.fillText(level, 1043, 75);
                    return [2 /*return*/, canvas.toBuffer('image/png')];
            }
        });
    });
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            client.guilds.cache.get(config.server.mainserver).commands.set(require('./commands.json'));
        }
        catch (err) {
            console.log(err);
        }
        game.setup(client, client.channels.cache.get(config.server.gamechannel));
        xp.setup(client);
        if (config.server.game) {
            game.selGame();
        }
        return [2 /*return*/];
    });
}); });
client.on('messageCreate', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, id;
    var _a;
    return __generator(this, function (_b) {
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
            else if (msg.author.id == client.user.id && msg.channel.id == '1001697908636270602' && msg.content.startsWith('givexp')) {
                args = msg.content.split(' ').splice(0, 1);
                id = args[0];
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
        return [2 /*return*/];
    });
}); });
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var data, user_1, member, data2, data, fields, i, embed, bet, data, user, timeout, user, amount, data, user, rule, embed;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                if (!interaction.isCommand()) return [3 /*break*/, 13];
                if (!(interaction.commandName == 'level')) return [3 /*break*/, 2];
                return [4 /*yield*/, interaction.deferReply()];
            case 1:
                _v.sent();
                data = xp.get();
                member = (_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.member;
                if (member instanceof discord_js_1.GuildMember) {
                    user_1 = data.users.find(function (user) { var _a; return user.id == ((_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.value); });
                }
                else {
                    member = interaction.member;
                    user_1 = data.users.find(function (user) { return user.id == interaction.user.id; });
                }
                if (member instanceof discord_js_1.GuildMember) {
                    data2 = xp.get().users.sort(function (a, b) { return b.xp - a.xp; });
                    data2.findIndex(function (user2) { return user2 == user_1; });
                    if (user_1) {
                        getImage(user_1.xp, xp.level(user_1.level), member.user.username, member.user.discriminator, user_1.level, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(function (user2) { return user2 == user_1; }) + 1).then(function (buffer) {
                            var attachment = new MessageAttachment(buffer, "LevelCard.png");
                            interaction.editReply({ files: [attachment] });
                        });
                    }
                    else {
                        getImage(55, xp.level(0), member.user.username, member.user.discriminator, 0, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(function (user2) { return user2 == user_1; }) + 1).then(function (buffer) {
                            var attachment = new MessageAttachment(buffer, "LevelCard.png");
                            interaction.editReply({ files: [attachment] });
                        });
                    }
                }
                return [3 /*break*/, 12];
            case 2:
                if (!(interaction.commandName == 'leaderboard')) return [3 /*break*/, 4];
                return [4 /*yield*/, ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.fetch())];
            case 3:
                _v.sent();
                data = xp.get().users.sort(function (a, b) { return b.xp - a.xp; });
                fields = [];
                if ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.cache.get(data[0].id)) {
                    fields.push({ "name": "\uD83E\uDD47 ".concat((_d = interaction.guild.members.cache.get(data[0].id)) === null || _d === void 0 ? void 0 : _d.displayName, " (").concat(data[0].level, ")"), "value": "Xp: ".concat(data[0].xp), "inline": false });
                }
                else {
                    fields.push({ "name": "\uD83E\uDD47 [Unknown Error- ".concat(data[0].id, "]"), "value": "Xp: ".concat(data[0].xp), "inline": false });
                }
                if ((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.members.cache.get(data[1].id)) {
                    fields.push({ "name": "\uD83E\uDD48 ".concat((_f = interaction.guild.members.cache.get(data[1].id)) === null || _f === void 0 ? void 0 : _f.displayName, " (").concat(data[1].level, ")"), "value": "Xp: ".concat(data[1].xp), "inline": false });
                }
                else {
                    fields.push({ "name": "\uD83E\uDD48 [Unknown Error- ".concat(data[1].id, "]"), "value": "Xp: ".concat(data[1].xp), "inline": false });
                }
                if ((_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.members.cache.get(data[2].id)) {
                    fields.push({ "name": "\uD83E\uDD49 ".concat((_h = interaction.guild.members.cache.get(data[2].id)) === null || _h === void 0 ? void 0 : _h.displayName, " (").concat(data[2].level, ")"), "value": "Xp: ".concat(data[2].xp), "inline": false });
                }
                else {
                    fields.push({ "name": "\uD83E\uDD49 [Unknown Error- ".concat(data[2].id, "]"), "value": "Xp: ".concat(data[2].xp), "inline": false });
                }
                for (i = 3; i <= 9; i++) {
                    if ((_j = interaction.guild) === null || _j === void 0 ? void 0 : _j.members.cache.get(data[i].id)) {
                        fields.push({ "name": "".concat(i + 1, ". ").concat((_k = interaction.guild.members.cache.get(data[i].id)) === null || _k === void 0 ? void 0 : _k.displayName, " (").concat(data[i].level, ")"), "value": "Xp: ".concat(data[i].xp), "inline": false });
                    }
                    else {
                        fields.push({ "name": "".concat(i + 1, ". [Unknown Error- ").concat(data[i].id, "]"), "value": "Xp: ".concat(data[i].xp), "inline": false });
                    }
                }
                embed = { title: "Leaderboard", description: "", fields: fields };
                interaction.reply({ embeds: [embed] });
                return [3 /*break*/, 12];
            case 4:
                if (!(interaction.commandName == 'flip')) return [3 /*break*/, 5];
                bet = (_l = interaction.options.get('amount')) === null || _l === void 0 ? void 0 : _l.value;
                data = xp.get();
                user = data.users.find(function (prof) { return prof.id == interaction.user.id; });
                timeout = xp.timeouts().find(function (timeout) { return timeout.id == interaction.user.id && timeout.type == 'flipCD'; });
                if (timeout) {
                    interaction.reply("You can't use this command for ".concat(remainingTime(timeout.endTime - Date.now())));
                }
                else {
                    if (typeof bet == 'number' && bet >= 25) {
                        if (user && user.gems >= bet && interaction.channel) {
                            xp.timeout(interaction.user.id, 'flipCD', 120000);
                            if (Math.round(Math.random())) {
                                xp.giveGems(user.id, bet * 2);
                                interaction.reply("<a:showoff:1004215186439274516> You won ".concat(bet * 2, " gems."));
                            }
                            else {
                                xp.giveGems(user.id, -bet);
                                interaction.reply("<:kek:1004270229397970974> You lost ".concat(-bet, " gems."));
                            }
                        }
                        else {
                            interaction.reply('You do not have enough gems for this bet.');
                        }
                    }
                    else {
                        interaction.reply('Minimum bet is 25 gems.');
                    }
                }
                return [3 /*break*/, 12];
            case 5:
                if (!(interaction.commandName == 'game' && checkOwner(interaction))) return [3 /*break*/, 6];
                if (((_m = interaction.options.get('type')) === null || _m === void 0 ? void 0 : _m.value) == 'scramble') {
                    game.scramble();
                    interaction.reply('Starting a new unscramble.');
                }
                else {
                    game.math();
                    interaction.reply('Starting a new math problem.');
                }
                return [3 /*break*/, 12];
            case 6:
                if (!(interaction.commandName == 'give' && checkOwner(interaction))) return [3 /*break*/, 7];
                user = (_o = interaction.options.get('user')) === null || _o === void 0 ? void 0 : _o.user;
                amount = (_p = interaction.options.get('amount')) === null || _p === void 0 ? void 0 : _p.value;
                if (user && typeof amount == 'number') {
                    if (((_q = interaction.options.get('type')) === null || _q === void 0 ? void 0 : _q.value) == 'xp') {
                        if (interaction.channel) {
                            xp.give({ author: user, channel: interaction.channel }, amount, false);
                            interaction.reply("Giving ".concat(amount, " xp to ").concat(user));
                        }
                    }
                    else if (((_r = interaction.options.get('type')) === null || _r === void 0 ? void 0 : _r.value) == 'gems') {
                        xp.giveGems(user.id, amount);
                        interaction.reply("Giving ".concat(amount, " gems to ").concat(user));
                    }
                }
                return [3 /*break*/, 12];
            case 7:
                if (!(interaction.commandName == 'gems')) return [3 /*break*/, 8];
                data = xp.get();
                user = void 0;
                if ((_s = interaction.options.get('user')) === null || _s === void 0 ? void 0 : _s.user) {
                    user = data.users.find(function (user) { var _a, _b; return user.id == ((_b = (_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id); });
                    if (user) {
                        interaction.reply("<a:showoff:1004215186439274516> They have ".concat(user.gems, " gems."));
                    }
                    else {
                        interaction.reply("<:kek:1004270229397970974> This guy is broke.");
                    }
                }
                else {
                    user = data.users.find(function (user) { return user.id == interaction.user.id; });
                    if (user) {
                        interaction.reply("<a:showoff:1004215186439274516> You have ".concat(user.gems, " gems."));
                    }
                    else {
                        interaction.reply("<:kek:1004270229397970974> You're broke.");
                    }
                }
                return [3 /*break*/, 12];
            case 8:
                if (!(interaction.commandName == 'punish' && checkOwner(interaction))) return [3 /*break*/, 9];
                require('./punisher.js').punish(interaction);
                return [3 /*break*/, 12];
            case 9:
                if (!(interaction.commandName == 'punishments' && checkOwner(interaction))) return [3 /*break*/, 10];
                require('./punisher.js').getpunishments((_t = interaction.options.get('user')) === null || _t === void 0 ? void 0 : _t.user, interaction);
                return [3 /*break*/, 12];
            case 10:
                if (!(interaction.commandName == 'rule')) return [3 /*break*/, 12];
                rule = strCheck((_u = interaction.options.get('rule')) === null || _u === void 0 ? void 0 : _u.value);
                embed = new discord_js_1.MessageEmbed()
                    .setTitle(interaction.options.getSubcommand())
                    .setDescription(rule);
                return [4 /*yield*/, interaction.reply({ embeds: [embed] })];
            case 11:
                _v.sent();
                _v.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                if (interaction.isButton()) {
                    require('./punisher').punishConfirm(interaction);
                }
                _v.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); });
client.login(config.server.token);
