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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let timeouts = [];
let fs = require('fs');
let client;
let multiplier = 1;
exports.ranks = {};
function getRanks() {
    return require('./levelData/ranks.json');
}
function rankOf(level) {
    let ranks = getRanks();
    let crank = { level: 0, id: undefined };
    for (let i = 0; i < ranks.rankups.length; i++) {
        const rank = ranks.rankups[i];
        if (rank.level <= level && rank.level > crank.level) {
            crank = rank;
        }
    }
    return crank;
}
exports.ranks.remove = function (interaction) {
    var _a;
    let ranks = getRanks();
    let level = (_a = interaction.options.get('level')) === null || _a === void 0 ? void 0 : _a.value;
    let rank = ranks.persistent.find((rank) => rank.level == level);
    if (rank && rank.persistent) {
        ranks.persistent.splice(ranks.persistent.indexOf(rank), 1);
    }
    else {
        rank = ranks.rankups.find((rank) => rank.level == level);
        if (rank) {
            ranks.rankups.splice(ranks.rankups.indexOf(rank), 1);
        }
        else {
            interaction.reply('Existential Dread: operation failed');
        }
    }
    interaction.reply('That role will no longer automatically be applied.');
};
exports.ranks.add = function (interaction) {
    var _a, _b, _c;
    let ranks = getRanks();
    let role = { persistent: (_a = interaction.options.get('level')) === null || _a === void 0 ? void 0 : _a.value, level: (_b = interaction.options.get('level')) === null || _b === void 0 ? void 0 : _b.value, id: (_c = interaction.options.get('id')) === null || _c === void 0 ? void 0 : _c.value };
    if (typeof role.persistent == 'boolean' && typeof role.level == 'number' && typeof role.id == 'string') {
        ranks.persistent.push(role);
    }
};
exports.ranks.evaluate = function (userID) {
    return __awaiter(this, void 0, void 0, function* () {
        let ranks = getRanks();
        let guild = client.guilds.cache.get('632995494305464331');
        let data = exports.get();
        let userData = data.users.find(user => user.id == userID);
        if (guild && userData) {
            yield guild.members.fetch();
            let user = guild.members.cache.get(userID);
            if (user) {
                let actualRank = rankOf(userData === null || userData === void 0 ? void 0 : userData.level);
                let roles = user.roles.cache;
                for (let i = 0; i < roles.size; i++) {
                    const element = roles.at(i);
                    if (element) {
                        let rank = ranks.persistent.find(rank => rank.id == (element === null || element === void 0 ? void 0 : element.id));
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
                        rank = ranks.rankups.find(rank => rank.id == (element === null || element === void 0 ? void 0 : element.id));
                        if (rank && element) {
                            ranks.rankups.splice(i, 1);
                            if (element.id != actualRank.id) {
                                try {
                                    user.roles.remove(element);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                    }
                }
                if (typeof actualRank.id == 'string' && !roles.find(role => role.id == actualRank.id)) {
                    let actualRole = guild.roles.cache.get(actualRank.id);
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
        }
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
        if (client instanceof discord_js_1.Client) {
            let data = exports.get();
            let user = data.users.find(user => user.id == msg.author.id);
            if (user) {
                user.xp = user.xp + (amount * multiplier);
                let level = 0;
                do {
                    level++;
                } while (user.xp >= exports.level(level));
                for (let i = user.level; i < level; i++) {
                    user.gems = user.gems + Math.round(10 * 1.05 ** (i + 1));
                }
                if (user.level < level) {
                    exports.ranks.evaluate(user.id);
                    if (msg.channel.id == require('./config.json').server.countchannel) {
                        let gamechannel = client.channels.cache.get(require('./config.json').server.gamechannel);
                        if (gamechannel instanceof discord_js_1.TextChannel) {
                            gamechannel.send(`<@${msg.author.id}> **Level Up! You\'re now level ${level}.** \n ${exports.level(level) - user.xp} xp is needed for your next level.`);
                        }
                    }
                    else {
                        msg.channel.send(`**Level Up! You\'re now level ${user.level + 1}.** \n ${exports.level(user.level + 1) - user.xp} xp is needed for your next level.`);
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
        if (timeouts.find(timeout => timeout.id == msg.author.id && timeout.type == 'message') == undefined) {
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
        let timeout = { id: 'multiplier', type: 'multiplier', timeout: setTimeout(() => { timeouts.splice(timeouts.findIndex(timet => timet == timeout), 1); multiplier = 1; }, time), endTime: Date.now() + time };
        timeouts.push();
    }
};
exports.giveGems = function gems(id, amount) {
    let data = exports.get();
    let user = data.users.find(user => user.id == id);
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
    return (5 * (lvl ** 2) + (50 * lvl) + 100);
};
exports.timeout = function createTimeout(id, type, time) {
    let timeout;
    if (time) {
        timeout = { id: id, type: type, timeout: setTimeout(() => timeouts.splice(timeouts.findIndex(timet => timet == timeout), 1), time), endTime: Date.now() + time };
    }
    else {
        timeout = { id: id, type: type, timeout: setTimeout(() => timeouts.splice(timeouts.findIndex(timet => timet == timeout), 1), 60000), endTime: Date.now() + 60000 };
    }
    timeouts.push(timeout);
};
