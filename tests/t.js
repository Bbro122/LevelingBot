let fs = require('fs')
let canv = require('canvas')
async function rotatedImg(card) {
    const canvas = canv.createCanvas(450,700)
    let ctx = canvas.getContext('2d')
    ctx.translate(225,350)
    ctx.rotate(3.14)
    ctx.translate(-225,-350)
    ctx.drawImage(await canv.loadImage(`../cards/${card}.png`,450,700),0,0)
    //fs.writeFileSync('../image.png',canvas.toBuffer())
    return canvas.toBuffer()
}
async function t() {
let rotIm = await rotatedImg('r4')
console.log(rotIm)
fs.writeFileSync('../image.png',rotIm)
}
t()