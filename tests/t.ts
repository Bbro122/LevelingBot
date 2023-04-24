import can = require('canvas')
import { XpManager } from '../MinistryEnforcerV2/modules/types'
let xpmanager:XpManager = require('../MinistryEnforcerV2/modules/xpmanager')
async function getImage(xp: number, username: any, number: any, level: any, imagelink?: any) {
    const userLevel = xpmanager.getLevel(xp)
    const requirement = xpmanager.levelRequirement(userLevel)
    const lastRequirement = xpmanager.levelRequirement(userLevel-1)
    let canvas = can.createCanvas(1200, 300)
    let context = canvas.getContext('2d')
    context.fillStyle = '#171717'
    context.fillRect(0, 0, 1200, 300)
    context.fillStyle = '#171717'
    context.fillRect(325, 200, 800, 50)
    context.fillStyle = '#00EDFF'
    context.fillRect(325, 200, Math.round((xp-lastRequirement) / (requirement-lastRequirement) * 800), 50)
    context.drawImage(await can.loadImage('../MinistryEnforcerV2/namecards/Overlay.png'), 50, 50, 200, 200)
    //if (namecard) {
    //    context.drawImage(await can.loadImage((namecard && typeof namecard == 'string') ? namecard : './namecards/ministry.png'), 0, 0, 1200, 300)
    //} else {
    //    if (ministry) {
    //        context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300)
    //    } else {
    //        context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300)
    //    }
    //}
    context.fillStyle = '#ffffff'
    context.font = '40px Arial'
    context.fillText(`Rank #${xpmanager.getRank(xp)}`, 325, 100)
    context.fillText(username, 325, 190)
    let wid = context.measureText(username).width
    context.font = '30px Arial'
    context.fillText(number, 335 + wid, 192)
    context.fillText(`${xp - lastRequirement} / ${requirement - lastRequirement} XP`, 1125 - context.measureText(`${xp - lastRequirement} / ${requirement - lastRequirement} XP`).width, 192)
    context.fillStyle = '#00EDFF'
    context.fillText("Level", 960, 75)
    context.font = '60px Arial'
    context.fillText(level, 1043, 75)
    return canvas.toBuffer('image/png')
}
getImage(50,'demoted','0666',10,).then(image => {
    require('fs').writeFileSync('./image.png',image)
})
