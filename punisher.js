"use strict";
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var _a = require('discord.js'), MessageActionRow = _a.MessageActionRow, MessageButton = _a.MessageButton, MessageEmbed = _a.MessageEmbed;
var fs = require('fs');
var typecheck_1 = require("./typecheck");
var PendingPunishments = [];
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
    var mod = interaction.member;
    var user = (_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.member;
    if (user instanceof discord_js_1.GuildMember && mod instanceof discord_js_1.GuildMember) {
        var embed = new MessageEmbed()
            .setTitle(interaction.options.getSubcommand())
            .setDescription((_b = interaction.options.get('reason')) === null || _b === void 0 ? void 0 : _b.value)
            .addFields([{ name: "".concat(user.displayName, " | ").concat(user.id), value: "PID: ".concat(require('./punishments.json').warnings.length) }])
            .setTimestamp(Date.now())
            .setFooter("Case Mod: ".concat(mod.displayName));
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
    var member = interaction.member;
    var data = exports.get();
    var date = new Date();
    if (member instanceof discord_js_1.GuildMember) {
        var id_1 = member.id;
        var acase_1 = PendingPunishments.find(function (acase) { return acase.id == id_1; });
        if (acase_1) {
            var pmember = (_a = acase_1 === null || acase_1 === void 0 ? void 0 : acase_1.data.get('user')) === null || _a === void 0 ? void 0 : _a.member;
            if (pmember instanceof discord_js_1.GuildMember) {
                var replied = false;
                var type = acase_1 === null || acase_1 === void 0 ? void 0 : acase_1.data.getSubcommand();
                var embed = new MessageEmbed()
                    .setTitle(type)
                    .setDescription((_b = acase_1 === null || acase_1 === void 0 ? void 0 : acase_1.data.get('reason')) === null || _b === void 0 ? void 0 : _b.value)
                    .addFields([{ name: "".concat(pmember.displayName), value: "PID: ".concat(require('./punishments.json').warnings.length) }])
                    .setTimestamp(Date.now())
                    .setFooter("Case Mod: ".concat(member.displayName));
                var log = { "pid": data.warnings.length, "id": (_d = (_c = acase_1.data.get('user')) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id, "epoch": date.getTime(), "reason": (_e = acase_1.data.get('reason')) === null || _e === void 0 ? void 0 : _e.value, "type": type, "time": undefined };
                console.log('ModCheck');
                if (pmember.moderatable) {
                    console.log('Moddable');
                    if (type === 'ban') {
                        pmember.ban({ days: (0, typecheck_1.numCheck)((_f = acase_1.data.get('messageremove')) === null || _f === void 0 ? void 0 : _f.value), reason: (_g = acase_1 === null || acase_1 === void 0 ? void 0 : acase_1.data.get('reason')) === null || _g === void 0 ? void 0 : _g.value.toString() });
                    }
                    else if (type === 'timeout') {
                        pmember.timeout((0, typecheck_1.numCheck)((_h = acase_1.data.get('time')) === null || _h === void 0 ? void 0 : _h.value) * 60000, (0, typecheck_1.strCheck)((_j = acase_1 === null || acase_1 === void 0 ? void 0 : acase_1.data.get('reason')) === null || _j === void 0 ? void 0 : _j.value));
                    }
                    else if (type === 'kick') {
                        pmember.kick((0, typecheck_1.strCheck)((_k = acase_1 === null || acase_1 === void 0 ? void 0 : acase_1.data.get('reason')) === null || _k === void 0 ? void 0 : _k.value));
                    }
                    interaction.reply({ embeds: [embed], content: "<@".concat(pmember.id, "> A punishment has been issued.") });
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
            PendingPunishments.splice(PendingPunishments.findIndex(function (bcase) { return bcase == acase_1; }), 1);
        }
        else {
            interaction.reply({ content: 'Case not found.', ephemeral: true });
        }
    }
    else {
        interaction.reply({ content: 'type error 0', ephemeral: true });
    }
};
