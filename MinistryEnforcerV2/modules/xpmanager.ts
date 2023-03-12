import {DataManager} from './types'
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
exports.addXP = function (serverID:string,userID:string,xp:number) {
    let data = dataManager.getXPData(serverID)
    let user = data.users.find(user => user.id == userID)
    if (user) {
        
    }

}