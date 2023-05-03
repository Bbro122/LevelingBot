"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerXPManager = void 0;
const datamanager_1 = __importDefault(require("./datamanager"));
let activeMultipliers = [];
const _ = {
    setup() {
        let servers = datamanager_1.default.listServers();
        servers.forEach(server => {
            let data = datamanager_1.default.getServer(server).getXPData();
            data.multipliers.forEach(multiplier => {
                if (multiplier.endTime) {
                    if ((multiplier.endTime - Date.now()) > 0)
                        activeMultipliers.push({ timeout: setTimeout(() => { exports.removeMultiplier(multiplier.startTime); }, multiplier.endTime - Date.now()) });
                    else {
                        exports.removeMultiplier();
                    }
                }
            });
        });
    },
    // Get Information
    getLevel(xp) {
        let level = 0;
        do {
            level++;
        } while (xp >= _.levelRequirement(level));
        return level;
    },
    getGlobalLevel(userID) {
        let data = datamanager_1.default.getGlobalXPData();
        let user = data.users.find(user => user.id == userID);
        let xp = 0;
        if (user) {
            xp = user.xp;
        }
        return _.getLevel(xp);
    },
    getGlobalRank(xp) {
        let data = datamanager_1.default.getGlobalXPData();
        let users = data.users;
        let fakeUser = { xp: xp + 1, id: '000' };
        users.push(fakeUser);
        users.sort((a, b) => b.xp - a.xp);
        return users.indexOf(fakeUser) + 1;
    },
    levelRequirement(lvl) {
        return (5 * (lvl ** 2) + (50 * lvl) + 100);
    },
    // Modify Information
    addGlobalXP(userID, xp) {
        let data = datamanager_1.default.getGlobalXPData();
        let user = data.users.find(user => user.id == userID);
        if (user) {
            user.xp = user.xp + xp;
        }
        else {
            user = { id: userID, xp: xp };
        }
        datamanager_1.default.writeFile('../data/userData.json', JSON.stringify(data));
        return user.xp;
    },
    setGlobalXP(userID, xp) {
        let data = datamanager_1.default.getGlobalXPData();
        let user = data.users.find(user => user.id == userID);
        if (user) {
            user.xp = xp;
        }
        else {
            user = { id: userID, xp: xp };
        }
        datamanager_1.default.writeFile('../data/userData.json', JSON.stringify(data));
        return xp;
    },
    getXPManager(guildID) {
        return new ServerXPManager(guildID);
    }
};
class ServerXPManager {
    //removeMultiplier: () => void // To be worked on 
    constructor(guildID) {
        this.addMultiplier = function (multiplier, time) {
            if (time && time > 0) {
                let data = datamanager_1.default.getServer(guildID).getXPData();
                data.multipliers.push({ startTime: Date.now(), endTime: Date.now() + time, multiplier: multiplier });
            }
        };
        this.getXP = function (userID) {
            let data = datamanager_1.default.getServer(guildID).getXPData();
            let user = data.users.find(user => user.id == userID);
            if (user) {
                return user.xp;
            }
            else {
                return 0;
            }
        };
        this.addXP = function (userID, xp, global) {
            let serverManager = datamanager_1.default.getServer(guildID);
            let data = serverManager.getXPData();
            let user = data.users.find(user => user.id == userID);
            if (user) {
                user.xp = user.xp + xp;
            }
            else {
                user = { id: userID, xp: xp };
                data.users.push(user);
            }
            datamanager_1.default.write(data);
            if (global) {
                data = datamanager_1.default.getGlobalXPData();
                user = data.users.find(user => user.id == userID);
                if (user) {
                    user.xp = user.xp + xp;
                }
                else {
                    user = { id: userID, xp: xp };
                    data.users.push(user);
                }
                datamanager_1.default.write(data);
            }
            return user.xp;
        };
        this.setXP = function (userID, xp) {
            let serverManager = datamanager_1.default.getServer(guildID);
            let data = serverManager.getXPData();
            let user = data.users.find(user => user.id == userID);
            if (user) {
                user.xp = xp;
            }
            else {
                user = { id: userID, xp: xp };
                data.users.push(user);
            }
            datamanager_1.default.write(data);
            return xp;
        };
        this.getUserLevel = function (serverID, userID) {
            let serverManager = datamanager_1.default.getServer(serverID);
            let data = serverManager.getXPData();
            let user = data.users.find(user => user.id == userID);
            let xp = 0;
            if (user) {
                xp = user.xp;
            }
            return _.getLevel(xp);
        };
        this.getRank = function (xp) {
            let data;
            data = datamanager_1.default.getServer(guildID).getXPData();
            let users = data.users;
            let fakeUser = { xp: xp + 1, id: '000' };
            users.push(fakeUser);
            users.sort((a, b) => b.xp - a.xp);
            return users.indexOf(fakeUser) + 1;
        };
    }
}
exports.ServerXPManager = ServerXPManager;
exports.default = _;
