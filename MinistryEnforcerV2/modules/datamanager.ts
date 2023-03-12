import { Client } from "discord.js"

const fs = require('fs')
//Defaults
const xpDefault = {}
const guildSettingsDefault = { counting: false, games: false, bounties: false, levels: true, gameChannel: undefined, countChannel: undefined, bountyChannel: undefined }
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
// Guild Settings Collection
exports.getSettings = function (serverId: string) {
    let path = `../data/serverdata/${serverId}/guildSettings.json`
    if (fs.existsSync(path)) {
        return require(`../data/serverdata/${serverId}/guildSettings.json`)
    } else {
        return false
    }
}
//