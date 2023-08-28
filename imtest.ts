import canvas, { loadImage } from 'canvas'
import fs from 'fs'
async function imtest() {
    let can = canvas.createCanvas(960,1500)
    let context = can.getContext('2d')
    context.drawImage(await loadImage('./pfp.png'),61,253,167,167)
    context.globalCompositeOperation = 'destination-in'
    context.drawImage(await loadImage('../statsPGTransparent.png'),0,0)
    context.globalCompositeOperation = 'source-over'
    context.drawImage(await loadImage('../statsPG.png'),0,0)
    context.globalCompositeOperation = 'destination-over'
    context.drawImage(await loadImage('../download.jpeg'),0,0,960,540)
    fs.writeFileSync('./imtest.png',can.toBuffer())
}
imtest()