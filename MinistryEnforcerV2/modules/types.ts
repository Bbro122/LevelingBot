import { Client } from "discord.js"
//                   //
// DataManager Types //
//                   //
export type DataManager = {
    writeFile: (path:string,data:string) => any
    readFile: (path:string) => any
    onStart: (client: Client) => void
    getXPData: (serverID: string) => UserData
    getSettings: (serverID: string) => any
}
//             //
// Level Types //
//             //
export class User {
    xp: number;
    id: string;
    items: any[]
    constructor(userID:string,userXP?:number,items?:any) {
        this.id = userID;
        this.xp = userXP?userXP:0
        this.items = items?items:[]
    }
}
export type UserData = {
    users: User[],
    file: "xpData"
}
//                                   //
// Guild Settings / Management Types //
//                                   //
export class GuildSettings {
    counting: boolean
    games: boolean
    uno: boolean
    cah: boolean
    countChannel: string|undefined
    gamesChannel: string|undefined
    unoChannel: string|undefined
    cahChannel: string|undefined
    constructor(counting?:boolean,games?:boolean,uno?:boolean,cah?:boolean) {
        this.counting = counting?counting:false
        this.games = games?games:false
        this.uno = uno?uno:false
        this.cah = cah?cah:false
    }
}