import { Client } from "discord.js"
import { type } from "os"

export type User = {
    xp: number,
    id: string
}
export type Multiplier = {
    startTime: number,
    endTime: number | undefined,
    multiplier: number
}
export class UserData {
    users: User[]
    multipliers: Multiplier[]
    fileCode: string
    constructor(serverID: string) {
        this.fileCode = "userData" + serverID
        this.users = []
        this.multipliers = []
    }
}
export class GuildSettings {
    games: {
        delay: number //hours
        channel: string | undefined
        enabled: boolean
        disabledGames: string[]
        triviaForceDifficulty: number
        mathForceDifficulty: number
    }
    fileCode: string
    constructor(serverID: string) {
        this.games = {
                delay: 2,
                enabled: false,
                disabledGames: [],
                triviaForceDifficulty: -1,
                mathForceDifficulty: -1,
                channel: undefined
            }
        this.fileCode = 'guildSettings'+serverID
    }
}
export type DataManager = {
    writeFile: (path: string, data: string) => any
    readFile: (path: string) => any
    onStart: (client: Client) => void
    getXPData: (serverID: string) => UserData
    getSettings: (serverID: string) => any
    getGlobalXPData: () => UserData
    listServers: () => any[]
}
export type XpManager = {
    levelRequirement: (lvl: number) => number
    getLevel: (xp: number) => number
    getXP: (serverID: string, userID: string) => number
    setXP: (serverID: string, userID: string, xp: number) => number
    addXP: (serverID: string, userID: string, xp: number, global?: boolean) => number
    getUserLevel: (serverID: string, userID: string) => number
    getRank: (xp: number, serverID?: string) => number
}
export type GameManager = {
    setup: (client: Client) => void
}