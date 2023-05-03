import { Channel, Client, Guild, User } from "discord.js"
import fs from 'fs'
import { GuildSettings, UserData, XpManager } from "./types"
// Functions
const _ = {
    async onStart(client: Client) {
        console.log(fs.readdirSync('./data'))
        await client.guilds.fetch()
        client.guilds.cache.forEach(guild => {
            console.log(fs.existsSync('./modules'))
            if (!fs.existsSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guild.id}`)) {
                exports.registerServer(guild.id)
            }
            guild.commands.set(require('/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/commands.json'))
        })
    },
    getGlobalXPData(): UserData {
        let path = `./data/userData.json`
        if (fs.existsSync(path)) {
            return require(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/userData.json`)
        }
        return new UserData()
    },
    listServers(): string[] {
        return fs.readdirSync('/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata')
    },
    registerServer(guildID: string) {
        if (!fs.existsSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}`)) {
            fs.mkdirSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}`)
            fs.writeFileSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/userData.json`, JSON.stringify(new UserData(guildID)));
            fs.writeFileSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/guildSettings.json`, JSON.stringify(new GuildSettings(guildID)));
        }
    },
    getServer(guildID: string): ServerDataManager {
        return new ServerDataManager(guildID)
    },
    readFile(file: string) {
        return require(file)
    },
    writeFile(file: string, data: string) {
        fs.writeFileSync(file, data)
    },
    write(data: UserData | GuildSettings) {
        console.log(data)
        switch (true) {
            case data.fileCode.endsWith('global'): {
                fs.writeFileSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/userData.json`, JSON.stringify(data))
            }
                break
            case data.fileCode.startsWith("userData"):
                {
                    const serverID = data.fileCode.match(/[0-9]+/)
                    fs.writeFileSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${serverID}/userData.json`, JSON.stringify(data))
                }
                break;
            case data.fileCode.startsWith("guildSettings"): {
                {
                    const serverID = data.fileCode.match(/[0-9]+/)
                    fs.writeFileSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${serverID}/guildSettings.json`, JSON.stringify(data))
                }
            }
            break;
            default:
                break;
        }
    },
    pathTest(path:string) {
        return fs.readdirSync(path)
    }
}
export default _
export class ServerDataManager {
    getXPData: () => UserData
    getSettings: () => GuildSettings
    getSetting: (property: string) => any | false
    constructor(guildID?: string) {
        this.getXPData = function () {
            let path = `/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/userData.json`
            if (fs.existsSync(path)) {
                return require(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/userData.json`)
            } else {
                return false
            }
        }
        this.getSettings = function () {
            let path = `/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/guildSettings.json`
            if (fs.existsSync(path)) {
                return require(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/guildSettings.json`)
            } else {
                return false
            }
        }
        this.getSetting = function (setting: string) {
            let settings = this.getSettings()
            if (settings) {
                return eval(`settings.${setting}`)
            } else {
                return false
            }
        }
    }
}