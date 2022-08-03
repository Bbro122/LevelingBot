import { Client, CommandInteraction, Interaction, TextBasedChannel, TextChannel, User } from "discord.js"

let timeouts: { id: string, timeout: NodeJS.Timeout | undefined }[] = []
let fs = require('fs')
let client: Client
type UserProfile = {
    "id":string,
    "xp":number,
    "level":number,
    "gems":number
}
type UserData = {
    "name":"users",
    "users":UserProfile[]
}
export type XpManager = {
    setup: (client1: Client) => void,
    give: (msg: { author: User, channel: TextBasedChannel }, amount: number, check?: boolean | null | undefined) => void
    giveGems: (id: string,amount: number) => void
    write: (file:UserData) => void
    get: () => UserData
    level: (lvl: number) => number
    timeout: (id:string,time:number) => void
    giveAll: (interaction:CommandInteraction) => void
}
exports.setup = function Client(client1: Client) {
    if (client1) {
        client = client1
    }
}
exports.give = function giveXP(msg: { author: User, channel: TextChannel }, amount: number, check: boolean) {
    function give() {
        if (client instanceof Client) {
            let data:UserData = exports.get()
            let user = data.users.find(user => user.id == msg.author.id)
            if (user) {
                user.xp = user.xp + amount
                let level = 0
                do {
                    level++
                } while (user.xp >= exports.level(level))
                for (let i = user.level; i < level; i++) {
                    user.gems = user.gems + Math.round(10 * 1.05 ** (i + 1))
                }
                if (user.level < level) {
                    if (msg.channel.id == require('./config.json').server.countchannel) {
                        let gamechannel = client.channels.cache.get(require('./config.json').server.gamechannel)
                        if (gamechannel instanceof TextChannel) {
                            gamechannel.send(`<@${msg.author.id}> **Level Up! You\'re now level ${user.level}.** \n ${exports.level(user.level) - user.xp} xp is needed for your next level.`)
                        }
                    } else {
                        msg.channel.send(`**Level Up! You\'re now level ${user.level}.** \n ${exports.level(user.level) - user.xp} xp is needed for your next level.`)
                    }
                }
                user.level = level
                exports.write(data)
                if (check) {
                    exports.timeout(msg.author.id)
                }
            } else {
                user = { id: msg.author.id, xp: Math.round(Math.random() * 10) + 15, level: 0, gems: 0 }
                data.users.push(user)
                exports.write(data)
                if (check) {
                    exports.timeout(msg.author.id)
                }
            }
        }
    }
    if (check) { if (timeouts.find(timeout => timeout.id == msg.author.id) == undefined) { give() } } else { give() }
}
exports.giveGems = function gems(id: string, amount: number) {
    let data:UserData = exports.get()
    let user = data.users.find(user => user.id = id)
    if (user) {
        user.gems = user.gems + amount
        exports.write(data)
    }
}
exports.write = function write(file:UserData) {
    if (file.name == 'users') { fs.writeFileSync('./userdata.json', JSON.stringify(file)) }
}
exports.get = function read() {
    return require("./userdata.json")
}
exports.level = function level(lvl:number) {
    return (5 * (lvl ** 2) + (50 * lvl) + 100)
}
exports.timeout = function createTimeout(id:string, time:number) {
    let timeout: { id: string, timeout: NodeJS.Timeout } | undefined
    if (time) {
        timeout = { id: id, timeout: setTimeout(() => timeouts.splice(timeouts.findIndex(timet => timet.timeout == timeout), 1), time) }
    } else {
        timeout = { id: id, timeout: setTimeout(() => timeouts.splice(timeouts.findIndex(timet => timet.timeout == timeout), 1), 60000) }
    }
    timeouts.push(timeout)
}
exports.giveall = async function giveAll(interaction:CommandInteraction) {
    let guild = interaction.guild
    await guild?.members.fetch()
    let channel = interaction.channel
    let amount = interaction.options?.get('amount')?.value
    let data = exports.get()
    guild?.members.cache.forEach(member => {
        let user = data.users.find(user => user.id == member.id)
        if (user) {
            user.xp = user.xp + amount
        } else {
            user = { id: member.id, xp: amount, level: 0 }
            if (user.xp >= exports.level(user.level)) {
                user.level++
            }
        }
    })
    exports.write(data)
}
