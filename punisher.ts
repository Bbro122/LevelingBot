import { CommandInteraction } from "discord.js"
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs')
exports.write = function write(file) {
    fs.writeFileSync('./punishments.json',JSON.stringify(file))
}
exports.get = function read() {
    return require("./punishments.json")
}
exports.punish = function punish(interaction:CommandInteraction) {
    let data = exports.get()
    let date = new Date();
    let options = interaction.options
    data.warnings.push({"pid":data.warnings.length,"id":options.get('user')?.user?.id,"epoch":date.getTime(),"reason":interaction.options.get('reason')?.value})
    exports.write(data)
    interaction.reply({
        content:`User To Be Punished: ${options.get('user')?.user?.username}\nType: ${options.get('type')?.value}\nReason: ${interaction.options.get('reason')?.value}\nDate: ${date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()}`,
        components: [new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('punish')
                                .setLabel('Smite Thou Sinner')
                                .setStyle('SUCCESS')
                        )  
                    ]
    })
}