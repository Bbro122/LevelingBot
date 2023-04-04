import { Client } from "discord.js"

export type User = {
    xp: number,
    id: string
}
export type Multiplier = {
    startTime: number,
    endTime: number|undefined,
    multiplier: number
}
export type UserData = {
    users: User[],
    multipliers: Multiplier[]
    file: "xpData"
}
export type DataManager = {
    writeFile: (path:string,data:string) => any
    readFile: (path:string) => any
    onStart: (client: Client) => void
    getXPData: (serverID: string) => UserData
    getSettings: (serverID: string) => any
    getGlobalXPData: () => UserData
}
export type XpManager = {
    levelRequirement: (lvl:number) => number
    getLevel: (xp:number) => number
    getXP: (serverID:string,userID:string) => number
    setXP: (serverID:string,userID:string) => number
    addXP: (serverID:string,userID:string,global?:boolean) => number
    getUserLevel: (serverID:string,userID:string) => number
}