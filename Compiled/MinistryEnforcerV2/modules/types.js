"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPUser = exports.GuildSettings = exports.UserData = void 0;
class UserData {
    constructor(serverID) {
        this.fileCode = "userData" + (serverID ? serverID : 'global');
        this.users = [];
        this.multipliers = [];
    }
}
exports.UserData = UserData;
class GuildSettings {
    constructor(serverID) {
        this.games = {
            delay: 2,
            enabled: false,
            disabledGames: [],
            triviaForceDifficulty: -1,
            mathForceDifficulty: -1,
            channel: undefined
        };
        this.fileCode = 'guildSettings' + serverID;
    }
}
exports.GuildSettings = GuildSettings;
class XPUser {
    constructor(id, xp) {
        this.epoch = 0;
        this.xp = xp ? xp : 0;
        this.id = id;
        this.balance = { wallet: 0, bank: 0 };
    }
}
exports.XPUser = XPUser;
