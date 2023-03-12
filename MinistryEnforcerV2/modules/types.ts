import { Client } from "discord.js"

export type User = {
    xp: number,
    id: string
}
export type UserData = {
    users: User[],
    file: "xpData"
}
export type DataManager = {
    writeFile: (path:string,data:string) => any
    readFile: (path:string) => any
    onStart: (client: Client) => void
    getXPData: (serverID: string) => UserData
    getSettings: (serverID: string) => any
}