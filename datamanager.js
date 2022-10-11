"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require('fs');
let data = {};
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
        sdata.servers.push({ id: id, users: [] });
        return { id: id, users: [] };
    }
};
data.getuser = function (server, uid) {
    let user = server.users.find(user => user.id == uid);
    if (user) {
        return user;
    }
    else {
        let newuser = { id: uid, xp: 0, level: 0, gems: 0, items: [], epoch: 0 };
        return newuser;
    }
};
