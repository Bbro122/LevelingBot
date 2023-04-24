import canvas = require('canvas')
const config = require('./config.json')
const MaxIndex = config.maxindex
const ColorValue = Math.round(255/MaxIndex)
function getPoint(x:number,y:number) {
    let x1 = 0
    let y1 = 0
    let i = 0
    while (!((x1==x&&y1==y&&i>1)||Math.abs(x1)>2||Math.abs(y1)>2||i>=MaxIndex)) {
        i++
        [x1,y1] = square(x1,y1)
        x1 = x1 + x
        y1 = y1 + y
    }
    return i
}
function square(x:number,y:number) {
    return [x**2-y**2,2*x*y]
}
const timeStart = Date.now()
let resolution = config.resolution
let mandelScale = config.mandelscale * resolution
let can = canvas.createCanvas(480*resolution,360*resolution)
let context = can.getContext("2d")
for (let i = 360*resolution; i > 0; i--) {
    for (let i1 = 1; i1 <= 480*resolution; i1++) {
        let value = getPoint((i1-(240+config.offsetX)*resolution)*(0.008/mandelScale),(i-(180+config.offsetY)*mandelScale)*(0.008/mandelScale))
        context.fillStyle = `rgb(${ColorValue*value},${ColorValue*value},${ColorValue*value})`
        context.fillRect(i1,i,1,1)
    }
}
require('fs').writeFileSync('./mandel.png',can.toBuffer())
console.log(`${(Date.now()-timeStart)/1000} seconds`)