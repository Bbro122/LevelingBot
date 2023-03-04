const axios = require('axios')
async function bountyCheck() {
    let data:{users:{trackers:string[],uuid:string,lastLogin:EpochTimeStamp}[]} = getBountyData()
    data.users.forEach(async bounty => {
        let hypixelresponse = await axios.get(`https://api.hypixel.net/player?key=0980e33a-8052-4c48-aca7-2117c200ba09&uuid=${bounty.uuid}`)
        if (hypixelresponse&&hypixelresponse.data.player.lastLogin!=bounty.lastLogin) {
            let announceString = ""
            bounty.trackers.forEach(tracker => {
                announceString + `<@${tracker}> `
            })
            announceString+`A log on has been detected for ${hypixelresponse.data.player.displayname} at <t:${Math.round(hypixelresponse.data.player.lastLogin/1000)}:F>`
        }
    })
}
function getBountyData() {
    return require('./bountydata.json')
}