let fs = require('fs')
export type UserProfile = {
    "id": string,
    "xp": number,
    "level": number,
    "gems": number
    "items": {
        type:string,
        display:{name:string,value:string,inline:false}
        data:any
    }[],
    "epoch":number
}
export type UserData = UserProfile[]
export type Server = {id: string, users: UserData, gameChan?: string | undefined, countChan?: string | undefined,unoForum?: string | undefined}
export type ServerData = {servers: Server[]}
let data:any = {}
data.write = function(data:ServerData) {
    fs.writeFileSync('./serverdata.json',data)
}
data.read = function() {
    return require('./serverdata.json')
}
data.get = function(id:string) {
    let sdata:ServerData = data.read()
    let server = sdata.servers.find(server => server.id == id)
    if (server) {
        return server
    } else {
        sdata.servers.push({id: id, users: []})
        return {id: id, users: []}
    }
}
data.getuser = function(server:Server,uid:string) {
    let user = server.users.find(user => user.id == uid)
    if (user) {
        return user
    } else {
        let newuser = { id: uid, xp: 0, level: 0, gems: 0, items: [],epoch:0}
        return newuser
    }
}