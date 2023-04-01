import { TextChannel } from 'discord.js'
import {DataManager,User} from './types'
const dataManager:DataManager = require('./datamanager')
exports.levelRequirement = function levReq(lvl: number) {
    return (5 * (lvl ** 2) + (50 * lvl) + 100)
}
exports.getLevel = function getLevel(xp:number) {
    let level = 0
    do {
        level++
    } while (xp >= exports.levelRequirement(level))
    return level
}
exports.addXP = function (serverID:string,userID:string,xp:number,channel?:TextChannel) {
    let data = dataManager.getXPData(serverID)
    let user = data.users.find(user => user.id == userID)
    if (user) {
        let ogXP = exports.getLevel(user.xp)
        user.xp = user.xp + xp
        if (exports.getLevel(user.xp)>ogXP) {
            if (channel) {
                channel.send(`<@${userID}> **Level Up!** You are now ${exports.getLevel(user.xp)}`)
            } else {
                dataManager.getSettings(serverID)
            }
        }
    } else {
        let user = new User(userID,xp)
        data.users.push(user)
    }
}