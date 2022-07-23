"use strict";
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
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
//______________________________/
var fs = require('fs');
var can = require('canvas');
var _a = require('discord.js'), Client = _a.Client, Intents = _a.Intents, Message = _a.Message;
var _b = require('discord.js'), MessageActionRow = _b.MessageActionRow, MessageButton = _b.MessageButton, MessageEmbed = _b.MessageEmbed, MessageAttachment = _b.MessageAttachment, WebhookClient = _b.WebhookClient;
var client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'], intents: [new Intents(32767)], fetchAllMembers: true });
var miniTimer = {};
var currentWord = [];
var xp = require('./xpmanager.js');
var game = require('./gamemanager.js');
var assert = require('console').assert;
var unoids = ["join", "start", "cancel"];
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
function checkOwner(interaction) {
    if (interaction.user.id == '316243027423395841') {
        return true;
    }
    else {
        interaction.reply("Unpermitted Access- This command is only usable by the regretful one.");
        return false;
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
            client.guilds.cache.get('632995494305464331').commands.set(require('./commands.json'));
        }
        catch (err) {
            console.log(err);
        }
        game.selGame(client.channels.cache.get('740652127164301454'), client);
        return [2 /*return*/];
    });
}); });
client.on('messageCreate', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (msg.guild.id == '632995494305464331') {
            if (msg.author.bot == false) {
                if (msg.content.length > 5) {
                    xp.give(msg, 15 + Math.floor(Math.random() * 10), true, client);
                }
                if (msg.channel.id == '740652127164301454') {
                    game.checkWord(msg);
                }
                else if (msg.channel.id == '840394626220687360') {
                    require('./counting.js')(client, msg);
                }
            }
        }
        return [2 /*return*/];
    });
}); });
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var data, user_1, member, data2, data, fields, i, embed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(interaction.commandName);
                if (!(interaction.commandName == 'level')) return [3 /*break*/, 2];
                return [4 /*yield*/, interaction.deferReply()];
            case 1:
                _a.sent();
                data = xp.get();
                member = void 0;
                if (interaction.options.get('user')) {
                    member = interaction.options.get('user').member;
                    user_1 = data.users.find(function (user) { return user.id == interaction.options.get('user').value; });
                }
                else {
                    member = interaction.member;
                    user_1 = data.users.find(function (user) { return user.id == interaction.user.id; });
                }
                data2 = xp.get().users.sort(function (a, b) { return b.xp - a.xp; });
                data2.findIndex(function (user2) { return user2 == user_1; });
                if (user_1) {
                    getImage(user_1.xp, xp.level(user_1.level), member.user.username, member.user.discriminator, user_1.level, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(function (user2) { return user2 == user_1; }) + 1).then(function (buffer) {
                        var attachment = new MessageAttachment(buffer, "LevelCard.png");
                        interaction.editReply({ files: [attachment] });
                    });
                }
                else {
                    getImage(0, xp.level(0), member.user.username, member.user.discriminator, 0, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(function (user2) { return user2 == user_1; }) + 1).then(function (buffer) {
                        var attachment = new MessageAttachment(buffer, "LevelCard.png");
                        interaction.editReply({ files: [attachment] });
                    });
                }
                return [3 /*break*/, 5];
            case 2:
                if (!(interaction.commandName == 'leaderboard')) return [3 /*break*/, 4];
                return [4 /*yield*/, interaction.guild.members.fetch()];
            case 3:
                _a.sent();
                data = xp.get().users.sort(function (a, b) { return b.xp - a.xp; });
                fields = [];
                if (client.users.cache.get(data[0].id)) {
                    fields.push({ "name": "\uD83E\uDD47 ".concat(interaction.guild.members.cache.get(data[0].id).dislayName, " (").concat(data[0].level, ")"), "value": "Xp: ".concat(data[0].xp), "inline": false });
                }
                else {
                    fields.push({ "name": "\uD83E\uDD47 [Unknown Error- ".concat(data[0].id, "]"), "value": "Xp: ".concat(data[0].xp), "inline": false });
                }
                if (client.users.cache.get(data[1].id)) {
                    fields.push({ "name": "\uD83E\uDD48 ".concat(interaction.guild.members.cache.get(data[1].id).dislayName, " (").concat(data[1].level, ")"), "value": "Xp: ".concat(data[1].xp), "inline": false });
                }
                else {
                    fields.push({ "name": "\uD83E\uDD48 [Unknown Error- ".concat(data[1].id, "]"), "value": "Xp: ".concat(data[1].xp), "inline": false });
                }
                if (client.users.cache.get(data[1].id)) {
                    fields.push({ "name": "\uD83E\uDD49 ".concat(interaction.guild.members.cache.get(data[2].id).dislayName, " (").concat(data[2].level, ")"), "value": "Xp: ".concat(data[2].xp), "inline": false });
                }
                else {
                    fields.push({ "name": "\uD83E\uDD49 [Unknown Error- ".concat(data[2].id, "]"), "value": "Xp: ".concat(data[2].xp), "inline": false });
                }
                for (i = 3; i <= 9; i++) {
                    if (interaction.guild.members.cache.get(data[i].id)) {
                        fields.push({ "name": "".concat(i + 1, ". ").concat(interaction.guild.members.cache.get(data[i].id).dislayName, " (").concat(data[i].level, ")"), "value": "Xp: ".concat(data[i].xp), "inline": false });
                    }
                    else {
                        fields.push({ "name": "".concat(i + 1, ". [Unknown Error- ").concat(data[i].id, "]"), "value": "Xp: ".concat(data[i].xp), "inline": false });
                    }
                }
                assert();
                embed = { title: "Leaderboard", description: "", fields: fields };
                interaction.reply({ embeds: [embed] });
                return [3 /*break*/, 5];
            case 4:
                if (interaction.commandName == 'scramble' && checkOwner(interaction)) {
                    game.scramble();
                }
                else if (interaction.commandName == 'crash' && checkOwner(interaction)) {
                    require('./crash.js')();
                }
                else if (interaction.commandName == 'givexp' && checkOwner(interaction)) {
                    interaction.deferReply();
                    xp.giveall(interaction);
                    interaction.editReply('All users have received 1 xp.');
                }
                else if (interaction.commandName == 'test' && checkOwner(interaction)) {
                    require('./UnoMaster.js').startNewGame(interaction);
                }
                else if (unoids.includes(interaction.customId)) {
                    require('./UnoMaster.js').command(interaction);
                }
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
client.login(require("./config.json").token2);
