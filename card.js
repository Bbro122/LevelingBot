const fs = require('fs')
let can = require('canvas');
const { waitForDebugger } = require('inspector');
async function dispCards(cards) {
let canvas = can.createCanvas(7000,7000)
let context = canvas.getContext("2d")
context.drawImage(await can.loadImage('./cards/background.png'),0,0)
let length = (cards.length<10)?cards.length:10
for (let i = 0; i < length; i++) {
    const element = cards[i];
    context.drawImage(await can.loadImage(`./cards/logo2.png`),460*(i%10) + (3500-(460*length)/2),50)
}
if (cards.length > 10) {
    context.drawImage(await can.loadImage(`./cards/logo2.png`),5390,75)
    context.drawImage(await can.loadImage(`./cards/logo2.png`),5440,100)
    context.drawImage(await can.loadImage(`./cards/logo2.png`),5490,125)
}
context = canvas.getContext("2d")
context.translate(3500,3500)
context.rotate((90*Math.PI)/180)
context.translate(-3500,-3500)
context.fillRect(50, 20, 100, 50);
for (let i = 0; i < length; i++) {
    console.log("h")
    const element = cards[i];
    context.drawImage(await can.loadImage(`./cards/logo2.png`),460*(i%10) + (3500-(460*length)/2),50)
}
if (cards.length > 10) {
    context.drawImage(await can.loadImage(`./cards/logo2.png`),5390,75)
    context.drawImage(await can.loadImage(`./cards/logo2.png`),5440,100)
    context.drawImage(await can.loadImage(`./cards/logo2.png`),5490,125)
}
return fs.writeFileSync("./image.png",canvas.toBuffer())
}
dispCards(["b0","b1","b2","b3","b4","b5","b0","b1","b2","b3","b4","b5"])