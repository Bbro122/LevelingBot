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