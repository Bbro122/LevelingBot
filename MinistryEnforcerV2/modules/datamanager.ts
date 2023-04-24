import { Client } from "discord.js"
import fs = require('fs')
import { GuildSettings, UserData } from "./types"
//Defaults
const guildSettingsDefaultValues =
{
    counting: false,
    games: false,
    bounties: false,
    levels: true,
    gameChannel: undefined,
    countChannel: undefined,
    bountyChannel: undefined
}
// Data Formatting
const guildSettingsDefault = JSON.stringify(guildSettingsDefaultValues)
// Functions
exports.writeFile = function writeFile(file: string, data: string) {
    fs.writeFileSync(file, data)
}
exports.readFile = function readFile(file: string) {
    return require(file)
}
exports.onStart = async function (client: Client) {
    await client.guilds.fetch()
    client.guilds.cache.forEach(guild => {
        console.log(fs.existsSync('./modules'))
        if (!fs.existsSync(`./data/serverdata/${guild.id}`)) {
            exports.registerServer(guild.id)
        }
        guild.commands.set(require('../commands.json'))
    })
}
exports.write = function (data:UserData) {
    switch (true) {
        case data.fileCode.startsWith("userData"):
            {
                const serverID = data.fileCode.slice(8,data.fileCode.length-1)
                fs.writeFileSync(`../data/serverdata/${serverID}/userdata.json`,JSON.stringify(data))
            }
            break;
    
        default:
            break;
    }
}
// XP Data Collection
exports.getXPData = function (serverId: string) {
    let path = `../data/serverdata/${serverId}/userData.json`
    if (fs.existsSync(path)) {
        return require(`../data/serverdata/${serverId}/userData.json`)
    } else {
        return false
    }
}
exports.getGlobalXPData = function () {
    let path = `../data/userData.json`
    if (fs.existsSync(path)) {
        return require(`../data/userData.json`)
    } else {
        return false
    }
}
// Guild Settings Collection
exports.getSettings = function (serverId: string) {
    let path = `../data/serverdata/${serverId}/guildSettings.json`
    if (fs.existsSync(path)) {
        return require(`../data/serverdata/${serverId}/guildSettings.json`)
    } else {
        return false
    }
}
exports.getSetting = function (serverID:string,setting:string) {
    let settings = exports.getSettings(serverID)
    if (settings) {
        return eval(`settings.${setting}`)
    } else {
        return false
    }
}
exports.listServers = function () {
    console.log(fs.readdirSync('../data/serverdata'))
}
exports.registerServer = function (guildID:string) {
    if (!fs.existsSync(`../data/serverdata/${guildID}`)) {
        fs.mkdirSync(`../data/serverdata/${guildID}`)
        fs.writeFileSync(`../data/serverdata/${guildID}/userData.json`, JSON.stringify(new UserData(guildID)));
        fs.writeFileSync(`../data/serverdata/${guildID}/guildSettings.json`, JSON.stringify(new GuildSettings(guildID)));
    }
}