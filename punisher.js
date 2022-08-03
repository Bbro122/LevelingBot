"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs');
function strCheck(str) {
    if (typeof str == 'string') {
        return str;
    }
    else {
        return '';
    }
}
function numCheck(num) {
    if (typeof num == 'number') {
        return num;
    }
    else {
        return 0;
    }
}
let PendingPunishments = [];
exports.write = function write(file) {
    fs.writeFileSync('./punishments.json', JSON.stringify(file));
};
exports.get = function read() {
    return require("./punishments.json");
};
exports.punish = function punish(interaction) {
    var _a, _b;
    //data.warnings.push({"pid":data.warnings.length,"id":options.get('user')?.user?.id,"epoch":date.getTime(),"reason":interaction.options.get('reason')?.value})
    //exports.write(data)
    let mod = interaction.member;
    let user = (_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.member;
    if (user instanceof discord_js_1.GuildMember && mod instanceof discord_js_1.GuildMember) {
        let embed = new MessageEmbed()
            .setTitle(interaction.options.getSubcommand())
            .setDescription((_b = interaction.options.get('reason')) === null || _b === void 0 ? void 0 : _b.value)
            .addFields([{ name: `${user.displayName} | ${user.id}`, value: `PID: ${require('./punishments.json').warnings.length}` }])
            .setTimestamp(Date.now())
            .setFooter(`Case Mod: ${mod.displayName}`);
        PendingPunishments.push({ id: mod.id, data: interaction.options });
        interaction.reply({
            embeds: [embed],
            components: [new MessageActionRow()
                    .addComponents(new MessageButton()
                    .setCustomId('punish')
                    .setLabel('Smite Thou Sinner')
                    .setStyle('SUCCESS'))
            ],
            ephemeral: true
        });
    }
};
exports.punishConfirm = function punish(interaction) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    let member = interaction.member;
    let data = exports.get();
    let date = new Date();
    if (member instanceof discord_js_1.GuildMember) {
        let id = member.id;
        let acase = PendingPunishments.find(acase => acase.id == id);
        if (acase) {
            let pmember = (_a = acase === null || acase === void 0 ? void 0 : acase.data.get('user')) === null || _a === void 0 ? void 0 : _a.member;
            if (pmember instanceof discord_js_1.GuildMember) {
                let replied = false;
                let type = acase === null || acase === void 0 ? void 0 : acase.data.getSubcommand();
                let embed = new MessageEmbed()
                    .setTitle(type)
                    .setDescription((_b = acase === null || acase === void 0 ? void 0 : acase.data.get('reason')) === null || _b === void 0 ? void 0 : _b.value)
                    .addFields([{ name: `${pmember.displayName}`, value: `PID: ${require('./punishments.json').warnings.length}` }])
                    .setTimestamp(Date.now())
                    .setFooter(`Case Mod: ${member.displayName}`);
                let log = { "pid": data.warnings.length, "id": (_d = (_c = acase.data.get('user')) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id, "epoch": date.getTime(), "reason": (_e = acase.data.get('reason')) === null || _e === void 0 ? void 0 : _e.value, "type": type, "mod": interaction.user.id };
                console.log('ModCheck');
                if (pmember.moderatable) {
                    console.log('Moddable');
                    if (type === 'ban') {
                        pmember.ban({ days: numCheck((_f = acase.data.get('messageremove')) === null || _f === void 0 ? void 0 : _f.value), reason: (_g = acase === null || acase === void 0 ? void 0 : acase.data.get('reason')) === null || _g === void 0 ? void 0 : _g.value.toString() });
                    }
                    else if (type === 'timeout') {
                        pmember.timeout(numCheck((_h = acase.data.get('time')) === null || _h === void 0 ? void 0 : _h.value) * 60000, strCheck((_j = acase === null || acase === void 0 ? void 0 : acase.data.get('reason')) === null || _j === void 0 ? void 0 : _j.value));
                    }
                    else if (type === 'kick') {
                        pmember.kick(strCheck((_k = acase === null || acase === void 0 ? void 0 : acase.data.get('reason')) === null || _k === void 0 ? void 0 : _k.value));
                    }
                    interaction.reply({ embeds: [embed], content: `<@${pmember.id}> A punishment has been issued.` });
                    data.warnings.push(log);
                    exports.write(data);
                }
                else {
                    interaction.reply({ content: "Could not manage user.", ephemeral: true });
                }
            }
            else {
                interaction.reply('type error 1');
            }
            PendingPunishments.splice(PendingPunishments.findIndex(bcase => bcase == acase), 1);
        }
        else {
            interaction.reply({ content: 'Case not found.', ephemeral: true });
        }
    }
    else {
        interaction.reply({ content: 'type error 0', ephemeral: true });
    }
};
exports.getpunishments = function punish(user, interaction) {
    let punishments = exports.get().warnings;
    let warnings = [];
    let desc = 'Warnings';
    punishments.sort(function (a, b) { return b.pid - a.pid; });
    if (user) {
        desc = `Warnings for ${user.username}`;
        for (let i = 0; i < (punishments.length < 25 ? punishments.length : 25); i++) {
            const warn = punishments[i];
            if (warn.id == user.id && punishments.findIndex(warning => warning == warn) < 25) {
                warnings.push(warn);
            }
        }
    }
    else {
        for (let i = 0; i < (punishments.length < 25 ? punishments.length : 25); i++) {
            const warn = punishments[i];
            warnings.push(warn);
        }
    }
    let embed = new MessageEmbed()
        .setTitle(desc);
    warnings.forEach(warning => {
        let date = new Date(warning.epoch);
        let user = interaction.client.users.cache.get(warning.id);
        embed.addField(`USER: ${user ? user.username : warning.id} | PID: ${warning.pid} | TYPE: ${warning.type}`, `DATE: ${date.toLocaleDateString()} | REASON: ${warning.reason}`, false);
    });
    if (embed.fields.length == 0) {
        embed.setDescription('No punishments were found.');
    }
    interaction.reply({ embeds: [embed] });
};
