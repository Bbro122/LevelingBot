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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const canvas_1 = __importDefault(require("canvas"));
let fs = require('fs');
const client = new discord_js_1.Client({ partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction, discord_js_1.Partials.GuildMember, discord_js_1.Partials.User], intents: 131071 });
let xp = require('./xpmanager.js');
let game = require('./gamemanager.js');
let axios = require('axios');
let config = require("./config.json");
let medals = ['🥇', '🥈', '🥉'];
let charMap = "`~1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]};:'.>,<qwertyuiopasdfghjklzxcvbnm /?|" + '"';
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
let reply = {
    silent: function (interaction, reply) {
        interaction.reply({ content: reply, ephemeral: true });
    },
    error: function (interaction, error) {
        interaction.reply({ content: `**Error |** ${error}`, ephemeral: true });
    },
    embed: function (interaction, embed) {
        interaction.reply({ embeds: [embed] });
    }
};
function remainingTime(milliseconds) {
    let string = '';
    if (milliseconds > 3600000) {
        string = `${Math.floor(milliseconds / 3600000)} hour(s)`;
        if (Math.floor((milliseconds - (Math.floor(milliseconds / 3600000) * 3600000)) / 60000) > 0) {
            string = string + ` ${Math.floor((milliseconds - (Math.floor(milliseconds / 3600000) * 3600000)) / 60000)} minute(s)`;
        }
    }
    else if (milliseconds > 60000) {
        string = `${Math.floor(milliseconds / 60000)} minute(s)`;
        if (Math.floor((milliseconds - (Math.floor(milliseconds / 60000) * 60000)) / 1000) > 0) {
            string = string + ` ${Math.floor((milliseconds - (Math.floor(milliseconds / 60000) * 60000)) / 1000)} seconds`;
        }
    }
    else if (milliseconds > 1000) {
        string = `${Math.floor(milliseconds / 1000)} seconds`;
    }
    else {
        return `${milliseconds} milliseconds`;
    }
    return string;
}
function strCheck(str) {
    if (typeof str == 'string') {
        return str;
    }
    else {
        return '';
    }
}
function checkOwner(interaction, reply) {
    var _a;
    let permissions = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions;
    if (permissions && typeof permissions != 'string') {
        if (permissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            return true;
        }
        else {
            if (reply) {
                interaction.reply("This command is reserved for Ministry usage only.");
            }
            return false;
        }
    }
}
function getWelcomeBanner(imagelink) {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = canvas_1.default.createCanvas(1200, 300);
        let context = canvas.getContext('2d');
        context.drawImage(yield canvas_1.default.loadImage(imagelink), 478, 51, 203, 203);
        context.drawImage(yield canvas_1.default.loadImage('./welcome.png'), 0, 0, 1200, 300);
        return canvas.toBuffer('image/png');
    });
}
function getImage(exp, requirement, username, number, level, imagelink, rank, ministry, namecard) {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = canvas_1.default.createCanvas(1200, 300);
        let context = canvas.getContext('2d');
        context.fillStyle = '#171717';
        context.fillRect(0, 0, 1200, 300);
        context.fillStyle = '#171717';
        context.fillRect(325, 200, 800, 50);
        context.fillStyle = '#00EDFF';
        context.fillRect(325, 200, Math.round((exp - xp.level(level - 1)) / (requirement - xp.level(level - 1)) * 800), 50);
        context.drawImage(yield canvas_1.default.loadImage(imagelink), 50, 50, 200, 200);
        //if (ministry) { context.drawImage(await can.loadImage('./MinistrySymbol.png'), 500, 71, 26, 30); context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300) }
        //else if (overwatch) { context.drawImage(await can.loadImage('./namecards/overwatch.png'), 0, 0, 1200, 300) }
        //else { context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300) }
        console.log(namecard);
        if (namecard) {
            context.drawImage(yield canvas_1.default.loadImage((namecard && typeof namecard == 'string') ? namecard : './namecards/ministry.png'), 0, 0, 1200, 300);
        }
        else {
            if (ministry) {
                context.drawImage(yield canvas_1.default.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300);
            }
            else {
                context.drawImage(yield canvas_1.default.loadImage('./namecards/default.png'), 0, 0, 1200, 300);
            }
        }
        context.fillStyle = '#ffffff';
        context.font = '40px Arial';
        context.fillText(`Rank #${rank}`, 325, 100);
        context.fillText(username, 325, 190);
        let wid = context.measureText(username).width;
        context.font = '30px Arial';
        context.fillText(number, 335 + wid, 192);
        context.fillText(`${exp - xp.level(level - 1)} / ${requirement - xp.level(level - 1)} XP`, 1125 - context.measureText(`${exp - xp.level(level - 1)} / ${requirement - xp.level(level - 1)} XP`).width, 192);
        context.fillStyle = '#00EDFF';
        context.fillText("Level", 960, 75);
        context.font = '60px Arial';
        context.fillText(level, 1043, 75);
        return canvas.toBuffer('image/png');
    });
}
function checkMap(str) {
    let value = true;
    charMap.toLowerCase().split('').forEach(char => {
        if (char == str) {
            console.log(char);
            value = false;
        }
    });
    return value;
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('guildMemberAdd', (member) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let guild = member.guild;
    let mainchat = member.guild.channels.cache.get('632995958950723584');
    let url = member.displayAvatarURL().replace('webp', 'png');
    if (url) {
        getWelcomeBanner(url).then(buffer => {
            if (mainchat && mainchat instanceof discord_js_1.TextChannel) {
                const attachment = new discord_js_1.AttachmentBuilder(buffer);
                mainchat.send({ content: `<@${member.id}> has joined the server.`, files: [attachment] });
            }
        });
    }
    let members = 0;
    yield guild.members.fetch();
    guild.members.cache.forEach(member => {
        if (!member.user.bot) {
            members++;
        }
    });
    if (!guild.channels.cache.find(chan => chan.name.startsWith('User-Count'))) {
        yield guild.channels.create({ name: `User-Count-${members}`, type: discord_js_1.ChannelType.GuildVoice, permissionOverwrites: [{ id: guild.roles.everyone.id, deny: [discord_js_1.PermissionFlagsBits.Connect] }] });
    }
    else {
        (_a = guild.channels.cache.find(chan => chan.name.startsWith('User-Count'))) === null || _a === void 0 ? void 0 : _a.setName(`User-Count-${members}`);
    }
}));
client.on('userUpdate', (oldUser, newUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let member = (_b = client.guilds.cache.get(config.server.mainserver)) === null || _b === void 0 ? void 0 : _b.members.cache.get(newUser.id);
    if (member && member.manageable && !member.nickname && checkMap(member.displayName.charAt(0))) {
        //member.setNickname(`[p] ${member.displayName}`)
        //member.createDM().then(async channel => {
        //try { await channel.send('Your nickname or username change was unpingable, and a pingable nickname was automatically given in the Wolf-Co Server.') }
        //catch (err) { console.log(err) }
        //})
    }
}));
client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (newMember && newMember.manageable && checkMap(newMember.displayName.charAt(0))) {
        //newMember.setNickname(`[p] ${newMember.displayName}`)
        //newMember.createDM().then(async channel => {
        //try { await channel.send('Your nickname or username change was unpingable, and a pingable nickname was automatically given in the Wolf-Co Server.') }
        //catch (err) { console.log(err) }
        //})
    }
});
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    require('./poll.js').setup(client);
    client.guilds.cache.forEach((guild) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        yield guild.members.fetch();
        let members = 0;
        guild.members.cache.forEach(member => {
            if (!member.user.bot) {
                members++;
            }
        });
        if (!guild.channels.cache.find(chan => chan.name.startsWith('User-Count'))) {
            yield guild.channels.create({ name: `User-Count-${members}`, type: discord_js_1.ChannelType.GuildVoice, permissionOverwrites: [{ id: guild.roles.everyone.id, deny: [discord_js_1.PermissionFlagsBits.Connect] }] });
        }
        else {
            (_d = guild.channels.cache.find(chan => chan.name.startsWith('User-Count'))) === null || _d === void 0 ? void 0 : _d.setName(`User-Count-${members}`);
        }
    }));
    let mainserver = client.guilds.cache.get(config.server.mainserver);
    let gamechannel = client.channels.cache.get(config.server.gamechannel);
    (_c = client.application) === null || _c === void 0 ? void 0 : _c.commands.set(require('./commands.json'));
    if (mainserver && gamechannel) {
        game.setup(client, gamechannel);
        xp.setup(client);
        mainserver.members.cache.forEach(user => {
            xp.ranks.evaluate(user.id);
        });
        if (config.server.game) {
            game.selGame();
        }
        if (config.server.bounties) {
            console.log("test");
            let bountychan = client.channels.cache.get('1081435587422203904');
            if (bountychan) {
                require('./bountycheck.js').sync(bountychan);
            }
            else {
                require('./bountycheck.js').sync(gamechannel);
            }
        }
    }
    else {
        console.log("Game and Xp initialization failed.");
    }
}));
client.on('messageCreate', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    if (((_e = msg.guild) === null || _e === void 0 ? void 0 : _e.id) == config.server.mainserver && msg.channel.isTextBased()) {
        if (msg.author.bot == false) {
            if (msg.content.length > 5) {
                xp.give({ author: msg.author, channel: msg.channel }, 15 + Math.floor(Math.random() * 10), true);
            }
            if (msg.channel.id == config.server.gamechannel && msg.content.length >= 1) {
                game.checkWord(msg);
            }
            else if (msg.channel.id == config.server.countchannel) {
                require('./counting.js')(client, msg);
            }
        }
        else if (msg.author.id == ((_f = client.user) === null || _f === void 0 ? void 0 : _f.id) && msg.channel.id == '1001697908636270602' && msg.content.startsWith('givexp')) {
            let args = msg.content.split(' ').splice(0, 1);
            let id = args[0];
            if (id !== 'null' && msg.channel instanceof discord_js_1.TextChannel) {
                if (args[1] == 'chat') {
                    xp.give({ author: msg.author, channel: msg.channel }, 0.5, false);
                    msg.channel.send('giving 0.5 xp');
                }
                else if (args[1] == 'login') {
                    xp.give({ author: msg.author, channel: msg.channel }, 15 + Math.floor(Math.random() * 10), true);
                    msg.channel.send('giving 15-25 xp');
                }
            }
            else {
                if (msg.channel instanceof discord_js_1.TextChannel) {
                    msg.channel.send('id is null');
                }
            }
        }
    }
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case 'addbounty':
                {
                    yield interaction.deferReply();
                    let username = (_g = interaction.options.get('username')) === null || _g === void 0 ? void 0 : _g.value;
                    if (typeof username == 'string' && username.length >= 3) {
                        let uuidData;
                        let uuid;
                        try {
                            uuidData = yield axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
                            uuid = uuidData.data.id;
                        }
                        catch (error) {
                            interaction.editReply('**Error**: Username not found or API is down.');
                            return;
                        }
                        if (uuid) {
                            let hypixelresponse = yield axios.get(`https://api.hypixel.net/player?key=0980e33a-8052-4c48-aca7-2117c200ba09&uuid=${uuid}`);
                            //await interaction.followUp(hypixelresponse.data.player.lastLogin.toString())
                            let data = require('./bountydata.json');
                            if (data.users.find(user => user.uuid == uuid)) {
                                let user = data.users.find(user => user.uuid == uuid);
                                if (user === null || user === void 0 ? void 0 : user.trackers.includes(interaction.user.id)) {
                                    yield interaction.editReply("You're already tracking this user");
                                }
                                else {
                                    user === null || user === void 0 ? void 0 : user.trackers.push(interaction.user.id);
                                    fs.writeFileSync('./bountydata.json', JSON.stringify(data));
                                    interaction.editReply(`You're now tracking ${hypixelresponse.data.player.displayname}'s bounty.\nYou'll be pinged up to 5 minutes after they log on`);
                                }
                            }
                            else {
                                let bounty = { trackers: [interaction.user.id], uuid: uuid, lastLogin: hypixelresponse.data.player.lastLogin };
                                data.users.push(bounty);
                                fs.writeFileSync('./bountydata.json', JSON.stringify(data));
                                interaction.editReply(`**Bounty Posted:** ${hypixelresponse.data.player.displayname}\nYou'll be pinged up to 5 minutes after they log on`);
                            }
                        }
                        else {
                            yield interaction.editReply(`Failure\n${uuid}`);
                        }
                    }
                }
                //https://api.hypixel.net/player?key=0980e33a-8052-4c48-aca7-2117c200ba09&uuid=2cbf357d50384115a868e4dfd6c7538b
                break;
            case 'removebounty':
                {
                    yield interaction.deferReply();
                    let username = (_h = interaction.options.get('username')) === null || _h === void 0 ? void 0 : _h.value;
                    if (typeof username == 'string' && username.length >= 3) {
                        let uuidData;
                        let uuid;
                        try {
                            uuidData = yield axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
                            uuid = uuidData.data.id;
                        }
                        catch (error) {
                            interaction.editReply('**Error**: Username not found or API is down.');
                            return;
                        }
                        if (uuid) {
                            let data = require('./bountydata.json');
                            let user = data.users.find(user => user.uuid == uuid);
                            if (user && user.trackers.includes(interaction.user.id)) {
                                if ((user === null || user === void 0 ? void 0 : user.trackers.length) > 1) {
                                    user.trackers.splice(user.trackers.indexOf(interaction.user.id), 1);
                                    interaction.editReply(`No longer tracking ${username}'s bounty.`);
                                }
                                else {
                                    data.users.splice(data.users.indexOf(user), 1);
                                    interaction.editReply(`**Bounty Removed**: ${username}`);
                                }
                                fs.writeFileSync('./bountydata.json', JSON.stringify(data));
                            }
                            else {
                                interaction.editReply("Could not find the requested bounty, or you are not tracking that bounty.");
                            }
                        }
                    }
                }
                break;
            case 'boostingsince':
                {
                    let member = (_j = interaction.options.get('user')) === null || _j === void 0 ? void 0 : _j.member;
                    if (member instanceof discord_js_1.GuildMember) {
                        interaction.reply(member.premiumSinceTimestamp ? member.premiumSinceTimestamp.toString() : '0');
                    }
                    else {
                        interaction.reply('No');
                        console.log(member);
                    }
                }
                break;
            case 'level':
                {
                    yield interaction.deferReply();
                    let data = xp.get();
                    let user;
                    let member = (_k = interaction.options.get('user')) === null || _k === void 0 ? void 0 : _k.member;
                    if (member instanceof discord_js_1.GuildMember) {
                        user = data.users.find(user => { var _a; return user.id == ((_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.value); });
                    }
                    else {
                        member = interaction.member;
                        user = data.users.find(user => user.id == interaction.user.id);
                    }
                    if (member instanceof discord_js_1.GuildMember) {
                        let data2 = xp.get().users.sort((a, b) => { return b.xp - a.xp; });
                        data2.findIndex(user2 => user2 == user);
                        if (user) {
                            getImage(user.xp, xp.level(user.level), member.user.username, member.user.discriminator, user.level, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(user2 => user2 == user) + 1, (member.roles instanceof discord_js_1.GuildMemberRoleManager) ? member.roles.cache.has('785054691008577536') : false, user.namecard).then(buffer => {
                                const attachment = new discord_js_1.AttachmentBuilder(buffer);
                                interaction.editReply({ files: [attachment] });
                            });
                        }
                        else {
                            getImage(55, xp.level(0), member.user.username, member.user.discriminator, 0, member.displayAvatarURL().replace('webp', 'png'), data2.findIndex(user2 => user2 == user) + 1, (member.roles instanceof discord_js_1.GuildMemberRoleManager) ? member.roles.cache.has('785054691008577536') : false, undefined).then(buffer => {
                                const attachment = new discord_js_1.AttachmentBuilder(buffer);
                                interaction.editReply({ files: [attachment] });
                            });
                        }
                    }
                }
                break;
            case 'create':
                {
                    require('./UnoMaster.js').startNewGame(interaction);
                }
                break;
            case 'leaderboard':
                {
                    yield ((_l = interaction.guild) === null || _l === void 0 ? void 0 : _l.members.fetch());
                    if (((_m = interaction.options.get('type')) === null || _m === void 0 ? void 0 : _m.value) == 'xp') {
                        let data = xp.get().users.sort((a, b) => { return b.xp - a.xp; });
                        let fields = [];
                        for (let i = 0; i <= 9; i++) {
                            if ((_o = interaction.guild) === null || _o === void 0 ? void 0 : _o.members.cache.get(data[i].id)) {
                                fields.push({ "name": `${medals[i] ? medals[i] : (i + 1)} | ${(_p = interaction.guild.members.cache.get(data[i].id)) === null || _p === void 0 ? void 0 : _p.displayName} (${data[i].level})`, "value": `Xp: ${data[i].xp}`, "inline": false });
                            }
                            else {
                                fields.push({ "name": `${medals[i] ? medals[i] : (i + 1)} | <@${data[i].id}>`, "value": `Xp: ${data[i].xp}`, "inline": false });
                            }
                        }
                        let embed = new discord_js_1.EmbedBuilder()
                            .setTitle('XP Leaderboard')
                            .addFields(fields);
                        interaction.reply({ embeds: [embed] });
                    }
                    else {
                        let data = xp.get().users.sort((a, b) => { return b.gems - a.gems; });
                        let fields = [];
                        for (let i = 0; i <= 9; i++) {
                            if ((_q = interaction.guild) === null || _q === void 0 ? void 0 : _q.members.cache.get(data[i].id)) {
                                fields.push({ "name": `${medals[i] ? medals[i] : (i + 1)} | ${(_r = interaction.guild.members.cache.get(data[i].id)) === null || _r === void 0 ? void 0 : _r.displayName} (${data[i].level})`, "value": `Gems: ${data[i].gems}`, "inline": false });
                            }
                            else {
                                fields.push({ "name": `${medals[i] ? medals[i] : (i + 1)} | <@${data[i].id}>`, "value": `Gems: ${data[i].gems}`, "inline": false });
                            }
                        }
                        let embed = new discord_js_1.EmbedBuilder()
                            .setTitle('Gem Leaderboard')
                            .addFields(fields);
                        interaction.reply({ embeds: [embed] });
                    }
                }
                break;
            case 'daily':
                {
                    let data = xp.get();
                    if (interaction.channel) {
                        xp.give({ author: interaction.user, channel: interaction.channel }, 0);
                        let user = data.users.find(prof => prof.id == interaction.user.id);
                        if (user) {
                            if (Date.now() > user.epoch) {
                                let gems = Math.round(Math.random() * 10) + 10;
                                let exp = Math.round(Math.random() * 25) + 25;
                                user.epoch = Date.now() + 64800000;
                                xp.give({ author: interaction.user, channel: interaction.channel }, exp);
                                xp.giveGems(user.id, gems);
                                interaction.reply(`You earned ${gems} gems, and ${exp} experience.`);
                                xp.write(data);
                            }
                            else {
                                reply.silent(interaction, `you can run this command again in ${remainingTime(user.epoch - Date.now())}`);
                            }
                        }
                        else {
                            reply.error(interaction, 'User Error');
                        }
                    }
                    else {
                        reply.error(interaction, 'Channel Error');
                    }
                }
                break;
            case 'flip':
                {
                    let bet = (_s = interaction.options.get('amount')) === null || _s === void 0 ? void 0 : _s.value;
                    let data = xp.get();
                    let user = data.users.find(prof => prof.id == interaction.user.id);
                    let timeout = xp.timeouts().find(timeout => timeout.id == interaction.user.id && timeout.type == 'flipCD');
                    if (timeout) {
                        reply.error(interaction, `You can't use this command for ${remainingTime(timeout.endTime - Date.now())}`);
                    }
                    else {
                        if (typeof bet == 'number' && bet >= 25) {
                            if (user && user.gems >= bet && interaction.channel) {
                                xp.timeout(interaction.user.id, 'flipCD', 120000);
                                if (Math.round(Math.random())) {
                                    xp.giveGems(user.id, bet);
                                    interaction.reply(`<a:showoff:1004215186439274516> You won ${bet} gems!`);
                                }
                                else {
                                    xp.giveGems(user.id, -bet);
                                    interaction.reply(`<:kek:1004270229397970974> You lost ${-bet} gems.`);
                                }
                            }
                            else {
                                reply.error(interaction, 'You do not have enough gems for this bet.');
                            }
                        }
                        else {
                            reply.error(interaction, 'The Minimum bet is 25 gems.');
                        }
                    }
                }
                break;
            case 'gems':
                {
                    let data = xp.get();
                    let user;
                    if ((_t = interaction.options.get('user')) === null || _t === void 0 ? void 0 : _t.user) {
                        user = data.users.find(user => { var _a, _b; return user.id == ((_b = (_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id); });
                        if (user) {
                            interaction.reply(`<a:showoff:1004215186439274516> They have ${user.gems} gems.`);
                        }
                        else {
                            interaction.reply(`<:kek:1004270229397970974> This guy is broke.`);
                        }
                    }
                    else {
                        user = data.users.find(user => user.id == interaction.user.id);
                        if (user) {
                            interaction.reply(`<a:showoff:1004215186439274516> You have ${user.gems} gems.`);
                        }
                        else {
                            interaction.reply(`<:kek:1004270229397970974> You're broke.`);
                        }
                    }
                }
                break;
            case 'items':
                {
                    let data = xp.get();
                    let user = data.users.find(user => user.id == interaction.user.id);
                    if (user && user.items.length > 0 && interaction.channel instanceof discord_js_1.TextChannel) {
                        let fields = [];
                        let nameoptions = [];
                        let boostoptions = [];
                        let embed = new discord_js_1.EmbedBuilder()
                            .setTitle('Inventory')
                            .setDescription('View all your items here.\nUse the select menu to use an item.');
                        const row = new discord_js_1.ActionRowBuilder()
                            .addComponents(new discord_js_1.ButtonBuilder()
                            .setCustomId('namecard')
                            .setStyle(discord_js_1.ButtonStyle.Primary)
                            .setLabel('Set Namecard'), new discord_js_1.ButtonBuilder()
                            .setCustomId('booster')
                            .setStyle(discord_js_1.ButtonStyle.Primary)
                            .setLabel('Use booster'));
                        user.items.forEach(item => {
                            fields.push(item.display);
                            if (item.type == 'booster') {
                                boostoptions.push({ label: item.display.name, description: item.display.value, value: user === null || user === void 0 ? void 0 : user.items.findIndex(sitem => sitem == item).toString() });
                            }
                            else if (item.type == 'namecard') {
                                nameoptions.push({ label: item.display.name, description: item.display.value, value: user === null || user === void 0 ? void 0 : user.items.findIndex(sitem => sitem == item).toString() });
                            }
                        });
                        //const row = new MessageActionRow()
                        //  .addComponents(
                        //    new MessageSelectMenu()
                        //      .setCustomId('use')
                        //    .addOptions(options)
                        //  .setMinValues(1)
                        //.setMaxValues(1)
                        // )
                        embed.setFields(fields);
                        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
                        let collector = (_u = interaction.channel) === null || _u === void 0 ? void 0 : _u.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, filter: i => i.user.id == interaction.user.id, time: 60000, max: 1 });
                        collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
                            var _5;
                            if (i.customId == 'namecard') {
                                let embed = new discord_js_1.EmbedBuilder()
                                    .setTitle('Namecard Inventory')
                                    .setDescription('Use the selector menu below to equip a namecard.');
                                const row = new discord_js_1.ActionRowBuilder()
                                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                                    .setCustomId('usenamecard')
                                    .addOptions(nameoptions));
                                i.reply({ embeds: [embed], components: [row], ephemeral: true });
                                if (i.channel instanceof discord_js_1.StageChannel) {
                                    return;
                                }
                                let collect = (_5 = i.channel) === null || _5 === void 0 ? void 0 : _5.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, filter: (a) => a.user.id == i.user.id, time: 60000, max: 1 });
                                if (collect) {
                                    collect.on('collect', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
                                        let data = xp.get();
                                        let user = data.users.find(user => user.id == interaction.user.id);
                                        if (user) {
                                            let file = user.items[typeof parseInt(interaction.values[0]) == 'number' ? parseInt(interaction.values[0]) : 0].data.file;
                                            if (file) {
                                                user.namecard = file;
                                                xp.write(data);
                                                interaction.reply({ ephemeral: true, content: 'Sucessfully set namecard' });
                                            }
                                            else {
                                                reply.error(interaction, 'File not found');
                                            }
                                        }
                                    }));
                                }
                                else {
                                    i.followUp('error');
                                }
                            }
                            else if (i.customId == 'booster') {
                                let embed = new discord_js_1.EmbedBuilder()
                                    .setTitle('Booster Inventory')
                                    .setDescription('Use the selector menu below to use a booster.');
                                const row = new discord_js_1.ActionRowBuilder()
                                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                                    .setCustomId('use')
                                    .addOptions(boostoptions));
                                i.reply({ embeds: [embed], components: [row], ephemeral: true });
                            }
                        }));
                    }
                }
                break;
            case 'rule':
                {
                    let rule = strCheck((_v = interaction.options.get('rule')) === null || _v === void 0 ? void 0 : _v.value);
                    let embed = new discord_js_1.EmbedBuilder()
                        .setTitle(interaction.options.getSubcommand())
                        .setDescription(rule);
                    reply.embed(interaction, embed);
                }
                break;
            case 'cat':
                {
                    yield interaction.deferReply();
                    let cat;
                    try {
                        cat = yield axios.get('https://api.thecatapi.com/v1/images/search');
                    }
                    catch (error) {
                        interaction.editReply({ content: "Could not find any cats to show." });
                        return;
                    }
                    let url = cat.data[0].url;
                    const attachment = new discord_js_1.AttachmentBuilder(url);
                    interaction.editReply({ files: [attachment] });
                }
                break;
            case 'dog':
                {
                    yield interaction.deferReply();
                    let cat;
                    try {
                        cat = yield axios.get('https://dog.ceo/api/breeds/image/random');
                    }
                    catch (error) {
                        interaction.editReply({ content: "Could not find any dogs to show." });
                        return;
                    }
                    let url = cat.data.message;
                    const attachment = new discord_js_1.AttachmentBuilder(url);
                    interaction.editReply({ files: [attachment] });
                }
                break;
            case 'joke':
                {
                    yield interaction.deferReply();
                    let cat;
                    try {
                        cat = yield axios.get('https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky?blacklistFlags=nsfw');
                    }
                    catch (error) {
                        interaction.editReply({ content: "Could not find any jokes to show." });
                        return;
                    }
                    let joke;
                    if (cat.data.type == 'single') {
                        joke = cat.data.joke;
                    }
                    else {
                        joke = `${cat.data.setup}\n\n||${cat.data.delivery}||`;
                    }
                    interaction.editReply({ content: joke });
                }
                break;
            case 'cah':
                {
                    require('./cardsagainsthumanity/cah.js').createGame(interaction);
                }
                break;
        }
        if (checkOwner(interaction)) {
            switch (interaction.commandName) {
                case 'createpoll':
                    {
                        require('./poll.js').createPoll(interaction);
                    }
                    break;
                case 'rank':
                    {
                        switch (interaction.options.getSubcommand()) {
                            case 'list':
                                {
                                    xp.ranks.list(interaction);
                                }
                                break;
                            case 'add':
                                {
                                    xp.ranks.add(interaction);
                                }
                                break;
                            case 'remove':
                                {
                                    xp.ranks.remove(interaction);
                                }
                                break;
                        }
                    }
                    break;
                case 'function':
                    {
                        let func = (_w = interaction.options.get('user')) === null || _w === void 0 ? void 0 : _w.value;
                        if (typeof func == 'string') {
                            eval(func);
                        }
                    }
                    break;
                case 'game':
                    {
                        if (((_x = interaction.options.get('type')) === null || _x === void 0 ? void 0 : _x.value) == 'scramble') {
                            game.scramble();
                            interaction.reply('Starting a new unscramble.');
                        }
                        else if (((_y = interaction.options.get('type')) === null || _y === void 0 ? void 0 : _y.value) == 'math') {
                            game.math();
                            interaction.reply('Creating a new math problem.');
                        }
                        else if (((_z = interaction.options.get('type')) === null || _z === void 0 ? void 0 : _z.value) == 'trivia') {
                            game.trivia();
                            interaction.reply('Creating a new trivia problem.');
                        }
                    }
                    break;
                case 'give':
                    {
                        let user = (_0 = interaction.options.get('user')) === null || _0 === void 0 ? void 0 : _0.user;
                        let amount = (_1 = interaction.options.get('amount')) === null || _1 === void 0 ? void 0 : _1.value;
                        if (user && typeof amount == 'number') {
                            if (((_2 = interaction.options.get('type')) === null || _2 === void 0 ? void 0 : _2.value) == 'xp') {
                                if (interaction.channel) {
                                    xp.give({ author: user, channel: interaction.channel }, amount, false);
                                    interaction.reply(`Giving ${amount} xp to ${user}`);
                                }
                            }
                            else if (((_3 = interaction.options.get('type')) === null || _3 === void 0 ? void 0 : _3.value) == 'gems') {
                                xp.giveGems(user.id, amount);
                                interaction.reply(`Giving ${amount} gems to ${user}`);
                            }
                        }
                    }
                    break;
                case 'publicshop':
                    {
                        let data = xp.get();
                        let user = data.users.find(user => user.id == interaction.user.id);
                        if (user) {
                            const row = new discord_js_1.ActionRowBuilder()
                                .addComponents(new discord_js_1.StringSelectMenuBuilder()
                                .setCustomId('shop')
                                .addOptions([
                                {
                                    "label": "Server Boost | 2x xp- 1 hour",
                                    "description": "This item costs 100 gems",
                                    "value": "0_2_1_100"
                                },
                                {
                                    "label": "Server Boost | 2x xp- 6 hours",
                                    "description": "This item costs 500 gems",
                                    "value": "0_2_6_500"
                                },
                                {
                                    "label": "Server Boost | 2x xp- 24 hours",
                                    "description": "This item costs 2000 gems",
                                    "value": "0_2_24_2000"
                                },
                                {
                                    "label": "Server Boost | 4x xp- 1 hour",
                                    "description": "This item costs 300 gems",
                                    "value": "0_4_1_300"
                                },
                                {
                                    "label": "Overwatch Namecard",
                                    "description": "Costs 300",
                                    "value": "1_overwatch_300"
                                },
                                {
                                    "label": "Magma Namecard",
                                    "description": "Costs 600",
                                    "value": "1_magma_600"
                                },
                                {
                                    "label": "Ministry Namecard",
                                    "description": "Costs 10000000",
                                    "value": "1_ministry_10000000"
                                },
                                {
                                    "label": "Red-Sky Namecard",
                                    "description": "Costs 600",
                                    "value": "1_red-sky_600"
                                }
                            ])
                                .setMinValues(1)
                                .setMaxValues(1));
                            const embed = new discord_js_1.EmbedBuilder()
                                .setTitle('Shop')
                                .setDescription('Welcome to the shop, spend your gems here.\nBoosters/Namecards can be used with /items\nAll sales are final');
                            interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
                        }
                        else {
                            interaction.reply(`No userdata found.`);
                        }
                    }
                    break;
                case 'punish':
                    {
                        require('./punisher.js').punish(interaction);
                    }
                    break;
                case 'punishments':
                    {
                        require('./punisher.js').getpunishments((_4 = interaction.options.get('user')) === null || _4 === void 0 ? void 0 : _4.user, interaction);
                    }
                    break;
            }
        }
    }
    else if (interaction.isStringSelectMenu()) {
        if (interaction.customId == 'shop') {
            let args = interaction.values[0].split('_');
            let data = xp.get();
            let user = data.users.find(user => user.id == interaction.user.id);
            if (user) {
                if (user.items == undefined) {
                    user.items = [];
                }
                if (args[0] == '0' && user.gems > parseInt(args[3])) {
                    user.items.push({ type: 'booster', display: { name: `${args[1]}x Booster`, value: `Lasts ${args[2]}h`, inline: false }, data: { multiplier: args[1], length: parseInt(args[2]) } });
                    user.gems = user.gems - parseInt(args[3]);
                    xp.write(data);
                    reply.silent(interaction, `Successfully bought booster. Use it by running /items in #bot-cmds.`);
                }
                else if (args[0] == '1' && user.gems > parseInt(args[2])) {
                    let name = `${args[1]} Namecard`;
                    name[0].toUpperCase();
                    user.items.push({ type: 'namecard', display: { name: name, value: `Equip in your inventory`, inline: false }, data: { file: `./namecards/${args[1]}.png` } });
                    user.gems = user.gems - parseInt(args[3]);
                    xp.write(data);
                    reply.silent(interaction, `Successfully bought namecard. Equip it using /items in #bot-cmds.`);
                }
                else {
                    reply.error(interaction, `You can't afford this item.`);
                }
            }
            else {
                reply.error(interaction, `You can't afford this item.`);
            }
        }
        else if (interaction.customId == 'use') {
            if (xp.getMultiplier() == 1) {
                let index = interaction.values[0];
                let data = xp.get();
                let user = data.users.find(user => user.id == interaction.user.id);
                if (user) {
                    let booster = user.items[parseInt(index)];
                    xp.setMultiplier(booster.data.multiplier, booster.data.length * 3600000);
                    user.items.splice(parseInt(index), 1);
                    interaction.reply(`@here | <@${interaction.user.id}> has activated a ${booster.data.multiplier}x XP Booster for ${remainingTime(booster.data.length * 3600000)}`);
                }
                else {
                    reply.error(interaction, 'User not found.');
                }
            }
            else {
                reply.error(interaction, 'A booster is already active.');
            }
        }
    }
    else if (interaction.isButton()) {
        require('./poll').vote(interaction);
    }
}));
client.login(config.server.token);
