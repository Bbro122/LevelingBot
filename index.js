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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var canvas_1 = require("canvas");
var fs = require('fs');
var client = new discord_js_1.Client({ partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction, discord_js_1.Partials.GuildMember, discord_js_1.Partials.User], intents: 131071 });
var xp = require('./xpmanager.js');
var game = require('./gamemanager.js');
var axios = require('axios');
var config = require("./config.json");
var medals = ['🥇', '🥈', '🥉'];
var charMap = "`~1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]};:'.>,<qwertyuiopasdfghjklzxcvbnm /?|" + '"';
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
var reply = {
    silent: function (interaction, reply) {
        interaction.reply({ content: reply, ephemeral: true });
    },
    error: function (interaction, error) {
        interaction.reply({ content: "**Error |** ".concat(error), ephemeral: true });
    },
    embed: function (interaction, embed) {
        interaction.reply({ embeds: [embed] });
    }
};
function remainingTime(milliseconds) {
    var string = '';
    if (milliseconds > 3600000) {
        string = "".concat(Math.floor(milliseconds / 3600000), " hour(s)");
        if (Math.floor((milliseconds - (Math.floor(milliseconds / 3600000) * 3600000)) / 60000) > 0) {
            string = string + " ".concat(Math.floor((milliseconds - (Math.floor(milliseconds / 3600000) * 3600000)) / 60000), " minute(s)");
        }
    }
    else if (milliseconds > 60000) {
        string = "".concat(Math.floor(milliseconds / 60000), " minute(s)");
        if (Math.floor((milliseconds - (Math.floor(milliseconds / 60000) * 60000)) / 1000) > 0) {
            string = string + " ".concat(Math.floor((milliseconds - (Math.floor(milliseconds / 60000) * 60000)) / 1000), " seconds");
        }
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
function checkOwner(interaction, reply) {
    var _a;
    var permissions = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions;
    if (permissions && typeof permissions != 'string') {
        if (permissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            return true;
        }
        else {
            if (reply) {
                interaction.reply("This command is reserved for Ministry usage only.");
            }
            return false;
        }
    }
}
function getWelcomeBanner(imagelink) {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, context, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    canvas = canvas_1["default"].createCanvas(1200, 300);
                    context = canvas.getContext('2d');
                    _b = (_a = context).drawImage;
                    return [4 /*yield*/, canvas_1["default"].loadImage(imagelink)];
                case 1:
                    _b.apply(_a, [_e.sent(), 478, 51, 203, 203]);
                    _d = (_c = context).drawImage;
                    return [4 /*yield*/, canvas_1["default"].loadImage('./welcome.png')];
                case 2:
                    _d.apply(_c, [_e.sent(), 0, 0, 1200, 300]);
                    return [2 /*return*/, canvas.toBuffer('image/png')];
            }
        });
    });
}
function getImage(exp, requirement, username, number, level, imagelink, rank, ministry, namecard) {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, context, _a, _b, _c, _d, _e, _f, _g, _h, wid;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    canvas = canvas_1["default"].createCanvas(1200, 300);
                    context = canvas.getContext('2d');
                    context.fillStyle = '#171717';
                    context.fillRect(0, 0, 1200, 300);
                    context.fillStyle = '#171717';
                    context.fillRect(325, 200, 800, 50);
                    context.fillStyle = '#00EDFF';
                    context.fillRect(325, 200, Math.round((exp - xp.level(level - 1)) / (requirement - xp.level(level - 1)) * 800), 50);
                    _b = (_a = context).drawImage;
                    return [4 /*yield*/, canvas_1["default"].loadImage(imagelink)];
                case 1:
                    _b.apply(_a, [_j.sent(), 50, 50, 200, 200]);
                    //if (ministry) { context.drawImage(await can.loadImage('./MinistrySymbol.png'), 500, 71, 26, 30); context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300) }
                    //else if (overwatch) { context.drawImage(await can.loadImage('./namecards/overwatch.png'), 0, 0, 1200, 300) }
                    //else { context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300) }
                    console.log(namecard);
                    if (!namecard) return [3 /*break*/, 3];
                    _d = (_c = context).drawImage;
                    return [4 /*yield*/, canvas_1["default"].loadImage((namecard && typeof namecard == 'string') ? namecard : './namecards/ministry.png')];
                case 2:
                    _d.apply(_c, [_j.sent(), 0, 0, 1200, 300]);
                    return [3 /*break*/, 7];
                case 3:
                    if (!ministry) return [3 /*break*/, 5];
                    _f = (_e = context).drawImage;
                    return [4 /*yield*/, canvas_1["default"].loadImage('./namecards/ministry.png')];
                case 4:
                    _f.apply(_e, [_j.sent(), 0, 0, 1200, 300]);
                    return [3 /*break*/, 7];
                case 5:
                    _h = (_g = context).drawImage;
                    return [4 /*yield*/, canvas_1["default"].loadImage('./namecards/default.png')];
                case 6:
                    _h.apply(_g, [_j.sent(), 0, 0, 1200, 300]);
                    _j.label = 7;
                case 7:
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
function checkMap(str) {
    var value = true;
    charMap.toLowerCase().split('').forEach(function (char) {
        if (char == str) {
            console.log(char);
            value = false;
        }
    });
    return value;
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('guildMemberAdd', function (member) { return __awaiter(void 0, void 0, void 0, function () {
    var guild, mainchat, url, members;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                guild = member.guild;
                mainchat = member.guild.channels.cache.get('632995958950723584');
                url = member.displayAvatarURL().replace('webp', 'png');
                if (url) {
                    getWelcomeBanner(url).then(function (buffer) {
                        if (mainchat && mainchat instanceof discord_js_1.TextChannel) {
                            var attachment = new discord_js_1.AttachmentBuilder(buffer);
                            mainchat.send({ content: "<@".concat(member.id, "> has joined the server."), files: [attachment] });
                        }
                    });
                }
                members = 0;
                return [4 /*yield*/, guild.members.fetch()];
            case 1:
                _b.sent();
                guild.members.cache.forEach(function (member) {
                    if (!member.user.bot) {
                        members++;
                    }
                });
                if (!!guild.channels.cache.find(function (chan) { return chan.name.startsWith('User-Count'); })) return [3 /*break*/, 3];
                return [4 /*yield*/, guild.channels.create({ name: "User-Count-".concat(members), type: discord_js_1.ChannelType.GuildVoice, permissionOverwrites: [{ id: guild.roles.everyone.id, deny: [discord_js_1.PermissionFlagsBits.Connect] }] })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                (_a = guild.channels.cache.find(function (chan) { return chan.name.startsWith('User-Count'); })) === null || _a === void 0 ? void 0 : _a.setName("User-Count-".concat(members));
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
client.on('userUpdate', function (oldUser, newUser) { return __awaiter(void 0, void 0, void 0, function () {
    var member;
    var _a;
    return __generator(this, function (_b) {
        member = (_a = client.guilds.cache.get(config.server.mainserver)) === null || _a === void 0 ? void 0 : _a.members.cache.get(newUser.id);
        if (member && member.manageable && !member.nickname && checkMap(member.displayName.charAt(0))) {
            //member.setNickname(`[p] ${member.displayName}`)
            //member.createDM().then(async channel => {
            //try { await channel.send('Your nickname or username change was unpingable, and a pingable nickname was automatically given in the Wolf-Co Server.') }
            //catch (err) { console.log(err) }
            //})
        }
        return [2 /*return*/];
    });
}); });
client.on('guildMemberUpdate', function (oldMember, newMember) {
    if (newMember && newMember.manageable && checkMap(newMember.displayName.charAt(0))) {
        //newMember.setNickname(`[p] ${newMember.displayName}`)
        //newMember.createDM().then(async channel => {
        //try { await channel.send('Your nickname or username change was unpingable, and a pingable nickname was automatically given in the Wolf-Co Server.') }
        //catch (err) { console.log(err) }
        //})
    }
});
client.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mainserver, gamechannel, bountychan;
    var _a;
    return __generator(this, function (_b) {
        require('./poll.js').setup(client);
        client.guilds.cache.forEach(function (guild) { return __awaiter(void 0, void 0, void 0, function () {
            var members;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, guild.members.fetch()];
                    case 1:
                        _b.sent();
                        members = 0;
                        guild.members.cache.forEach(function (member) {
                            if (!member.user.bot) {
                                members++;
                            }
                        });
                        if (!!guild.channels.cache.find(function (chan) { return chan.name.startsWith('User-Count'); })) return [3 /*break*/, 3];
                        return [4 /*yield*/, guild.channels.create({ name: "User-Count-".concat(members), type: discord_js_1.ChannelType.GuildVoice, permissionOverwrites: [{ id: guild.roles.everyone.id, deny: [discord_js_1.PermissionFlagsBits.Connect] }] })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        (_a = guild.channels.cache.find(function (chan) { return chan.name.startsWith('User-Count'); })) === null || _a === void 0 ? void 0 : _a.setName("User-Count-".concat(members));
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        mainserver = client.guilds.cache.get(config.server.mainserver);
        gamechannel = client.channels.cache.get(config.server.gamechannel);
        (_a = client.application) === null || _a === void 0 ? void 0 : _a.commands.set(require('./commands.json'));
        if (mainserver && gamechannel) {
            game.setup(client, gamechannel);
            xp.setup(client);
            mainserver.members.cache.forEach(function (user) {
                xp.ranks.evaluate(user.id);
            });
            if (config.server.game) {
                game.selGame();
            }
            if (config.server.bounties) {
                console.log("test");
                bountychan = client.channels.cache.get('1081435587422203904');
                if (bountychan) {
                    require('./bountycheck.js').sync(bountychan);
                }
                else {
                    require('./bountycheck.js').sync(gamechannel);
                }
            }
        }
        else {
            console.log("Game and Xp initialization failed.");
        }
        return [2 /*return*/];
    });
}); });
client.on('messageCreate', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, id;
    var _a, _b;
    return __generator(this, function (_c) {
        if (((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id) == config.server.mainserver && msg.channel.isTextBased()) {
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
                args = msg.content.split(' ').splice(0, 1);
                id = args[0];
                if (id !== 'null' && msg.channel instanceof discord_js_1.TextChannel) {
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
                    if (msg.channel instanceof discord_js_1.TextChannel) {
                        msg.channel.send('id is null');
                    }
                }
            }
        }
        return [2 /*return*/];
    });
}); });
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, uuidData, uuid_1, error_1, hypixelresponse, data, user, bounty, username, uuidData, uuid_2, error_2, data, user, member, data, user_1, member, data2, data, fields, i, embed, data, fields, i, embed, data, user, gems, exp, bet, data, user, timeout, data, user, data, user_2, fields_1, nameoptions_1, boostoptions_1, embed, row, collector, rule, embed, cat, error_3, url, attachment, cat, error_4, url, attachment, cat, error_5, joke, func, user, amount, data, user, row, embed, args, data, user, name_1, index, data, user, booster;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    return __generator(this, function (_0) {
        switch (_0.label) {
            case 0:
                if (!interaction.isChatInputCommand()) return [3 /*break*/, 54];
                _a = interaction.commandName;
                switch (_a) {
                    case 'addbounty': return [3 /*break*/, 1];
                    case 'removebounty': return [3 /*break*/, 16];
                    case 'boostingsince': return [3 /*break*/, 23];
                    case 'level': return [3 /*break*/, 24];
                    case 'create': return [3 /*break*/, 26];
                    case 'leaderboard': return [3 /*break*/, 27];
                    case 'daily': return [3 /*break*/, 29];
                    case 'flip': return [3 /*break*/, 30];
                    case 'gems': return [3 /*break*/, 31];
                    case 'items': return [3 /*break*/, 32];
                    case 'rule': return [3 /*break*/, 33];
                    case 'cat': return [3 /*break*/, 34];
                    case 'dog': return [3 /*break*/, 40];
                    case 'joke': return [3 /*break*/, 46];
                    case 'cah': return [3 /*break*/, 52];
                }
                return [3 /*break*/, 53];
            case 1: return [4 /*yield*/, interaction.deferReply()];
            case 2:
                _0.sent();
                username = (_b = interaction.options.get('username')) === null || _b === void 0 ? void 0 : _b.value;
                if (!(typeof username == 'string' && username.length >= 3)) return [3 /*break*/, 15];
                uuidData = void 0;
                _0.label = 3;
            case 3:
                _0.trys.push([3, 5, , 6]);
                return [4 /*yield*/, axios.get("https://api.mojang.com/users/profiles/minecraft/".concat(username))];
            case 4:
                uuidData = _0.sent();
                uuid_1 = uuidData.data.id;
                return [3 /*break*/, 6];
            case 5:
                error_1 = _0.sent();
                interaction.editReply('**Error**: Username not found or API is down.');
                return [2 /*return*/];
            case 6:
                if (!uuid_1) return [3 /*break*/, 13];
                return [4 /*yield*/, axios.get("https://api.hypixel.net/player?key=0980e33a-8052-4c48-aca7-2117c200ba09&uuid=".concat(uuid_1))
                    //await interaction.followUp(hypixelresponse.data.player.lastLogin.toString())
                ];
            case 7:
                hypixelresponse = _0.sent();
                data = require('./bountydata.json');
                if (!data.users.find(function (user) { return user.uuid == uuid_1; })) return [3 /*break*/, 11];
                user = data.users.find(function (user) { return user.uuid == uuid_1; });
                if (!(user === null || user === void 0 ? void 0 : user.trackers.includes(interaction.user.id))) return [3 /*break*/, 9];
                return [4 /*yield*/, interaction.editReply("You're already tracking this user")];
            case 8:
                _0.sent();
                return [3 /*break*/, 10];
            case 9:
                user === null || user === void 0 ? void 0 : user.trackers.push(interaction.user.id);
                fs.writeFileSync('./bountydata.json', JSON.stringify(data));
                interaction.editReply("You're now tracking ".concat(hypixelresponse.data.player.displayname, "'s bounty.\nYou'll be pinged up to 5 minutes after they log on"));
                _0.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                bounty = { trackers: [interaction.user.id], uuid: uuid_1, lastLogin: hypixelresponse.data.player.lastLogin };
                data.users.push(bounty);
                fs.writeFileSync('./bountydata.json', JSON.stringify(data));
                interaction.editReply("**Bounty Posted:** ".concat(hypixelresponse.data.player.displayname, "\nYou'll be pinged up to 5 minutes after they log on"));
                _0.label = 12;
            case 12: return [3 /*break*/, 15];
            case 13: return [4 /*yield*/, interaction.editReply("Failure\n".concat(uuid_1))];
            case 14:
                _0.sent();
                _0.label = 15;
            case 15: 
            //https://api.hypixel.net/player?key=0980e33a-8052-4c48-aca7-2117c200ba09&uuid=2cbf357d50384115a868e4dfd6c7538b
            return [3 /*break*/, 53];
            case 16: return [4 /*yield*/, interaction.deferReply()];
            case 17:
                _0.sent();
                username = (_c = interaction.options.get('username')) === null || _c === void 0 ? void 0 : _c.value;
                if (!(typeof username == 'string' && username.length >= 3)) return [3 /*break*/, 22];
                uuidData = void 0;
                _0.label = 18;
            case 18:
                _0.trys.push([18, 20, , 21]);
                return [4 /*yield*/, axios.get("https://api.mojang.com/users/profiles/minecraft/".concat(username))];
            case 19:
                uuidData = _0.sent();
                uuid_2 = uuidData.data.id;
                return [3 /*break*/, 21];
            case 20:
                error_2 = _0.sent();
                interaction.editReply('**Error**: Username not found or API is down.');
                return [2 /*return*/];
            case 21:
                if (uuid_2) {
                    data = require('./bountydata.json');
                    user = data.users.find(function (user) { return user.uuid == uuid_2; });
                    if (user && user.trackers.includes(interaction.user.id)) {
                        if ((user === null || user === void 0 ? void 0 : user.trackers.length) > 1) {
                            user.trackers.splice(user.trackers.indexOf(interaction.user.id), 1);
                            interaction.editReply("No longer tracking ".concat(username, "'s bounty."));
                        }
                        else {
                            data.users.splice(data.users.indexOf(user), 1);
                            interaction.editReply("**Bounty Removed**: ".concat(username));
                        }
                        fs.writeFileSync('./bountydata.json', JSON.stringify(data));
                    }
                    else {
                        interaction.editReply("Could not find the requested bounty, or you are not tracking that bounty.");
                    }
                }
                _0.label = 22;
            case 22: return [3 /*break*/, 53];
            case 23:
                {
                    member = (_d = interaction.options.get('user')) === null || _d === void 0 ? void 0 : _d.member;
                    if (member instanceof discord_js_1.GuildMember) {
                        interaction.reply(member.premiumSinceTimestamp ? member.premiumSinceTimestamp.toString() : '0');
                    }
                    else {
                        interaction.reply('No');
                        console.log(member);
                    }
                }
                return [3 /*break*/, 53];
            case 24: return [4 /*yield*/, interaction.deferReply()];
            case 25:
                _0.sent();
                data = xp.get();
                member = (_e = interaction.options.get('user')) === null || _e === void 0 ? void 0 : _e.member;
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
                        getImage(user_1.xp, xp.level(user_1.level), member.user.username, member.user.discriminator, user_1.level, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(function (user2) { return user2 == user_1; }) + 1, (member.roles instanceof discord_js_1.GuildMemberRoleManager) ? member.roles.cache.has('785054691008577536') : false, user_1.namecard).then(function (buffer) {
                            var attachment = new discord_js_1.AttachmentBuilder(buffer);
                            interaction.editReply({ files: [attachment] });
                        });
                    }
                    else {
                        getImage(55, xp.level(0), member.user.username, member.user.discriminator, 0, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(function (user2) { return user2 == user_1; }) + 1, (member.roles instanceof discord_js_1.GuildMemberRoleManager) ? member.roles.cache.has('785054691008577536') : false, undefined).then(function (buffer) {
                            var attachment = new discord_js_1.AttachmentBuilder(buffer);
                            interaction.editReply({ files: [attachment] });
                        });
                    }
                }
                return [3 /*break*/, 53];
            case 26:
                {
                    require('./UnoMaster.js').startNewGame(interaction);
                }
                return [3 /*break*/, 53];
            case 27: return [4 /*yield*/, ((_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.members.fetch())];
            case 28:
                _0.sent();
                if (((_g = interaction.options.get('type')) === null || _g === void 0 ? void 0 : _g.value) == 'xp') {
                    data = xp.get().users.sort(function (a, b) { return b.xp - a.xp; });
                    fields = [];
                    for (i = 0; i <= 9; i++) {
                        if ((_h = interaction.guild) === null || _h === void 0 ? void 0 : _h.members.cache.get(data[i].id)) {
                            fields.push({ "name": "".concat(medals[i] ? medals[i] : (i + 1), " | ").concat((_j = interaction.guild.members.cache.get(data[i].id)) === null || _j === void 0 ? void 0 : _j.displayName, " (").concat(data[i].level, ")"), "value": "Xp: ".concat(data[i].xp), "inline": false });
                        }
                        else {
                            fields.push({ "name": "".concat(medals[i] ? medals[i] : (i + 1), " | <@").concat(data[i].id, ">"), "value": "Xp: ".concat(data[i].xp), "inline": false });
                        }
                    }
                    embed = new discord_js_1.EmbedBuilder()
                        .setTitle('XP Leaderboard')
                        .addFields(fields);
                    interaction.reply({ embeds: [embed] });
                }
                else {
                    data = xp.get().users.sort(function (a, b) { return b.gems - a.gems; });
                    fields = [];
                    for (i = 0; i <= 9; i++) {
                        if ((_k = interaction.guild) === null || _k === void 0 ? void 0 : _k.members.cache.get(data[i].id)) {
                            fields.push({ "name": "".concat(medals[i] ? medals[i] : (i + 1), " | ").concat((_l = interaction.guild.members.cache.get(data[i].id)) === null || _l === void 0 ? void 0 : _l.displayName, " (").concat(data[i].level, ")"), "value": "Gems: ".concat(data[i].gems), "inline": false });
                        }
                        else {
                            fields.push({ "name": "".concat(medals[i] ? medals[i] : (i + 1), " | <@").concat(data[i].id, ">"), "value": "Gems: ".concat(data[i].gems), "inline": false });
                        }
                    }
                    embed = new discord_js_1.EmbedBuilder()
                        .setTitle('Gem Leaderboard')
                        .addFields(fields);
                    interaction.reply({ embeds: [embed] });
                }
                return [3 /*break*/, 53];
            case 29:
                {
                    data = xp.get();
                    if (interaction.channel) {
                        xp.give({ author: interaction.user, channel: interaction.channel }, 0);
                        user = data.users.find(function (prof) { return prof.id == interaction.user.id; });
                        if (user) {
                            if (Date.now() > user.epoch) {
                                gems = Math.round(Math.random() * 10) + 10;
                                exp = Math.round(Math.random() * 25) + 25;
                                user.epoch = Date.now() + 64800000;
                                xp.give({ author: interaction.user, channel: interaction.channel }, exp);
                                xp.giveGems(user.id, gems);
                                interaction.reply("You earned ".concat(gems, " gems, and ").concat(exp, " experience."));
                                xp.write(data);
                            }
                            else {
                                reply.silent(interaction, "you can run this command again in ".concat(remainingTime(user.epoch - Date.now())));
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
                return [3 /*break*/, 53];
            case 30:
                {
                    bet = (_m = interaction.options.get('amount')) === null || _m === void 0 ? void 0 : _m.value;
                    data = xp.get();
                    user = data.users.find(function (prof) { return prof.id == interaction.user.id; });
                    timeout = xp.timeouts().find(function (timeout) { return timeout.id == interaction.user.id && timeout.type == 'flipCD'; });
                    if (timeout) {
                        reply.error(interaction, "You can't use this command for ".concat(remainingTime(timeout.endTime - Date.now())));
                    }
                    else {
                        if (typeof bet == 'number' && bet >= 25) {
                            if (user && user.gems >= bet && interaction.channel) {
                                xp.timeout(interaction.user.id, 'flipCD', 120000);
                                if (Math.round(Math.random())) {
                                    xp.giveGems(user.id, bet);
                                    interaction.reply("<a:showoff:1004215186439274516> You won ".concat(bet, " gems!"));
                                }
                                else {
                                    xp.giveGems(user.id, -bet);
                                    interaction.reply("<:kek:1004270229397970974> You lost ".concat(-bet, " gems."));
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
                return [3 /*break*/, 53];
            case 31:
                {
                    data = xp.get();
                    user = void 0;
                    if ((_o = interaction.options.get('user')) === null || _o === void 0 ? void 0 : _o.user) {
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
                }
                return [3 /*break*/, 53];
            case 32:
                {
                    data = xp.get();
                    user_2 = data.users.find(function (user) { return user.id == interaction.user.id; });
                    if (user_2 && user_2.items.length > 0 && interaction.channel instanceof discord_js_1.TextChannel) {
                        fields_1 = [];
                        nameoptions_1 = [];
                        boostoptions_1 = [];
                        embed = new discord_js_1.EmbedBuilder()
                            .setTitle('Inventory')
                            .setDescription('View all your items here.\nUse the select menu to use an item.');
                        row = new discord_js_1.ActionRowBuilder()
                            .addComponents(new discord_js_1.ButtonBuilder()
                            .setCustomId('namecard')
                            .setStyle(discord_js_1.ButtonStyle.Primary)
                            .setLabel('Set Namecard'), new discord_js_1.ButtonBuilder()
                            .setCustomId('booster')
                            .setStyle(discord_js_1.ButtonStyle.Primary)
                            .setLabel('Use booster'));
                        user_2.items.forEach(function (item) {
                            fields_1.push(item.display);
                            if (item.type == 'booster') {
                                boostoptions_1.push({ label: item.display.name, description: item.display.value, value: user_2 === null || user_2 === void 0 ? void 0 : user_2.items.findIndex(function (sitem) { return sitem == item; }).toString() });
                            }
                            else if (item.type == 'namecard') {
                                nameoptions_1.push({ label: item.display.name, description: item.display.value, value: user_2 === null || user_2 === void 0 ? void 0 : user_2.items.findIndex(function (sitem) { return sitem == item; }).toString() });
                            }
                        });
                        //const row = new MessageActionRow()
                        //  .addComponents(
                        //    new MessageSelectMenu()
                        //      .setCustomId('use')
                        //    .addOptions(options)
                        //  .setMinValues(1)
                        //.setMaxValues(1)
                        // )
                        embed.setFields(fields_1);
                        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
                        collector = (_p = interaction.channel) === null || _p === void 0 ? void 0 : _p.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, filter: function (i) { return i.user.id == interaction.user.id; }, time: 60000, max: 1 });
                        collector === null || collector === void 0 ? void 0 : collector.on('collect', function (i) { return __awaiter(void 0, void 0, void 0, function () {
                            var embed_1, row_1, collect, embed_2, row_2;
                            var _a;
                            return __generator(this, function (_b) {
                                if (i.customId == 'namecard') {
                                    embed_1 = new discord_js_1.EmbedBuilder()
                                        .setTitle('Namecard Inventory')
                                        .setDescription('Use the selector menu below to equip a namecard.');
                                    row_1 = new discord_js_1.ActionRowBuilder()
                                        .addComponents(new discord_js_1.StringSelectMenuBuilder()
                                        .setCustomId('usenamecard')
                                        .addOptions(nameoptions_1));
                                    i.reply({ embeds: [embed_1], components: [row_1], ephemeral: true });
                                    if (i.channel instanceof discord_js_1.StageChannel) {
                                        return [2 /*return*/];
                                    }
                                    collect = (_a = i.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, filter: function (a) { return a.user.id == i.user.id; }, time: 60000, max: 1 });
                                    if (collect) {
                                        collect.on('collect', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
                                            var data, user, file;
                                            return __generator(this, function (_a) {
                                                data = xp.get();
                                                user = data.users.find(function (user) { return user.id == interaction.user.id; });
                                                if (user) {
                                                    file = user.items[typeof parseInt(interaction.values[0]) == 'number' ? parseInt(interaction.values[0]) : 0].data.file;
                                                    if (file) {
                                                        user.namecard = file;
                                                        xp.write(data);
                                                        interaction.reply({ ephemeral: true, content: 'Sucessfully set namecard' });
                                                    }
                                                    else {
                                                        reply.error(interaction, 'File not found');
                                                    }
                                                }
                                                return [2 /*return*/];
                                            });
                                        }); });
                                    }
                                    else {
                                        i.followUp('error');
                                    }
                                }
                                else if (i.customId == 'booster') {
                                    embed_2 = new discord_js_1.EmbedBuilder()
                                        .setTitle('Booster Inventory')
                                        .setDescription('Use the selector menu below to use a booster.');
                                    row_2 = new discord_js_1.ActionRowBuilder()
                                        .addComponents(new discord_js_1.StringSelectMenuBuilder()
                                        .setCustomId('use')
                                        .addOptions(boostoptions_1));
                                    i.reply({ embeds: [embed_2], components: [row_2], ephemeral: true });
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    }
                }
                return [3 /*break*/, 53];
            case 33:
                {
                    rule = strCheck((_q = interaction.options.get('rule')) === null || _q === void 0 ? void 0 : _q.value);
                    embed = new discord_js_1.EmbedBuilder()
                        .setTitle(interaction.options.getSubcommand())
                        .setDescription(rule);
                    reply.embed(interaction, embed);
                }
                return [3 /*break*/, 53];
            case 34: return [4 /*yield*/, interaction.deferReply()];
            case 35:
                _0.sent();
                cat = void 0;
                _0.label = 36;
            case 36:
                _0.trys.push([36, 38, , 39]);
                return [4 /*yield*/, axios.get('https://api.thecatapi.com/v1/images/search')];
            case 37:
                cat = _0.sent();
                return [3 /*break*/, 39];
            case 38:
                error_3 = _0.sent();
                interaction.editReply({ content: "Could not find any cats to show." });
                return [2 /*return*/];
            case 39:
                url = cat.data[0].url;
                attachment = new discord_js_1.AttachmentBuilder(url);
                interaction.editReply({ files: [attachment] });
                return [3 /*break*/, 53];
            case 40: return [4 /*yield*/, interaction.deferReply()];
            case 41:
                _0.sent();
                cat = void 0;
                _0.label = 42;
            case 42:
                _0.trys.push([42, 44, , 45]);
                return [4 /*yield*/, axios.get('https://dog.ceo/api/breeds/image/random')];
            case 43:
                cat = _0.sent();
                return [3 /*break*/, 45];
            case 44:
                error_4 = _0.sent();
                interaction.editReply({ content: "Could not find any dogs to show." });
                return [2 /*return*/];
            case 45:
                url = cat.data.message;
                attachment = new discord_js_1.AttachmentBuilder(url);
                interaction.editReply({ files: [attachment] });
                return [3 /*break*/, 53];
            case 46: return [4 /*yield*/, interaction.deferReply()];
            case 47:
                _0.sent();
                cat = void 0;
                _0.label = 48;
            case 48:
                _0.trys.push([48, 50, , 51]);
                return [4 /*yield*/, axios.get('https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky?blacklistFlags=nsfw')];
            case 49:
                cat = _0.sent();
                return [3 /*break*/, 51];
            case 50:
                error_5 = _0.sent();
                interaction.editReply({ content: "Could not find any jokes to show." });
                return [2 /*return*/];
            case 51:
                joke = void 0;
                if (cat.data.type == 'single') {
                    joke = cat.data.joke;
                }
                else {
                    joke = "".concat(cat.data.setup, "\n\n||").concat(cat.data.delivery, "||");
                }
                interaction.editReply({ content: joke });
                return [3 /*break*/, 53];
            case 52:
                {
                    require('./cardsagainsthumanity/cah.js').createGame(interaction);
                }
                return [3 /*break*/, 53];
            case 53:
                if (checkOwner(interaction)) {
                    switch (interaction.commandName) {
                        case 'createpoll':
                            {
                                require('./poll.js').createPoll(interaction);
                            }
                            break;
                        case 'rank':
                            {
                                switch (interaction.options.getSubcommand()) {
                                    case 'list':
                                        {
                                            xp.ranks.list(interaction);
                                        }
                                        break;
                                    case 'add':
                                        {
                                            xp.ranks.add(interaction);
                                        }
                                        break;
                                    case 'remove':
                                        {
                                            xp.ranks.remove(interaction);
                                        }
                                        break;
                                }
                            }
                            break;
                        case 'function':
                            {
                                func = (_r = interaction.options.get('user')) === null || _r === void 0 ? void 0 : _r.value;
                                if (typeof func == 'string') {
                                    eval(func);
                                }
                            }
                            break;
                        case 'game':
                            {
                                if (((_s = interaction.options.get('type')) === null || _s === void 0 ? void 0 : _s.value) == 'scramble') {
                                    game.scramble();
                                    interaction.reply('Starting a new unscramble.');
                                }
                                else if (((_t = interaction.options.get('type')) === null || _t === void 0 ? void 0 : _t.value) == 'math') {
                                    game.math();
                                    interaction.reply('Creating a new math problem.');
                                }
                                else if (((_u = interaction.options.get('type')) === null || _u === void 0 ? void 0 : _u.value) == 'trivia') {
                                    game.trivia();
                                    interaction.reply('Creating a new trivia problem.');
                                }
                            }
                            break;
                        case 'give':
                            {
                                user = (_v = interaction.options.get('user')) === null || _v === void 0 ? void 0 : _v.user;
                                amount = (_w = interaction.options.get('amount')) === null || _w === void 0 ? void 0 : _w.value;
                                if (user && typeof amount == 'number') {
                                    if (((_x = interaction.options.get('type')) === null || _x === void 0 ? void 0 : _x.value) == 'xp') {
                                        if (interaction.channel) {
                                            xp.give({ author: user, channel: interaction.channel }, amount, false);
                                            interaction.reply("Giving ".concat(amount, " xp to ").concat(user));
                                        }
                                    }
                                    else if (((_y = interaction.options.get('type')) === null || _y === void 0 ? void 0 : _y.value) == 'gems') {
                                        xp.giveGems(user.id, amount);
                                        interaction.reply("Giving ".concat(amount, " gems to ").concat(user));
                                    }
                                }
                            }
                            break;
                        case 'publicshop':
                            {
                                data = xp.get();
                                user = data.users.find(function (user) { return user.id == interaction.user.id; });
                                if (user) {
                                    row = new discord_js_1.ActionRowBuilder()
                                        .addComponents(new discord_js_1.StringSelectMenuBuilder()
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
                                        .setMaxValues(1));
                                    embed = new discord_js_1.EmbedBuilder()
                                        .setTitle('Shop')
                                        .setDescription('Welcome to the shop, spend your gems here.\nBoosters/Namecards can be used with /items\nAll sales are final');
                                    interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
                                }
                                else {
                                    interaction.reply("No userdata found.");
                                }
                            }
                            break;
                        case 'punish':
                            {
                                require('./punisher.js').punish(interaction);
                            }
                            break;
                        case 'punishments':
                            {
                                require('./punisher.js').getpunishments((_z = interaction.options.get('user')) === null || _z === void 0 ? void 0 : _z.user, interaction);
                            }
                            break;
                    }
                }
                return [3 /*break*/, 55];
            case 54:
                if (interaction.isStringSelectMenu()) {
                    if (interaction.customId == 'shop') {
                        args = interaction.values[0].split('_');
                        data = xp.get();
                        user = data.users.find(function (user) { return user.id == interaction.user.id; });
                        if (user) {
                            if (user.items == undefined) {
                                user.items = [];
                            }
                            if (args[0] == '0' && user.gems > parseInt(args[3])) {
                                user.items.push({ type: 'booster', display: { name: "".concat(args[1], "x Booster"), value: "Lasts ".concat(args[2], "h"), inline: false }, data: { multiplier: args[1], length: parseInt(args[2]) } });
                                user.gems = user.gems - parseInt(args[3]);
                                xp.write(data);
                                reply.silent(interaction, "Successfully bought booster. Use it by running /items in #bot-cmds.");
                            }
                            else if (args[0] == '1' && user.gems > parseInt(args[2])) {
                                name_1 = "".concat(args[1], " Namecard");
                                name_1[0].toUpperCase();
                                user.items.push({ type: 'namecard', display: { name: name_1, value: "Equip in your inventory", inline: false }, data: { file: "./namecards/".concat(args[1], ".png") } });
                                user.gems = user.gems - parseInt(args[3]);
                                xp.write(data);
                                reply.silent(interaction, "Successfully bought namecard. Equip it using /items in #bot-cmds.");
                            }
                            else {
                                reply.error(interaction, "You can't afford this item.");
                            }
                        }
                        else {
                            reply.error(interaction, "You can't afford this item.");
                        }
                    }
                    else if (interaction.customId == 'use') {
                        if (xp.getMultiplier() == 1) {
                            index = interaction.values[0];
                            data = xp.get();
                            user = data.users.find(function (user) { return user.id == interaction.user.id; });
                            if (user) {
                                booster = user.items[parseInt(index)];
                                xp.setMultiplier(booster.data.multiplier, booster.data.length * 3600000);
                                user.items.splice(parseInt(index), 1);
                                interaction.reply("@here | <@".concat(interaction.user.id, "> has activated a ").concat(booster.data.multiplier, "x XP Booster for ").concat(remainingTime(booster.data.length * 3600000)));
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
                else if (interaction.isButton()) {
                    require('./poll').vote(interaction);
                }
                _0.label = 55;
            case 55: return [2 /*return*/];
        }
    });
}); });
client.login(config.server.token);
