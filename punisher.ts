import { Embed } from "@discordjs/builders";
import { ButtonInteraction, Client, CommandInteraction, GuildMember, Interaction, User } from "discord.js"
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs')
import { strCheck, numCheck, boolCheck } from "./typecheck"
type Warning = {
    "pid": number,
    "id": string,
    "epoch": number,
    "reason": string
    "type": String
    "mod": String
}
let PendingPunishments: { id: string, data: CommandInteraction["options"] }[] = []
exports.write = function write(file) {
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
    }
}
exports.punishConfirm = function punish(interaction: ButtonInteraction) {
    let member = interaction.member
    let data = exports.get()
    let date = new Date();
    if (member instanceof GuildMember) {
        let id = member.id
        let acase = PendingPunishments.find(acase => acase.id == id)
        if (acase) {
            let pmember = acase?.data.get('user')?.member
            if (pmember instanceof GuildMember) {
                let replied = false
                let type: string = acase?.data.getSubcommand()
                let embed = new MessageEmbed()
                    .setTitle(type)
                    .setDescription(acase?.data.get('reason')?.value)
                    .addFields([{ name: `${pmember.displayName}`, value: `PID: ${require('./punishments.json').warnings.length}` }])
                    .setTimestamp(Date.now())
                    .setFooter(`Case Mod: ${member.displayName}`)
                let log = { "pid": data.warnings.length, "id": acase.data.get('user')?.user?.id, "epoch": date.getTime(), "reason": acase.data.get('reason')?.value, "type": type, "mod": interaction.user.id }
                console.log('ModCheck')
                if (pmember.moderatable) {
                    console.log('Moddable')
                    if (type === 'ban') {
                        pmember.ban({ days: numCheck(acase.data.get('messageremove')?.value), reason: acase?.data.get('reason')?.value!.toString() })
                    } else if (type === 'timeout') {
                        pmember.timeout(numCheck(acase.data.get('time')?.value) * 60000, strCheck(acase?.data.get('reason')?.value))
                    } else if (type === 'kick') {
                        pmember.kick(strCheck(acase?.data.get('reason')?.value))
                    }
                    interaction.reply({ embeds: [embed], content: `<@${pmember.id}> A punishment has been issued.` })
                    data.warnings.push(log)
                    exports.write(data)
                } else {
                    interaction.reply({ content: "Could not manage user.", ephemeral: true })
                }
            } else {
                interaction.reply('type error 1')
            }
            PendingPunishments.splice(PendingPunishments.findIndex(bcase => bcase == acase), 1)
        } else {
            interaction.reply({ content: 'Case not found.', ephemeral: true })
        }
    } else {
        interaction.reply({ content: 'type error 0', ephemeral: true })
    }
}
exports.getpunishments = function punish(user: User,interaction: CommandInteraction) {
    let punishments: Warning[] = exports.get().warnings
    let warnings: Warning[] = []
    let desc = 'Warnings'
    punishments.sort(function(a,b){return b.pid-a.pid})
    if (user) {
        desc = `Warnings for ${user.username}`
        for (let i = 0; i < (punishments.length < 25?punishments.length:25); i++) {
            const warn = punishments[i];
            if (warn.id == user.id && punishments.findIndex(warning => warning == warn) < 25) {
                warnings.push(warn)
            }
        }
    } else {
        for (let i = 0; i < (punishments.length < 25?punishments.length:25); i++) {
            const warn = punishments[i];
            warnings.push(warn)
        }
    }
    let embed = new MessageEmbed()
        .setTitle(desc)
    warnings.forEach(warning => {
        let date = new Date(warning.epoch)
        let user = interaction.client.users.cache.get(warning.id)
        embed.addField(`USER: ${user?user.username:warning.id} | PID: ${warning.pid} | TYPE: ${warning.type}`,`DATE: ${date.toLocaleDateString()} | REASON: ${warning.reason}`,false)
    })
    if (embed.fields.length == 0) {
        embed.setDescription('No punishments were found.')
    }
    interaction.reply({embeds:[embed]})
}