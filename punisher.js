"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const { ActionRowBuilder, MessageButton, EmbedBuilder } = require('discord.js');
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
    var _a, _b, _c;
    //data.warnings.push({"pid":data.warnings.length,"id":options.get('user')?.user?.id,"epoch":date.getTime(),"reason":interaction.options.get('reason')?.value})
    //exports.write(data)
    let mod = interaction.member;
    let user = (_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.member;
    if (user instanceof discord_js_1.GuildMember && mod instanceof discord_js_1.GuildMember) {
        let embed = new EmbedBuilder()
            .setTitle(interaction.options.getSubcommand())
            .setDescription((_b = interaction.options.get('reason')) === null || _b === void 0 ? void 0 : _b.value)
            .addFields([{ name: `${user.displayName} | ${user.id}`, value: `PID: ${require('./punishments.json').warnings.length}` }])
            .setTimestamp(Date.now())
            .setFooter(`Case Mod: ${mod.displayName}`);
        PendingPunishments.push({ id: mod.id, data: interaction.options });
        interaction.reply({
            embeds: [embed],
            components: [new ActionRowBuilder()
                    .addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId('punish')
                    .setLabel('Smite Thou Sinner')
                    .setStyle(discord_js_1.ButtonStyle.Success))
            ],
            ephemeral: true
        });
        let collector = (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, filter: (i => i.customId == 'punish'), time: 600000 });
        collector === null || collector === void 0 ? void 0 : collector.on('collect', i => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            let data = exports.get();
            let member = i.member;
            let pmember = (_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.member;
            let date = new Date();
            if (pmember instanceof discord_js_1.GuildMember && member instanceof discord_js_1.GuildMember) {
                let type = interaction.options.getSubcommand();
                let embed = new EmbedBuilder()
                    .setTitle(type)
                    .setDescription((_b = interaction.options.get('reason')) === null || _b === void 0 ? void 0 : _b.value)
                    .addFields([{ name: `${pmember.displayName}`, value: `PID: ${require('./punishments.json').warnings.length}` }])
                    .setTimestamp(Date.now())
                    .setFooter(`Case Mod: ${member.displayName}`);
                let log = { "pid": data.warnings.length, "id": (_d = (_c = interaction.options.get('user')) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id, "epoch": date.getTime(), "reason": (_e = interaction.options.get('reason')) === null || _e === void 0 ? void 0 : _e.value, "type": type, "mod": i.user.id };
                console.log('ModCheck');
                if (pmember.moderatable) {
                    console.log('Moddable');
                    if (type === 'ban') {
                        pmember.ban({ reason: (_f = interaction.options.get('reason')) === null || _f === void 0 ? void 0 : _f.value.toString() });
                    }
                    else if (type === 'timeout') {
                        pmember.timeout(numCheck((_g = interaction.options.get('time')) === null || _g === void 0 ? void 0 : _g.value) * 60000, strCheck((_h = interaction.options.get('reason')) === null || _h === void 0 ? void 0 : _h.value));
                    }
                    else if (type === 'kick') {
                        pmember.kick(strCheck((_j = interaction.options.get('reason')) === null || _j === void 0 ? void 0 : _j.value));
                    }
                    i.reply({ embeds: [embed], content: `<@${pmember.id}> A punishment has been issued.` });
                    data.warnings.push(log);
                    exports.write(data);
                }
                else {
                    i.update({ content: "Could not manage user." });
                }
            }
            else {
                i.update('type error 1');
            }
        });
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
    let embed = new EmbedBuilder()
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
