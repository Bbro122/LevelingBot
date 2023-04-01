"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const dataManager = require('./datamanager');
exports.levelRequirement = function levReq(lvl) {
    return (5 * (lvl ** 2) + (50 * lvl) + 100);
};
exports.getLevel = function getLevel(xp) {
    let level = 0;
    do {
        level++;
    } while (xp >= exports.levelRequirement(level));
    return level;
};
exports.addXP = function (serverID, userID, xp, channel) {
    let data = dataManager.getXPData(serverID);
    let user = data.users.find(user => user.id == userID);
    if (user) {
        let ogXP = exports.getLevel(user.xp);
        user.xp = user.xp + xp;
        if (exports.getLevel(user.xp) > ogXP) {
            if (channel) {
                channel.send(`<@${userID}> **Level Up!** You are now ${exports.getLevel(user.xp)}`);
            }
            else {
                dataManager.getSettings(serverID);
            }
        }
    }
    else {
        let user = new types_1.User(userID, xp);
        data.users.push(user);
    }
};
