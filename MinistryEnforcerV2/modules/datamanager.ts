import { Client } from "discord.js"
import fs = require('fs')
import { UserData } from "./types"
//Defaults
const xpDefaultValues: UserData =
{
    users: [],
    file: "xpData",
    multipliers: []
}
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
const xpDefault = JSON.stringify(xpDefaultValues)
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
        if (!fs.existsSync(`../data/serverdata/${guild.id}`)) {
            fs.mkdirSync(`../data/serverdata/${guild.id}`)
            fs.writeFileSync(`../data/serverdata/${guild.id}/userData.json`, xpDefault);
            fs.writeFileSync(`../data/serverdata/${guild.id}/guildSettings.json`, guildSettingsDefault);
        }
    })
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