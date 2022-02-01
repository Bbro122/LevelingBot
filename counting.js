
async function newCount2(client, msg, giveXP) {
    let channel = msg.channel
    let num = parseInt((await channel.messages.fetch({limit:2})).last().content)
    if (msg.content==num+1) {
        require('./xpmanager.js').give(msg,0.5)
    } else {
        msg.delete()
    }
}
module.exports = newCount2
