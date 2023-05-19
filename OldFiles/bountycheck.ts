import { channel } from "diagnostics_channel"
import { Channel, TextChannel } from "discord.js"

const axios = require('axios')
const fs = require('fs')
let bountychannel:TextChannel
async function bountyCheck() {
    let data:{users:{trackers:string[],uuid:string,lastLogin:EpochTimeStamp}[]} = getBountyData()
    data.users.forEach(async bounty => {
        let hypixelresponse = await axios.get(`https://api.hypixel.net/player?key=0980e33a-8052-4c48-aca7-2117c200ba09&uuid=${bounty.uuid}`)
        if (hypixelresponse&&hypixelresponse.data.player.lastLogin!=bounty.lastLogin) {
            let announceString = ""
            bounty.trackers.forEach(tracker => {
                announceString = announceString + `<@${tracker}> `
            })
            announceString = announceString+`A log on has been detected for ${hypixelresponse.data.player.displayname} at <t:${Math.round(hypixelresponse.data.player.lastLogin/1000)}:F>`
            bounty.lastLogin = hypixelresponse.data.player.lastLogin
            fs.writeFileSync('./bountydata.json',JSON.stringify(data))
            bountychannel.send(announceString)
        }
    })
}
function getBountyData() {
    return require('./bountydata.json')
}
function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sync = async function sync(channel: TextChannel) {
    bountychannel = channel
    while (true) {
        bountyCheck()
        await sleep(300000)
    }
}