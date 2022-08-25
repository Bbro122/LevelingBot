import { ButtonInteraction, Client, CommandInteraction, GuildMember, Interaction, User } from "discord.js"
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs')
type Warning = {
    "pid": number,
    "id": string,
    "epoch": number,
    "reason": string
    "type": String
    "mod": String
}
type PunishData = {
    "warnings": Warning[]
}
function strCheck(str: any) {
    if (typeof str == 'string') {
        return str;
    }
    else {
        return '';
    }
}
function numCheck(num: any) {
    if (typeof num == 'number') {
        return num;
    }
    else {
        return 0;
    }
}
let PendingPunishments: { id: string, data: CommandInteraction["options"] }[] = []
exports.write = function write(file: PunishData) {
    fs.writeFileSync('./punishments.json', JSON.stringify(file))
}
exports.get = function read() {
    return require("./punishments.json")
}
exports.punish = function punish(interaction: CommandInteraction) {
    //data.warnings.push({"pid":data.warnings.length,"id":options.get('user')?.user?.id,"epoch":date.getTime(),"reason":interaction.options.get('reason')?.value})
    //exports.write(data)
    let mod = interaction.member!
    let user = interaction.options.get('user')?.member!
    if (user instanceof GuildMember && mod instanceof GuildMember) {
        let embed = new MessageEmbed()
            .setTitle(interaction.options.getSubcommand())
            .setDescription(interaction.options.get('reason')?.value)
            .addFields([{ name: `${user.displayName} | ${user.id}`, value: `PID: ${require('./punishments.json').warnings.length}` }])
            .setTimestamp(Date.now())
            .setFooter(`Case Mod: ${mod.displayName}`)
        PendingPunishments.push({ id: mod.id, data: interaction.options })
        interaction.reply({
            embeds: [embed],
            components: [new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('punish')
                        .setLabel('Smite Thou Sinner')
                        .setStyle('SUCCESS')
                )
            ],
            ephemeral: true
        })
        let collector = interaction.channel?.createMessageComponentCollector({ componentType: "BUTTON", filter: (i => i.customId == 'punish'),time:600000})
        collector?.on('collect', i => {
            let data = exports.get()
            let member = i.member
            let pmember = interaction.options.get('user')?.member
            let date = new Date();
            if (pmember instanceof GuildMember&&member instanceof GuildMember) {
                let type: string = interaction.options.getSubcommand()
                let embed = new MessageEmbed()
                    .setTitle(type)
                    .setDescription(interaction.options.get('reason')?.value)
                    .addFields([{ name: `${pmember.displayName}`, value: `PID: ${require('./punishments.json').warnings.length}` }])
                    .setTimestamp(Date.now())
                    .setFooter(`Case Mod: ${member.displayName}`)
                let log = { "pid": data.warnings.length, "id": interaction.options.get('user')?.user?.id, "epoch": date.getTime(), "reason": interaction.options.get('reason')?.value, "type": type, "mod": i.user.id }
                console.log('ModCheck')
                if (pmember.moderatable) {
                    console.log('Moddable')
                    if (type === 'ban') {
                        pmember.ban({ days: numCheck(interaction.options.get('messageremove')?.value), reason: interaction.options.get('reason')?.value!.toString() })
                    } else if (type === 'timeout') {
                        pmember.timeout(numCheck(interaction.options.get('time')?.value) * 60000, strCheck(interaction.options.get('reason')?.value))
                    } else if (type === 'kick') {
                        pmember.kick(strCheck(interaction.options.get('reason')?.value))
                    }
                    i.reply({ embeds: [embed], content: `<@${pmember.id}> A punishment has been issued.` })
                    data.warnings.push(log)
                    exports.write(data)
                } else {
                    i.update({ content: "Could not manage user."})
                }
            } else {
                i.update('type error 1')
            }
        })
    }
}
exports.getpunishments = function punish(user: User, interaction: CommandInteraction) {
    let punishments: Warning[] = exports.get().warnings
    let warnings: Warning[] = []
    let desc = 'Warnings'
    punishments.sort(function (a, b) { return b.pid - a.pid })
    if (user) {
        desc = `Warnings for ${user.username}`
        for (let i = 0; i < (punishments.length < 25 ? punishments.length : 25); i++) {
            const warn = punishments[i];
            if (warn.id == user.id && punishments.findIndex(warning => warning == warn) < 25) {
                warnings.push(warn)
            }
        }
    } else {
        for (let i = 0; i < (punishments.length < 25 ? punishments.length : 25); i++) {
            const warn = punishments[i];
            warnings.push(warn)
        }
    }
    let embed = new MessageEmbed()
        .setTitle(desc)
    warnings.forEach(warning => {
        let date = new Date(warning.epoch)
        let user = interaction.client.users.cache.get(warning.id)
        embed.addField(`USER: ${user ? user.username : warning.id} | PID: ${warning.pid} | TYPE: ${warning.type}`, `DATE: ${date.toLocaleDateString()} | REASON: ${warning.reason}`, false)
    })
    if (embed.fields.length == 0) {
        embed.setDescription('No punishments were found.')
    }
    interaction.reply({ embeds: [embed] })
}