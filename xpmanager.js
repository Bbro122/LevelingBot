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
var timeouts = [];
var fs = require('fs');
var client;
exports.setup = function Client(client1) {
    if (client1) {
        client = client1;
    }
};
exports.give = function giveXP(msg, amount, check) {
    function give() {
        if (client instanceof discord_js_1.Client) {
            var data = exports.get();
            var user = data.users.find(function (user) { return user.id == msg.author.id; });
            if (user) {
                user.xp = user.xp + amount;
                var level = 0;
                do {
                    level++;
                } while (user.xp >= exports.level(level));
                for (var i = user.level; i < level; i++) {
                    user.gems = user.gems + Math.round(10 * Math.pow(1.05, (i + 1)));
                }
                if (user.level < level) {
                    if (msg.channel.id == require('./config.json').server.countchannel) {
                        var gamechannel = client.channels.cache.get(require('./config.json').server.gamechannel);
                        if (gamechannel instanceof discord_js_1.TextChannel) {
                            gamechannel.send("<@".concat(msg.author.id, "> **Level Up! You're now level ").concat(user.level, ".** \n ").concat(exports.level(user.level) - user.xp, " xp is needed for your next level."));
                        }
                    }
                    else {
                        msg.channel.send("**Level Up! You're now level ".concat(user.level, ".** \n ").concat(exports.level(user.level) - user.xp, " xp is needed for your next level."));
                    }
                }
                user.level = level;
                exports.write(data);
                if (check) {
                    exports.timeout(msg.author.id);
                }
            }
            else {
                user = { id: msg.author.id, xp: Math.round(Math.random() * 10) + 15, level: 0, gems: 0 };
                data.users.push(user);
                exports.write(data);
                if (check) {
                    exports.timeout(msg.author.id);
                }
            }
        }
    }
    if (check) {
        if (timeouts.find(function (timeout) { return timeout.id == msg.author.id; }) == undefined) {
            give();
        }
    }
    else {
        give();
    }
};
exports.giveGems = function gems(id, amount) {
    var data = exports.get();
    var user = data.users.find(function (user) { return user.id = id; });
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
exports.timeout = function createTimeout(id, time) {
    var timeout;
    if (time) {
        timeout = { id: id, timeout: setTimeout(function () { return timeouts.splice(timeouts.findIndex(function (timet) { return timet.timeout == timeout; }), 1); }, time) };
    }
    else {
        timeout = { id: id, timeout: setTimeout(function () { return timeouts.splice(timeouts.findIndex(function (timet) { return timet.timeout == timeout; }), 1); }, 60000) };
    }
    timeouts.push(timeout);
};
exports.giveall = function giveAll(interaction) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var guild, channel, amount, data;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    guild = interaction.guild;
                    return [4 /*yield*/, (guild === null || guild === void 0 ? void 0 : guild.members.fetch())];
                case 1:
                    _c.sent();
                    channel = interaction.channel;
                    amount = (_b = (_a = interaction.options) === null || _a === void 0 ? void 0 : _a.get('amount')) === null || _b === void 0 ? void 0 : _b.value;
                    data = exports.get();
                    guild === null || guild === void 0 ? void 0 : guild.members.cache.forEach(function (member) {
                        var user = data.users.find(function (user) { return user.id == member.id; });
                        if (user) {
                            user.xp = user.xp + amount;
                        }
                        else {
                            user = { id: member.id, xp: amount, level: 0 };
                            if (user.xp >= exports.level(user.level)) {
                                user.level++;
                            }
                        }
                    });
                    exports.write(data);
                    return [2 /*return*/];
            }
        });
    });
};
