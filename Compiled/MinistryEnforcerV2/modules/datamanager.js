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
const fs = require('fs');
//Defaults
const xpDefault = {};
const guildSettingsDefault = { counting: false, games: false, bounties: false, levels: true, gameChannel: undefined, countChannel: undefined, bountyChannel: undefined };
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
            if (!fs.existsSync(`../data/serverdata/${guild.id}`)) {
                fs.mkdirSync(`../data/serverdata/${guild.id}`);
                fs.writeFileSync(`../data/serverdata/${guild.id}/userData.json`, xpDefault);
                fs.writeFileSync(`../data/serverdata/${guild.id}/guildSettings.json`, guildSettingsDefault);
            }
        });
    });
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
//
