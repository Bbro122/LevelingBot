function newCount(client,msg) {
    let channel = msg.channel
    let cnumber = parseInt(channel.topic)
    if (cnumber+1 == parseInt(msg.content)) {
        msg.channel.setTopic(toString(cnumber+1))
    } else {
        msg.delete()
    }
}
module.exports = newCount