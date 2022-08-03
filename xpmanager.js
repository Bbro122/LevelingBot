"use strict";
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var timeouts = [];
var fs = require('fs');
var client;
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
                    exports.timeout(msg.author.id, 'message');
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
        if (timeouts.find(function (timeout) { return timeout.id == msg.author.id && timeout.type == 'message'; }) == undefined) {
            give();
        }
    }
    else {
        give();
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
        timeout = { id: id, type: type, timeout: setTimeout(function () { return timeouts.splice(timeouts.findIndex(function (timet) { return timet.timeout == timeout; }), 1); }, time), endTime: Date.now() + time };
    }
    else {
        timeout = { id: id, type: type, timeout: setTimeout(function () { return timeouts.splice(timeouts.findIndex(function (timet) { return timet.timeout == timeout; }), 1); }, 60000), endTime: Date.now() + 60000 };
    }
    timeouts.push(timeout);
};
