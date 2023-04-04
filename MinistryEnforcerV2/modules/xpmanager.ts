import { TextChannel } from 'discord.js'
import {DataManager,User} from './types'
const dataManager:DataManager = require('./datamanager')
let globalMultiplier = 1
exports.addMultiplier = function (multiplier:number,serverID?:string,time?:number,) {
    if (time&&time > 0&&serverID) {
        let data = dataManager.getXPData(serverID)
        
    }
}
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
exports.getXP = function (serverID:string, userID:string) {
    let data = dataManager.getXPData(serverID)
    let user = data.users.find(user => user.id == userID)
    if (user) {
        return user.xp
    } else {
        return 0
    }
}
exports.addXP = function (serverID:string,userID:string,xp:number,global?:boolean) {
    let data = dataManager.getXPData(serverID)
    let user = data.users.find(user => user.id == userID)
    if (user) {
        user.xp = user.xp + xp
    } else {
        user = {id:userID,xp:xp}
    }
    dataManager.writeFile(`../data/serverdata/${serverID}/userData.json`,JSON.stringify(data))
    data = dataManager.getGlobalXPData()
    user = data.users.find(user => user.id == userID)
    if (user) {
        user.xp = user.xp + xp
    } else {
        user = {id:userID,xp:xp}
    }
    return user.xp
}
exports.setXP = function (serverID:string,userID:string,xp:number) {
    let data = dataManager.getXPData(serverID)
    let user = data.users.find(user => user.id == userID)
    if (user) {
        user.xp = xp
    } else {
        user = {id:userID,xp:xp}
    }
    dataManager.writeFile(`../data/serverdata/${serverID}/userData.json`,JSON.stringify(data))
    return xp
}
exports.getUserLevel = function (serverID:string,userID:string) {
    let data = dataManager.getXPData(serverID)
    let user = data.users.find(user => user.id == userID)
    let xp = 0
    if (user) {
        xp = user.xp
    }
    return exports.getLevel(xp)
}
exports.getRank = function (xp:number,serverID?:string) {
    
}