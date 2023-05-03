import { User, UserData } from './types'
import dataManager from './datamanager'
let activeMultipliers = []
const _ = {
    setup() {
        let servers = dataManager.listServers()
        servers.forEach(server => {
            let data = dataManager.getServer(server).getXPData()
            data.multipliers.forEach(multiplier => {
                if (multiplier.endTime) {
                    if ((multiplier.endTime - Date.now()) > 0)
                        activeMultipliers.push({ timeout: setTimeout(() => { exports.removeMultiplier(multiplier.startTime) }, multiplier.endTime - Date.now()) })
                    else {
                        exports.removeMultiplier()
                    }
                }
            })
        })
    },

    // Get Information

    getLevel(xp: number) {
        let level = 0
        do {
            level++
        } while (xp >= _.levelRequirement(level))
        return level
    },
    getGlobalLevel(userID: string) {
        let data = dataManager.getGlobalXPData()
        let user = data.users.find(user => user.id == userID)
        let xp = 0
        if (user) {
            xp = user.xp
        }
        return _.getLevel(xp)
    },
    getGlobalRank(xp: number) {
        let data = dataManager.getGlobalXPData()
        let users = data.users
        let fakeUser = { xp: xp + 1, id: '000' }
        users.push(fakeUser)
        users.sort((a, b) => b.xp - a.xp)
        return users.indexOf(fakeUser) + 1
    },
    levelRequirement(lvl: number): number {
        return (5 * (lvl ** 2) + (50 * lvl) + 100)
    },
    
// Modify Information

    addGlobalXP(userID: string, xp: number) {
        let data = dataManager.getGlobalXPData()
        let user = data.users.find(user => user.id == userID)
        if (user) {
            user.xp = user.xp + xp
        } else {
            user = { id: userID, xp: xp }
        }
        dataManager.writeFile('../data/userData.json', JSON.stringify(data))
        return user.xp
    },
    setGlobalXP(userID: string, xp: number) {
        let data = dataManager.getGlobalXPData()
        let user = data.users.find(user => user.id == userID)
        if (user) {
            user.xp = xp
        } else {
            user = { id: userID, xp: xp }
        }
        dataManager.writeFile('../data/userData.json', JSON.stringify(data))
        return xp
    },
    getXPManager(guildID:string) {
        return new ServerXPManager(guildID)
    }
}
export class ServerXPManager {
    // Get Information
    getXP: (userID: string) => number
    getUserLevel: (serverID: string, userID: string) => any
    getRank: (XP: number) => number
    // Modify Information
    addXP: (userID: string, xp: number, global?: boolean) => number
    setXP: (userID: string, xp: number) => number
    addMultiplier: (multiplier: number, time?: number,) => void
    //removeMultiplier: () => void // To be worked on 
    constructor(guildID: string) {
        this.addMultiplier = function (multiplier: number, time?: number) {
            if (time && time > 0) {
                let data = dataManager.getServer(guildID).getXPData()
                data.multipliers.push({ startTime: Date.now(), endTime: Date.now() + time, multiplier: multiplier })
            }
        }
        this.getXP = function (userID: string) {
            let data = dataManager.getServer(guildID).getXPData()
            let user = data.users.find(user => user.id == userID)
            if (user) {
                return user.xp
            } else {
                return 0
            }
        }
        this.addXP = function (userID: string, xp: number, global?: boolean) {
            let serverManager = dataManager.getServer(guildID)
            let data = serverManager.getXPData()
            let user = data.users.find(user => user.id == userID)
            if (user) {
                user.xp = user.xp + xp
            } else {
                user = { id: userID, xp: xp }
                data.users.push(user)
            }
            dataManager.write(data)
            if (global) {
                data = dataManager.getGlobalXPData()
                user = data.users.find(user => user.id == userID)
                if (user) {
                    user.xp = user.xp + xp
                } else {
                    user = { id: userID, xp: xp }
                    data.users.push(user)
                }
                dataManager.write(data)
            }
            return user.xp
        }
        this.setXP = function (userID: string, xp: number) {
            let serverManager = dataManager.getServer(guildID)
            let data = serverManager.getXPData()
            let user = data.users.find(user => user.id == userID)
            if (user) {
                user.xp = xp
            } else {
                user = { id: userID, xp: xp }
                data.users.push(user)
            }
            dataManager.write(data)
            return xp
        }
        this.getUserLevel = function (serverID: string, userID: string) {
            let serverManager = dataManager.getServer(serverID)
            let data = serverManager.getXPData()
            let user = data.users.find(user => user.id == userID)
            let xp = 0
            if (user) {
                xp = user.xp
            }
            return _.getLevel(xp)
        }
        this.getRank = function (xp: number) {
            let data: UserData
            data = dataManager.getServer(guildID).getXPData()
            let users = data.users
            let fakeUser = { xp: xp + 1, id: '000' }
            users.push(fakeUser)
            users.sort((a, b) => b.xp - a.xp)
            return users.indexOf(fakeUser) + 1
        }
    }
}
export default _