const fs = require('fs')
let can = require('canvas')
let res = 2
async function getInventory(items) {
let canvas = can.createCanvas(610*res,370*res)
let context = canvas.getContext("2d")
context.drawImage(await can.loadImage('./Inventory.png'),0,0,610*res,670*res)
for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (fs.existsSync(`./icons/${item.name}.png`)) {
        context.drawImage(await can.loadImage(`./icons/${item.name}.png`),(10+60*(i%10))*res,(70+60*Math.floor(i/10))*res,35*res,35*res)
        context.fillStyle = '#ffffff'
        context.font = '40px Arial'
        context.fillText(item.count,(25+60*(i%10))*res,(120+60*Math.floor(i/10))*res)
    } else {
        context.drawImage(await can.loadImage(`./icons/unknown.png`),(10+60*(i%10))*res,(70+60*Math.floor(i/10))*res,50*res,50*res)
    }
}
fs.writeFileSync("./image.png",canvas.toBuffer())
}
getInventory([{name:"diamond",count:10},{name:"gold_ingot",count:10},{name:"iron_ingot",count:10},{name:"t",count:10}])
//getInventory()