"use strict";
exports.__esModule = true;
var _a = require('discord.js'), MessageActionRow = _a.MessageActionRow, MessageButton = _a.MessageButton;
var fs = require('fs');
exports.write = function write(file) {
    fs.writeFileSync('./punishments.json', JSON.stringify(file));
};
exports.get = function read() {
    return require("./punishments.json");
};
exports.punish = function punish(interaction) {
    var _a, _b, _c, _d, _e, _f, _g;
    var data = exports.get();
    var date = new Date();
    var options = interaction.options;
    data.warnings.push({ "pid": data.warnings.length, "id": (_b = (_a = options.get('user')) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id, "epoch": date.getTime(), "reason": (_c = interaction.options.get('reason')) === null || _c === void 0 ? void 0 : _c.value });
    exports.write(data);
    interaction.reply({
        content: "User To Be Punished: ".concat((_e = (_d = options.get('user')) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.username, "\nType: ").concat((_f = options.get('type')) === null || _f === void 0 ? void 0 : _f.value, "\nReason: ").concat((_g = interaction.options.get('reason')) === null || _g === void 0 ? void 0 : _g.value, "\nDate: ").concat(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()),
        components: [new MessageActionRow()
                .addComponents(new MessageButton()
                .setCustomId('punish')
                .setLabel('Smite Thou Sinner')
                .setStyle('SUCCESS'))
        ]
    });
};
