
import { Client, CommandInteraction, EmbedBuilder, EmbedField, Guild, Interaction, TextBasedChannel, TextChannel, User } from "discord.js"
type timeout = {
    id: string,
    type: string,
    timeout: NodeJS.Timeout,
    endTime: number
}
export type UserProfile = {
    "id": string,
    "xp": number,
    "level": number,
    "gems": number,
    "items": {
        type: string,
        display: { name: string, value: string, inline: false }
        data: any
    }[],
    "epoch": number,
    "namecard"?: string
}
export type UserData = {
    "name": "users",
    "users": UserProfile[]
}
export type XpManager = {
    setup: (client1: Client) => void,
    give: (msg: { author: User, channel: TextBasedChannel }, amount: number, check?: boolean | null | undefined) => void
    giveGems: (id: string, amount: number) => void
    write: (file: UserData) => void
    get: () => UserData
    level: (lvl: number) => number
    timeout: (id: string, type: string, time: number) => void
    giveAll: (interaction: CommandInteraction) => void
    timeouts: () => timeout[]
    getMultiplier: () => number
    setMultiplier: (num: number, time: number) => void
    ranks: {
        remove: (Interaction: CommandInteraction) => void
        add: (Interaction: CommandInteraction) => void
        evaluate: (userID: string) => void
        list: (interaction: CommandInteraction) => void
    }
}
type RankData = { persistent: { level: number, id: string, persistent: boolean }[], rankups: { level: number, id: string, persistent: boolean }[] }
let timeouts: timeout[] = []
let fs = require('fs')
let client: Client
let multiplier = 1
exports.ranks = {}
function getRanks(): RankData {
    return require('./levelData/ranks.json')
}
function rankOf(level: number) {
    let ranks: RankData = getRanks()
    let crank: { level: number, id: string | undefined } = { level: 0, id: undefined }
    for (let i = 0; i < ranks.rankups.length; i++) {
        const rank = ranks.rankups[i];
        if (rank.level <= level && rank.level > crank.level) {
            crank = rank
        }
    }
    return crank
}
exports.ranks.remove = function (interaction: CommandInteraction) {
    let ranks: RankData = getRanks()
    let role = interaction.options.get('role')?.role
    let rank: any = ranks.persistent.find((rank) => rank.id == role?.id)
    if (rank && rank.persistent) {
        ranks.persistent.splice(ranks.persistent.indexOf(rank), 1)
    } else {
        rank = ranks.rankups.find((rank) => rank.id == role?.id)
        if (rank) {
            ranks.rankups.splice(ranks.rankups.indexOf(rank), 1)
        } else {
            interaction.reply('Existential Dread: operation failed')
            return
        }
    }
    fs.writeFileSync('./levelData/ranks.json', JSON.stringify(ranks))
    interaction.reply('That role will no longer automatically be applied.')
}
exports.ranks.add = function (interaction: CommandInteraction) {
    let ranks: RankData = getRanks()
    let role = { persistent: interaction.options.get('persist')?.value as boolean, level: interaction.options.get('level')?.value as number, id: interaction.options.get('role')?.role?.id as string }
    if (!(ranks.persistent.find(rank => rank.id == role.id) || ranks.rankups.find(rank => rank.id == role.id)) && typeof role.persistent == 'boolean' && typeof role.level == 'number' && typeof role.id == 'string') {
        if (role.persistent) {
            ranks.persistent.push(role)
        } else {
            ranks.rankups.push(role)
        }
        fs.writeFileSync('./levelData/ranks.json', JSON.stringify(ranks))
        interaction.reply('That role will now automatically be applied.')
    } else {
        interaction.reply('That role is already used in the ranking system.')
    }
}
exports.ranks.list = function (interaction: CommandInteraction) {
    let ranks: RankData = getRanks()
    let guild = client.guilds.cache.get('632995494305464331')
    if (guild instanceof Guild) {
        let fields: EmbedField[] = []
        ranks.persistent.forEach(rank => {
            let role: string | undefined = (guild as Guild).roles.cache.get(rank.id as string)?.name
            role = role ? role : rank.id as string
            fields.push({
                value: (rank.level as number).toString(), name: role,
                inline: true
            })
        });
        let persistEmbed = new EmbedBuilder()
            .setColor('Aqua')
            .setTitle('Persistent Ranks')
            .setDescription('Heres a list of the persistent ranks')
            .addFields(fields)
        fields = []
        ranks.rankups.sort((a, b) => a.level - b.level);
        ranks.rankups.forEach(rank => {
            let role: string | undefined = (guild as Guild).roles.cache.get(rank.id as string)?.name
            role = role ? role : rank.id as string
            fields.push({
                value: (rank.level as number).toString(), name: role,
                inline: true
            })
        });
        let rankupEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('Heirarchy Ranks')
            .setDescription('Heres a list of the heirarchy ranks')
            .addFields(fields)
        interaction.reply({embeds:[persistEmbed,rankupEmbed]})
    }
}
exports.ranks.evaluate = async function (userID: string) {
    let ranks: RankData = getRanks()
    let guild = client.guilds.cache.get('632995494305464331')
    let data: UserData = exports.get()
    let userData = data.users.find(user => user.id == userID)
    if (guild && userData) {
        await guild.members.fetch()
        let user = guild.members.cache.get(userID)
        if (user) {
            let actualRank = rankOf(userData?.level)
            let roles = user.roles.cache
            for (let i = 0; i < roles.size; i++) {
                const element = roles.at(i)
                if (element) {
                    let rank = ranks.persistent.find(rank => rank.id == element?.id)
                    if (rank && element) {
                        ranks.persistent.splice(i, 1)
                        if (userData.level < (typeof rank.level == 'number' ? rank.level : 0)) {
                            try { user.roles.remove(element) }
                            catch (err) { console.log(err) }
                        }
                    }
                    rank = ranks.rankups.find(rank => rank.id == element?.id)
                    if (rank && element) {
                        ranks.rankups.splice(i, 1)
                        if (element.id != actualRank.id) {
                            try { user.roles.remove(element) }
                            catch (err) { console.log(err) }
                        }
                    }
                }
            }
            if (typeof actualRank.id == 'string' && !roles.find(role => role.id == actualRank.id)) {
                let actualRole = guild.roles.cache.get(actualRank.id)
                if (actualRole) {
                    try { user.roles.add(actualRole) }
                    catch (err) { console.log(err) }
                }
            }
        }
    }
}
exports.timeouts = function getTimeouts() {
    return timeouts
}
exports.setup = function Client(client1: Client) {
    if (client1) {
        client = client1
    }
}
exports.give = function giveXP(msg: { author: User, channel: TextChannel }, amount: number, check: boolean) {
    function give() {
        if (client instanceof Client) {
            if (msg.channel.guild.members.cache.get(msg.author.id)?.roles.cache.has('1059615940129595416')) {
                amount = amount * 2
            }
            let data: UserData = exports.get()
            let user = data.users.find(user => user.id == msg.author.id)
            if (user) {
                user.xp = user.xp + (amount * multiplier)
                let level = 0
                do {
                    level++
                } while (user.xp >= exports.level(level))
                for (let i = user.level; i < level; i++) {
                    user.gems = user.gems + Math.round(10 * 1.05 ** (i + 1))
                }
                if (user.level < level) {
                    exports.ranks.evaluate(user.id)
                    if (msg.channel.id == require('./config.json').server.countchannel) {
                        let gamechannel = client.channels.cache.get(require('./config.json').server.gamechannel)
                        if (gamechannel instanceof TextChannel) {
                            gamechannel.send(`<@${msg.author.id}> **Level Up! You\'re now level ${level}.** \n ${exports.level(level) - user.xp} xp is needed for your next level.`)
                        }
                    } else {
                        msg.channel.send(`**Level Up! You\'re now level ${user.level + 1}.** \n ${exports.level(user.level + 1) - user.xp} xp is needed for your next level.`)
                    }
                }
                user.level = level
                exports.write(data)
                if (check) {
                    exports.timeout(msg.author.id, 'message')
                }
            } else {
                user = { id: msg.author.id, xp: Math.round(Math.random() * 10) + 15, level: 0, gems: 0, items: [], epoch: 0 }
                data.users.push(user)
                exports.write(data)
                if (check) {
                    exports.timeout(msg.author.id)
                }
            }
        }
    }
    if (check) {
        if (timeouts.find(timeout => timeout.id == msg.author.id && timeout.type == 'message') == undefined) {
            give()
        }
    } else {
        give()
    }
}
exports.getMultiplier = function () {
    return multiplier
}
exports.setMultiplier = function (num: number, time: number) {
    multiplier = num
    if (time) {
        let timeout: timeout = { id: 'multiplier', type: 'multiplier', timeout: setTimeout(() => { timeouts.splice(timeouts.findIndex(timet => timet == timeout), 1); multiplier = 1 }, time), endTime: Date.now() + time }
        timeouts.push()
    }
}
exports.giveGems = function gems(id: string, amount: number) {
    let data: UserData = exports.get()
    let user = data.users.find(user => user.id == id)
    if (user) {
        user.gems = user.gems + amount
        exports.write(data)
    }
}
exports.write = function write(file: UserData) {
    if (file.name == 'users') { fs.writeFileSync('./userdata.json', JSON.stringify(file)) }
}
exports.get = function read() {
    return require("./userdata.json")
}
exports.level = function level(lvl: number) {
    return (5 * (lvl ** 2) + (50 * lvl) + 100)
}
exports.timeout = function createTimeout(id: string, type: string, time: number) {
    let timeout: timeout
    if (time) {
        timeout = { id: id, type: type, timeout: setTimeout(() => timeouts.splice(timeouts.findIndex(timet => timet == timeout), 1), time), endTime: Date.now() + time }
    } else {
        timeout = { id: id, type: type, timeout: setTimeout(() => timeouts.splice(timeouts.findIndex(timet => timet == timeout), 1), 60000), endTime: Date.now() + 60000 }
    }
    timeouts.push(timeout)
}
