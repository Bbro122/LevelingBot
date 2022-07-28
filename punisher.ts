import { ButtonInteraction, CommandInteraction, GuildMember } from "discord.js"
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs')
import { strCheck , numCheck , boolCheck } from "./typecheck"

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
            .addFields([{name:`${user.displayName} | ${user.id}`,value:`PID: ${require('./punishments.json').warnings.length}`}])
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
                let log = { "pid": data.warnings.length, "id": acase.data.get('user')?.user?.id, "epoch": date.getTime(), "reason": acase.data.get('reason')?.value, "type": type, "time": undefined }
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
                    interaction.reply({ embeds: [embed] , content: `<@${pmember.id}> A punishment has been issued.` })
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
