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
exports.getXP = function (serverID, userID) {
    let data = dataManager.getXPData(serverID);
    let user = data.users.find(user => user.id == userID);
    if (user) {
        return user.xp;
    }
    else {
        return 0;
    }
};
exports.addXP = function (serverID, userID, xp) {
    let data = dataManager.getXPData(serverID);
    let user = data.users.find(user => user.id == userID);
    if (user) {
        user.xp = user.xp + xp;
    }
    else {
        user = { id: userID, xp: xp };
    }
    dataManager.writeFile(`../data/serverdata/${serverID}/userData.json`, JSON.stringify(data));
    return user.xp;
};
exports.setXP = function (serverID, userID, xp) {
    let data = dataManager.getXPData(serverID);
    let user = data.users.find(user => user.id == userID);
    if (user) {
        user.xp = xp;
    }
    else {
        user = { id: userID, xp: xp };
    }
    dataManager.writeFile(`../data/serverdata/${serverID}/userData.json`, JSON.stringify(data));
    return xp;
};
exports.getUserLevel = function (serverID, userID) {
    let data = dataManager.getXPData(serverID);
    let user = data.users.find(user => user.id == userID);
    let xp = 0;
    if (user) {
        xp = user.xp;
    }
    return exports.getLevel(xp);
};
