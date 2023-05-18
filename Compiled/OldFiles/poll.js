"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs = require('fs');
let timeouts = [];
let client;
exports.setup = function setup(client1) {
    client = client1;
    StartTimers();
};
function write(polls) {
    fs.writeFileSync("./polls.json", JSON.stringify(polls));
}
function read() {
    return require("./polls.json");
}
function endPoll(poll) {
    return __awaiter(this, void 0, void 0, function* () {
        if (client instanceof discord_js_1.Client) {
            let channel = client.channels.cache.get(poll.chan);
            if (channel instanceof discord_js_1.TextChannel && client.user) {
                let msg = yield channel.messages.fetch(poll.id ? poll.id : '1067633299197001768');
                let string;
                if (poll.u > poll.d) {
                    string = 'Community Approval';
                }
                else if (poll.u < poll.d) {
                    string = 'Community Disapproval';
                }
                else {
                    string = 'Community Mixed Approval';
                }
                if (msg && msg.embeds) {
                    const embed = new discord_js_1.EmbedBuilder()
                        .setAuthor({ name: "Total Votes- " + poll.voters.length })
                        .setTitle(msg.embeds[0].title)
                        .setDescription(msg.embeds[0].description)
                        .addFields([{ name: "Poll Closed", value: string }])
                        .setFooter({ text: "Bot managed by the ministry." });
                    const row = new discord_js_1.ActionRowBuilder()
                        .addComponents(new discord_js_1.ButtonBuilder()
                        .setCustomId('y')
                        .setLabel(Math.round(poll.u / poll.voters.length) * 100 + '%')
                        .setStyle(discord_js_1.ButtonStyle.Success)
                        .setEmoji('814199679704891423')
                        .setDisabled(true))
                        .addComponents(new discord_js_1.ButtonBuilder()
                        .setCustomId('n')
                        .setLabel(Math.round(poll.d / poll.voters.length) * 100 + '%')
                        .setStyle(discord_js_1.ButtonStyle.Danger)
                        .setEmoji('814199666778308638')
                        .setDisabled(true));
                    yield msg.edit({ embeds: [embed], components: [row] });
                    let polls = read();
                    polls.polls.splice(polls.polls.indexOf(poll), 1);
                    write(polls);
                }
            }
        }
    });
}
function StartTimers() {
    let polls = require("./polls.json");
    polls.polls.forEach((poll) => {
        let timeout = {
            "timeout": setTimeout(() => { endPoll(poll); }, poll.end * 1000 - Date.now()),
            "poll": poll
        };
        timeouts.push(timeout);
    });
}
function toSeconds(string) {
    const lastChar = string.length - 1;
    if (string.charAt(lastChar) == "h") {
        return parseFloat(string) * 3600;
    }
    else if (string.charAt(lastChar) == "m") {
        return parseFloat(string) * 60;
    }
    else if (string.charAt(lastChar) == "s") {
        return parseFloat(string);
    }
    else if (string.charAt(lastChar) == "d") {
        return parseFloat(string) * 86400;
    }
    else {
        return parseFloat(string);
    }
}
exports.createPoll = function createPoll(interaction) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferReply();
        let channel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get((_b = interaction.options.get('channel')) === null || _b === void 0 ? void 0 : _b.value);
        if (channel instanceof discord_js_1.TextChannel && client && ((_c = client.user) === null || _c === void 0 ? void 0 : _c.id)) {
            if ((_e = channel.guild.members.cache.get((_d = client.user) === null || _d === void 0 ? void 0 : _d.id)) === null || _e === void 0 ? void 0 : _e.permissions.has(['ViewChannel', 'ReadMessageHistory', 'SendMessages', 'EmbedLinks'])) {
                let time = toSeconds((_f = interaction.options.get('time')) === null || _f === void 0 ? void 0 : _f.value);
                if (30 < time) {
                    let polls = read();
                    let pollobj = { u: 0, d: 0, id: '', voters: [], chan: channel.id, end: time + Math.floor(Date.now() / 1000) };
                    interaction.editReply(`Starting a poll in ${channel.id} until ${new Date(pollobj.end * 1000).toLocaleString('en-us', { timeZoneName: 'short' }).replace(/:\d{2}\s/, ' ')}.`);
                    const embed = new discord_js_1.EmbedBuilder()
                        .setAuthor({ name: "Total Votes- 0" })
                        .setTitle((_g = interaction.options.get('title')) === null || _g === void 0 ? void 0 : _g.value)
                        .setDescription((_h = interaction.options.get('description')) === null || _h === void 0 ? void 0 : _h.value)
                        .setFooter({ text: "Bot managed by the ministry." });
                    const row = new discord_js_1.ActionRowBuilder()
                        .addComponents(new discord_js_1.ButtonBuilder()
                        .setCustomId('y')
                        .setLabel('0%')
                        .setStyle(discord_js_1.ButtonStyle.Success)
                        .setEmoji('814199679704891423'))
                        .addComponents(new discord_js_1.ButtonBuilder()
                        .setCustomId('n')
                        .setLabel('0%')
                        .setStyle(discord_js_1.ButtonStyle.Danger)
                        .setEmoji('814199666778308638'));
                    let msg = yield channel.send({ embeds: [embed], components: [row] });
                    pollobj.id = msg.id;
                    polls.polls.push(pollobj);
                    write(polls);
                    let timeout = {
                        "timeout": setTimeout(() => { endPoll(pollobj); }, pollobj.end * 1000 - Date.now()),
                        "poll": pollobj
                    };
                    timeouts.push(timeout);
                }
            }
            else {
                yield interaction.editReply("**Channel Error-** Insufficient Permission \n Required: ['VIEW_CHANNEL','READ_MESSAGE_HISTORY','SEND_MESSAGES','EMBED_LINKS']");
            }
        }
        else {
            yield interaction.editReply("**Channel Error-** The channel requested is not text based");
        }
    });
};
exports.vote = function vote(interaction) {
    let polls = read();
    let poll = polls.polls.find((poll) => poll.id == interaction.message.id);
    if (poll.voters.includes(interaction.user.id)) {
        interaction.reply({ ephemeral: true, content: "You cannot vote twice on the same poll" });
    }
    else {
        poll.voters.push(interaction.user.id);
        if (interaction.customId.startsWith("y")) {
            poll.u = poll.u + 1;
        }
        else if (interaction.customId.startsWith("n")) {
            poll.d = poll.d + 1;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: "Total Votes- " + poll.voters.length })
            .setTitle(interaction.message.embeds[0].title)
            .setDescription(interaction.message.embeds[0].description)
            .setFooter({ text: "Bot managed by the ministry." });
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('y')
            .setLabel(Math.round((poll.u / poll.voters.length) * 100) + '%')
            .setStyle(discord_js_1.ButtonStyle.Success)
            .setEmoji('814199679704891423'))
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('n')
            .setLabel(Math.round((poll.d / poll.voters.length) * 100) + '%')
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setEmoji('814199666778308638'));
        interaction.reply({ ephemeral: true, content: "Succesfully Voted" });
        interaction.message.edit({ embeds: [embed], components: [row] });
        write(polls);
    }
};
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
// client.on('ready', async () => {
//   client.guilds.cache.forEach((guild: { commands: { set: (arg0: any) => void; }; }) => {
//     try { guild.commands.set(command) } catch (err) { console.log(err) }
//   })
//   StartTimers()
// })
// client.on("interactionCreate", async (interaction: { isCommand: () => any; commandName: string; deferReply: () => any; reply: (arg0: { components: any[]; content: string; }) => any; isButton: () => any; customId: string; message: { id: any; }; }) => {
//   if (interaction.isCommand()) {
//     if (interaction.commandName === "createpoll") {
//       await interaction.deferReply()
//       createPoll(interaction)
//     } else if (r) {
//       let row = new MessageActionRow()
//         .addComponents(
//           new MessageButton()
//             .setLabel("Invite")
//             .setStyle('LINK')
//             .setURL("https://discord.com/api/oauth2/authorize?client_id=585248628281573397&permissions=8&scope=applications.commands%20bot")
//         )
//       await interaction.reply({ components: [row], content: "Click button to invite the bot." })
//     }
//   } else if (interaction.isButton()) {
//     if (interaction.customId.startsWith("y") || interaction.customId.startsWith("n")) {
//       console.log(interaction.message.id)
//       vote(interaction)
//     }
//   }
// })
// client.login(require("./config.json").token2);
