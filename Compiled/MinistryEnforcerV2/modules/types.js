"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSettings = exports.UserData = void 0;
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
