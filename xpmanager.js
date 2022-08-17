"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let timeouts = [];
let fs = require('fs');
let client;
let multiplier = 1;
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
                    if (msg.channel.id == require('./config.json').server.countchannel) {
                        let gamechannel = client.channels.cache.get(require('./config.json').server.gamechannel);
                        if (gamechannel instanceof discord_js_1.TextChannel) {
                            gamechannel.send(`<@${msg.author.id}> **Level Up! You\'re now level ${level}.** \n ${exports.level(level) - user.xp} xp is needed for your next level.`);
                        }
                    }
                    else {
                        msg.channel.send(`**Level Up! You\'re now level ${user.level}.** \n ${exports.level(user.level) - user.xp} xp is needed for your next level.`);
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
