"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.addXP = function (serverID, userID, xp) {
    let data = dataManager.getXPData(serverID);
    let user = data.users.find(user => user.id == userID);
    if (user) {
    }
};
