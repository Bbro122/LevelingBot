import { Canvas, CanvasRenderingContext2D } from "canvas"
import can = require('canvas')
let fs = require('fs')
async function getImage(xp:number,requirement:number,namecard:string,level:number,avatar?:string,) {
    let canvas = can.createCanvas(1200, 300)
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = '#171717'
    ctx.fillRect(0, 0, 1200, 300)
    ctx.fillStyle = '#171717'
    ctx.fillRect(325, 200, 800, 50)
    ctx.fillStyle = '#00EDFF'
    ctx.fillRect(325, 200, (xp/requirement)*800, 50)
    let nameCard:any = 'default'
    if (namecard) {
        nameCard = namecard
    }
    nameCard = can.loadImage(`./namecards/${nameCard}.png`)
    ctx.drawImage(await can.loadImage(`./pfp.png`), 50, 50, 200, 200)
    ctx.drawImage(await nameCard,0,0)
    ctx.fillStyle = '#ffffff'
     ctx.font = '40px Arial'
     ctx.fillText(`Rank #${1}`, 325, 100)
     ctx.fillText('Demoted', 325, 190)
     let wid = ctx.measureText('Demoted').width
     ctx.font = '30px Arial'
     ctx.fillText('0666', 335 + wid, 192)
     ctx.fillText(`${xp} / ${requirement} XP`, 1125 - ctx.measureText(`${xp} / ${requirement} XP`).width, 192)
     ctx.fillStyle = '#00EDFF'
     ctx.fillText("Level", 960, 75)
     ctx.font = '60px Arial'
     ctx.fillText(level.toString(), 1043, 75)
    let buffer:Buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./image.png', buffer)
}
//getImage(59,100,'default',1)
// let array = [1,20,123,543]
// let test = 546
// array.push(test)
// array.sort((a, b) => b - a)
// console.log(array.indexOf(test)+1)
require('fs').mkdirSync('./test')