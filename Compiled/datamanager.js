"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let fs = require('fs');
let data = {};
data.server = function (server) {
    if (server instanceof discord_js_1.Guild) {
        this.id = server.id;
        this.userProfiles = [];
        this.userCount = server.memberCount;
        this.countChannel = undefined;
        this.gameConfig = { gameChannel: undefined, disabledGames: undefined, delay: 7200000 };
        this.unoForum = undefined;
    }
    else {
        this.id = server;
        this.userProfiles = [];
        this.userCount = 0;
        this.countChannel = undefined;
        this.gameConfig = { gameChannel: undefined, disabledGames: undefined, delay: 7200000 };
        this.unoForum = undefined;
    }
};
data.write = function (data) {
    fs.writeFileSync('./serverdata.json', data);
};
data.read = function () {
    return require('./serverdata.json');
};
data.get = function (id) {
    let sdata = data.read();
    let server = sdata.servers.find(server => server.id == id);
    if (server) {
        return server;
    }
    else {
        sdata.servers.push(new data.server(id));
        return { id: id, users: [] };
    }
};
data.getuser = function (server, uid) {
    let user = server.userProfiles.find(user => user.id == uid);
    if (user) {
        return user;
    }
    else {
        let newuser = { id: uid, xp: 0, level: 0, gems: 0, items: [], epoch: 0 };
        return newuser;
    }
};
