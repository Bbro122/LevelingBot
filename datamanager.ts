import { Guild } from "discord.js"

let fs = require('fs')
export type UserProfile = {
    "id": string,
    "xp": number,
    "level": number,
    "gems": number
    "items": {
        type: string,
        display: { name: string, value: string, inline: false }
        data: any
    }[],
    "epoch": number
}
export type UserData = UserProfile[]
export type Server = { id: string, userProfiles: UserData, gameConfig: { gameChannel: undefined | string, disabledGames: undefined | string[], delay: number }, unoForum?: string | undefined }
export type ServerData = { servers: Server[] }
let data: any = {}
data.server = function (this: any, server: Guild | string) {
    if (server instanceof Guild) {
        this.id = server.id
        this.userProfiles = []
        this.userCount = server.memberCount
        this.countChannel = undefined
        this.gameConfig = { gameChannel: undefined, disabledGames: undefined, delay: 7200000 }
        this.unoForum = undefined
    } else {
        this.id = server
        this.userProfiles = []
        this.userCount = 0
        this.countChannel = undefined
        this.gameConfig = { gameChannel: undefined, disabledGames: undefined, delay: 7200000 }
        this.unoForum = undefined
    }
}
data.write = function (data: ServerData) {
    fs.writeFileSync('./serverdata.json', data)
}
data.read = function () {
    return require('./serverdata.json')
}
data.get = function (id: string) {
    let sdata: ServerData = data.read()
    let server = sdata.servers.find(server => server.id == id)
    if (server) {
        return server
    } else {
        sdata.servers.push(new data.server(id))
        return { id: id, users: [] }
    }
}
data.getuser = function (server: Server, uid: string) {
    let user = server.userProfiles.find(user => user.id == uid)
    if (user) {
        return user
    } else {
        let newuser = { id: uid, xp: 0, level: 0, gems: 0, items: [], epoch: 0 }
        return newuser
    }
}