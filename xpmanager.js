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
var timeouts = [];
var fs = require('fs');
var client;
var multiplier = 1;
exports.ranks = {};
function getRanks() {
    return require('./levelData/ranks.json');
}
function rankOf(level) {
    var ranks = getRanks();
    var crank = { level: 0, id: undefined };
    for (var i = 0; i < ranks.rankups.length; i++) {
        var rank = ranks.rankups[i];
        if (rank.level <= level && rank.level > crank.level) {
            crank = rank;
        }
    }
    return crank;
}
exports.ranks.remove = function (interaction) {
    var _a;
    var ranks = getRanks();
    var role = (_a = interaction.options.get('role')) === null || _a === void 0 ? void 0 : _a.role;
    var rank = ranks.persistent.find(function (rank) { return rank.id == (role === null || role === void 0 ? void 0 : role.id); });
    if (rank && rank.persistent) {
        ranks.persistent.splice(ranks.persistent.indexOf(rank), 1);
    }
    else {
        rank = ranks.rankups.find(function (rank) { return rank.id == (role === null || role === void 0 ? void 0 : role.id); });
        if (rank) {
            ranks.rankups.splice(ranks.rankups.indexOf(rank), 1);
        }
        else {
            interaction.reply('Existential Dread: operation failed');
            return;
        }
    }
    fs.writeFileSync('./levelData/ranks.json', JSON.stringify(ranks));
    interaction.reply('That role will no longer automatically be applied.');
};
exports.ranks.add = function (interaction) {
    var _a, _b, _c, _d;
    var ranks = getRanks();
    var role = { persistent: (_a = interaction.options.get('persist')) === null || _a === void 0 ? void 0 : _a.value, level: (_b = interaction.options.get('level')) === null || _b === void 0 ? void 0 : _b.value, id: (_d = (_c = interaction.options.get('role')) === null || _c === void 0 ? void 0 : _c.role) === null || _d === void 0 ? void 0 : _d.id };
    if (!(ranks.persistent.find(function (rank) { return rank.id == role.id; }) || ranks.rankups.find(function (rank) { return rank.id == role.id; })) && typeof role.persistent == 'boolean' && typeof role.level == 'number' && typeof role.id == 'string') {
        if (role.persistent) {
            ranks.persistent.push(role);
        }
        else {
            ranks.rankups.push(role);
        }
        fs.writeFileSync('./levelData/ranks.json', JSON.stringify(ranks));
        interaction.reply('That role will now automatically be applied.');
    }
    else {
        interaction.reply('That role is already used in the ranking system.');
    }
};
exports.ranks.list = function (interaction) {
    var ranks = getRanks();
    var guild = client.guilds.cache.get('632995494305464331');
    if (guild instanceof discord_js_1.Guild) {
        var fields_1 = [];
        ranks.persistent.forEach(function (rank) {
            var _a;
            var role = (_a = guild.roles.cache.get(rank.id)) === null || _a === void 0 ? void 0 : _a.name;
            role = role ? role : rank.id;
            fields_1.push({
                value: rank.level.toString(), name: role,
                inline: true
            });
        });
        var persistEmbed = new discord_js_1.EmbedBuilder()
            .setColor('Aqua')
            .setTitle('Persistent Ranks')
            .setDescription('Heres a list of the persistent ranks')
            .addFields(fields_1);
        fields_1 = [];
        ranks.rankups.sort(function (a, b) { return a.level - b.level; });
        ranks.rankups.forEach(function (rank) {
            var _a;
            var role = (_a = guild.roles.cache.get(rank.id)) === null || _a === void 0 ? void 0 : _a.name;
            role = role ? role : rank.id;
            fields_1.push({
                value: rank.level.toString(), name: role,
                inline: true
            });
        });
        var rankupEmbed = new discord_js_1.EmbedBuilder()
            .setColor('Orange')
            .setTitle('Heirarchy Ranks')
            .setDescription('Heres a list of the heirarchy ranks')
            .addFields(fields_1);
        interaction.reply({ embeds: [persistEmbed, rankupEmbed] });
    }
};
exports.ranks.evaluate = function (userID) {
    return __awaiter(this, void 0, void 0, function () {
        var ranks, guild, data, userData, user, actualRank_1, roles, _loop_1, i, actualRole;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ranks = getRanks();
                    guild = client.guilds.cache.get('632995494305464331');
                    data = exports.get();
                    userData = data.users.find(function (user) { return user.id == userID; });
                    if (!(guild && userData)) return [3 /*break*/, 2];
                    return [4 /*yield*/, guild.members.fetch()];
                case 1:
                    _a.sent();
                    user = guild.members.cache.get(userID);
                    if (user) {
                        actualRank_1 = rankOf(userData === null || userData === void 0 ? void 0 : userData.level);
                        roles = user.roles.cache;
                        _loop_1 = function (i) {
                            var element = roles.at(i);
                            if (element) {
                                var rank = ranks.persistent.find(function (rank) { return rank.id == (element === null || element === void 0 ? void 0 : element.id); });
                                if (rank && element) {
                                    ranks.persistent.splice(i, 1);
                                    if (userData.level < (typeof rank.level == 'number' ? rank.level : 0)) {
                                        try {
                                            user.roles.remove(element);
                                        }
                                        catch (err) {
                                            console.log(err);
                                        }
                                    }
                                }
                                rank = ranks.rankups.find(function (rank) { return rank.id == (element === null || element === void 0 ? void 0 : element.id); });
                                if (rank && element) {
                                    ranks.rankups.splice(i, 1);
                                    if (element.id != actualRank_1.id) {
                                        try {
                                            user.roles.remove(element);
                                        }
                                        catch (err) {
                                            console.log(err);
                                        }
                                    }
                                }
                            }
                        };
                        for (i = 0; i < roles.size; i++) {
                            _loop_1(i);
                        }
                        if (typeof actualRank_1.id == 'string' && !roles.find(function (role) { return role.id == actualRank_1.id; })) {
                            actualRole = guild.roles.cache.get(actualRank_1.id);
                            if (actualRole) {
                                try {
                                    user.roles.add(actualRole);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
};
exports.timeouts = function getTimeouts() {
    return timeouts;
};
exports.setup = function Client(client1) {
    if (client1) {
        client = client1;
    }
};
exports.give = function giveXP(msg, amount, check) {
    function give() {
        var _a;
        if (client instanceof discord_js_1.Client) {
            if ((_a = msg.channel.guild.members.cache.get(msg.author.id)) === null || _a === void 0 ? void 0 : _a.roles.cache.has('1059615940129595416')) {
                amount = amount * 2;
            }
            var data = exports.get();
            var user = data.users.find(function (user) { return user.id == msg.author.id; });
            if (user) {
                user.xp = user.xp + (amount * multiplier);
                var level = 0;
                do {
                    level++;
                } while (user.xp >= exports.level(level));
                for (var i = user.level; i < level; i++) {
                    user.gems = user.gems + Math.round(10 * Math.pow(1.05, (i + 1)));
                }
                if (user.level < level) {
                    exports.ranks.evaluate(user.id);
                    if (msg.channel.id == require('./config.json').server.countchannel) {
                        var gamechannel = client.channels.cache.get(require('./config.json').server.gamechannel);
                        if (gamechannel instanceof discord_js_1.TextChannel) {
                            gamechannel.send("<@".concat(msg.author.id, "> **Level Up! You're now level ").concat(level, ".** \n ").concat(exports.level(level) - user.xp, " xp is needed for your next level."));
                        }
                    }
                    else {
                        msg.channel.send("**Level Up! You're now level ".concat(user.level + 1, ".** \n ").concat(exports.level(user.level + 1) - user.xp, " xp is needed for your next level."));
                    }
                }
                user.level = level;
                exports.write(data);
                if (check) {
                    exports.timeout(msg.author.id, 'message');
                }
            }
            else {
                user = { id: msg.author.id, xp: Math.round(Math.random() * 10) + 15, level: 0, gems: 0, items: [], epoch: 0 };
                data.users.push(user);
                exports.write(data);
                if (check) {
                    exports.timeout(msg.author.id);
                }
            }
        }
    }
    if (check) {
        if (timeouts.find(function (timeout) { return timeout.id == msg.author.id && timeout.type == 'message'; }) == undefined) {
            give();
        }
    }
    else {
        give();
    }
};
exports.getMultiplier = function () {
    return multiplier;
};
exports.setMultiplier = function (num, time) {
    multiplier = num;
    if (time) {
        var timeout_1 = { id: 'multiplier', type: 'multiplier', timeout: setTimeout(function () { timeouts.splice(timeouts.findIndex(function (timet) { return timet == timeout_1; }), 1); multiplier = 1; }, time), endTime: Date.now() + time };
        timeouts.push();
    }
};
exports.giveGems = function gems(id, amount) {
    var data = exports.get();
    var user = data.users.find(function (user) { return user.id == id; });
    if (user) {
        user.gems = user.gems + amount;
        exports.write(data);
    }
};
exports.write = function write(file) {
    if (file.name == 'users') {
        fs.writeFileSync('./userdata.json', JSON.stringify(file));
    }
};
exports.get = function read() {
    return require("./userdata.json");
};
exports.level = function level(lvl) {
    return (5 * (Math.pow(lvl, 2)) + (50 * lvl) + 100);
};
exports.timeout = function createTimeout(id, type, time) {
    var timeout;
    if (time) {
        timeout = { id: id, type: type, timeout: setTimeout(function () { return timeouts.splice(timeouts.findIndex(function (timet) { return timet == timeout; }), 1); }, time), endTime: Date.now() + time };
    }
    else {
        timeout = { id: id, type: type, timeout: setTimeout(function () { return timeouts.splice(timeouts.findIndex(function (timet) { return timet == timeout; }), 1); }, 60000), endTime: Date.now() + 60000 };
    }
    timeouts.push(timeout);
};
