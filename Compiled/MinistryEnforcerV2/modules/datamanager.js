"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const types_1 = require("./types");
//Defaults
const guildSettingsDefaultValues = {
    counting: false,
    games: false,
    bounties: false,
    levels: true,
    gameChannel: undefined,
    countChannel: undefined,
    bountyChannel: undefined
};
// Data Formatting
const guildSettingsDefault = JSON.stringify(guildSettingsDefaultValues);
// Functions
exports.writeFile = function writeFile(file, data) {
    fs.writeFileSync(file, data);
};
exports.readFile = function readFile(file) {
    return require(file);
};
exports.onStart = function (client) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.guilds.fetch();
        client.guilds.cache.forEach(guild => {
            console.log(fs.existsSync('./modules'));
            if (!fs.existsSync(`./data/serverdata/${guild.id}`)) {
                exports.registerServer(guild.id);
            }
            guild.commands.set(require('../commands.json'));
        });
    });
};
exports.write = function (data) {
    switch (true) {
        case data.fileCode.startsWith("userData"):
            {
                const serverID = data.fileCode.slice(8, data.fileCode.length - 1);
                fs.writeFileSync(`../data/serverdata/${serverID}/userdata.json`, JSON.stringify(data));
            }
            break;
        default:
            break;
    }
};
// XP Data Collection
exports.getXPData = function (serverId) {
    let path = `../data/serverdata/${serverId}/userData.json`;
    if (fs.existsSync(path)) {
        return require(`../data/serverdata/${serverId}/userData.json`);
    }
    else {
        return false;
    }
};
exports.getGlobalXPData = function () {
    let path = `../data/userData.json`;
    if (fs.existsSync(path)) {
        return require(`../data/userData.json`);
    }
    else {
        return false;
    }
};
// Guild Settings Collection
exports.getSettings = function (serverId) {
    let path = `../data/serverdata/${serverId}/guildSettings.json`;
    if (fs.existsSync(path)) {
        return require(`../data/serverdata/${serverId}/guildSettings.json`);
    }
    else {
        return false;
    }
};
exports.getSetting = function (serverID, setting) {
    let settings = exports.getSettings(serverID);
    if (settings) {
        return eval(`settings.${setting}`);
    }
    else {
        return false;
    }
};
exports.listServers = function () {
    console.log(fs.readdirSync('../data/serverdata'));
};
exports.registerServer = function (guildID) {
    if (!fs.existsSync(`../data/serverdata/${guildID}`)) {
        fs.mkdirSync(`../data/serverdata/${guildID}`);
        fs.writeFileSync(`../data/serverdata/${guildID}/userData.json`, JSON.stringify(new types_1.UserData(guildID)));
        fs.writeFileSync(`../data/serverdata/${guildID}/guildSettings.json`, JSON.stringify(new types_1.GuildSettings(guildID)));
    }
};
