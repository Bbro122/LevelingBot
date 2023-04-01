"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSettings = exports.User = void 0;
//             //
// Level Types //
//             //
class User {
    constructor(userID, userXP, items) {
        this.id = userID;
        this.xp = userXP ? userXP : 0;
        this.items = items ? items : [];
    }
}
exports.User = User;
//                                   //
// Guild Settings / Management Types //
//                                   //
class GuildSettings {
    constructor(counting, games, uno, cah) {
        this.counting = counting ? counting : false;
        this.games = games ? games : false;
        this.uno = uno ? uno : false;
        this.cah = cah ? cah : false;
    }
}
exports.GuildSettings = GuildSettings;
