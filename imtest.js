import { createCanvas, loadImage } from 'canvas'
const reso = 0.5
function res(num) {
    return num * reso
}
async function rotatedImg(card) {
  const canvas = createCanvas(450,700)
  let ctx = canvas.getContext('2d')
  ctx.translate(225,350)
  ctx.rotate(3.14)
  ctx.translate(-225,-350)
  ctx.drawImage(await loadImage(`../cards/${card}.png`,450,700),0,0)
  return canvas
}
async function dispBoard(hands, game, hidden) {
  const canvas = createCanvas(res(7000), res(7000))
  let ctx = canvas.getContext('2d')
  let logo2 = await loadImage(`./cards/logo2.png`)
  ctx.drawImage(await loadImage('./cards/background.png'), 0, 0, res(7000), res(7000))
  ctx.drawImage(await loadImage('./cards/logo.png'), res(2500), res(2750), res(900), res(1400))
  ctx.drawImage(await loadImage(`./cards/${game.deck[0]}.png`), res(3600), res(2750), res(900), res(1400))
  ctx.translate(res(3500), res(3500))
  ctx.rotate(3.14)
  ctx.translate(-res(3500), -res(3500))
  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];
    for (let i = 0; i < hand.length; i++) {
      const card = hand[i]
      if (i > 9) {
        ctx.drawImage((hidden)?logo2:await rotatedImg(card), res(3500) - res(2300) - res(50) * (i - 10), res(50), res(450), res(700))
      } else {
        ctx.drawImage((hidden)?logo2:await rotatedImg(card), res(3500) - ((hand.length <= 10) ? res(230) * hand.length : res(2300)) + res(460) * i, res(50), res(450), res(700))
      }
    }
    ctx.translate(res(3500), res(3500))
    ctx.rotate((hands.length<3)?3.14:1.57)
    ctx.translate(-res(3500), -res(3500))
  }
  return canvas.toBuffer()
}
dispBoard([["r1"],["r1","r2"],["r1",]])

const fs = require('fs');

const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');

const width = 400;
const height = 400;

async function newImage() {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(fs.createWriteStream('./result.gif'));
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(1);
    encoder.setQuality(10);
    const image = await loadImage(`./ouroboros.png`);
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    let frames = 60
    for (let i = 0; i < frames; i++) {
        ctx.translate(width/2,height/2)
        ctx.rotate(-(360 / frames) * Math.PI / 180)
        ctx.translate(-width/2,-height/2)
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        encoder.addFrame(ctx)
        if (i == frames - 1) {
            encoder.finish()
        }
    }
}
newImage()