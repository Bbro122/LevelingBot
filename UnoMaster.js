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
const { get } = require('./xpmanager');
const discord_js_2 = require("discord.js");
const fs = require('fs');
let can = require('canvas');
let displayValues = [["Red ", "Blue ", "Green ", "Yellow ", "Wild "], ["Draw 2", "Reverse", "Skip"]];
const reso = 0.1;
const newDeck = ["w", "w", "wz", "wz", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g0", "gs", "gd", "gr", "gs", "gd", "gr", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b0", "bs", "bd", "br", "bs", "bd", "br", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y0", "ys", "yd", "yr", "ys", "yd", "yr", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r0", "rs", "rd", "rr", "rs", "rd", "rr"];
let games = [];
function res(num) {
    return num * reso;
}
function getLabel(card) {
    let label = '';
    displayValues[0].forEach(color => {
        if (card.startsWith(color.charAt(0).toLowerCase())) {
            label = color;
        }
    });
    let success = false;
    displayValues[1].forEach(type => {
        if (card.endsWith(type.charAt(0).toLowerCase())) {
            label = label + type;
            success = true;
        }
    });
    if (!success) {
        if (card.endsWith('z')) {
            label = label + 'Draw 4';
        }
        else {
            label = label + card.charAt(1);
        }
    }
    return label;
}
function reverseCycle(players, currentID) {
    for (let i = 0; i < players.length; i++) {
        let player = players.pop();
        if (player) {
            players.splice(i, 0, player);
        }
    }
    while (players[0].id != currentID) {
        let player = players.pop();
        if (player) {
            players.splice(0, 0, player);
        }
    }
    return players;
}
function rotatedImg(card) {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = can.createCanvas(450, 700);
        let ctx = canvas.getContext('2d');
        ctx.translate(225, 350);
        ctx.rotate(3.14);
        ctx.translate(-225, -350);
        ctx.drawImage(yield can.loadImage(`./cards/${card}.png`, 450, 700), 0, 0);
        return canvas;
    });
}
function dispBoard(hands, game, hidden) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(hands[0]);
        const canvas = can.createCanvas(res(7000), res(7000));
        let ctx = canvas.getContext('2d');
        let logo2 = yield can.loadImage(`./cards/logo2.png`);
        //ctx.drawImage(await can.loadImage('./cards/wood.jpg'), 0, 0, res(7000), res(7000))
        ctx.drawImage(yield can.loadImage('./cards/logo.png'), res(2500), res(2750), res(900), res(1400));
        ctx.drawImage(yield can.loadImage(`./cards/${game.deck[0]}.png`), res(3600), res(2750), res(900), res(1400));
        ctx.translate(res(3500), res(3500));
        ctx.rotate(3.14);
        ctx.translate(-res(3500), -res(3500));
        for (let i = 0; i < hands[0].length; i++) {
            const card = hands[0][i];
            if (i > 9) {
                ctx.drawImage((hidden) ? logo2 : yield rotatedImg(card ? card : 'logo'), res(3500) - res(2300) - res(50) * (i - 10), res(50), res(450), res(700));
            }
            else {
                ctx.drawImage((hidden) ? logo2 : yield rotatedImg(card ? card : 'logo'), res(3500) - ((hands[0].length <= 10) ? res(230) * hands[0].length : res(2300)) + res(460) * i, res(50), res(450), res(700));
            }
        }
        ctx.translate(res(3500), res(3500));
        ctx.rotate((hands.length < 3) ? 3.14 : 1.57);
        ctx.translate(-res(3500), -res(3500));
        for (let i = 1; i < hands.length; i++) {
            const hand = hands[i];
            for (let i = 0; i < hand.length; i++) {
                const card = hand[i];
                if (i > 9) {
                    ctx.drawImage(logo2, res(3500) - res(2300) - res(50) * (i - 10), res(50), res(450), res(700));
                }
                else {
                    ctx.drawImage(logo2, res(3500) - ((hand.length <= 10) ? res(230) * hand.length : res(2300)) + res(460) * i, res(50), res(450), res(700));
                }
            }
            ctx.translate(res(3500), res(3500));
            ctx.rotate((hands.length < 3) ? 3.14 : 1.57);
            ctx.translate(-res(3500), -res(3500));
        }
        return canvas.toBuffer();
    });
}
function newGame(msg, host) {
    var _a;
    return { id: ((_a = msg.thread) === null || _a === void 0 ? void 0 : _a.id) ? msg.thread.id : '', msg: msg, deck: newDeck, players: [newPlayer(host)], round: 0, inLobby: true, timeouts: [], host: host };
}
function newPlayer(plr) {
    return { "id": plr, "hand": [] };
}
function createButtons(rawButtons) {
    let buttons = [];
    rawButtons.forEach(buttonData => {
        let button = new discord_js_1.ButtonBuilder()
            .setCustomId(buttonData.id)
            .setLabel(buttonData.string)
            .setStyle(buttonData.style)
            .setDisabled(false);
        if (buttonData.emoji) {
            button.setEmoji(buttonData.emoji);
        }
        buttons.push(button);
    });
    let row = new discord_js_1.ActionRowBuilder()
        .addComponents(buttons);
    return row;
}
function randomizeArray(array) {
    let a = array.slice();
    let b = [];
    for (let i = 0; i < array.length; i++) {
        const randomElement = a[Math.floor(Math.random() * a.length)];
        a.splice(a.indexOf(randomElement), 1);
        b.push(randomElement);
    }
    return b;
}
///////////////////
// Game Creation //
///////////////////
exports.startNewGame = function startNewGame(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let unochan = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find(chan => chan.name == 'uno-matches');
        let member = interaction.member;
        if (unochan && unochan.type == discord_js_1.ChannelType.GuildForum && member instanceof discord_js_1.GuildMember) {
            let message = undefined;
            let game;
            let embed = new discord_js_2.EmbedBuilder()
                .setTitle(`${member.displayName}'s Uno Match`)
                .setDescription(`Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n1/4 players have joined`)
                .setColor('Gold')
                .setThumbnail(`https://cdn.discordapp.com/attachments/758884272572071944/971648962505351198/logo.png`)
                .addFields([{ name: member.displayName, value: `Level ${require('./userdata.json').users.find((user) => user.id = interaction.user.id).level}` }]);
            let gameChan = yield unochan.threads.create({ name: `${interaction.user.username}s-uno-match`, message: { embeds: [embed], components: [createButtons([{ string: "🎮 Join Match", id: "join", style: discord_js_1.ButtonStyle.Success }, { string: "Start Match", id: "start", style: discord_js_1.ButtonStyle.Success, emoji: "814199679704891423" }, { string: "Cancel Match", id: "cancel", style: discord_js_1.ButtonStyle.Danger, emoji: "814199666778308638" }])] } });
            interaction.reply(`[InDev] Game starting in <#${gameChan.id}>`);
            const collector = gameChan === null || gameChan === void 0 ? void 0 : gameChan.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button });
            collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                var _b, _c;
                console.log('received');
                if (!game) {
                    game = { id: gameChan.id, msg: i.message, deck: newDeck, players: [newPlayer(interaction.user.id)], round: 0, inLobby: true, timeouts: [], host: interaction.user.id };
                    games.push(game);
                }
                if (i.customId == 'join') {
                    if (game.players.find(plr => plr.id == i.user.id)) {
                        yield i.reply({ content: 'You are already in this match.', ephemeral: true });
                    }
                    else if (i.member instanceof discord_js_1.GuildMember) {
                        game.players.push(newPlayer(i.user.id));
                        let user = require('./userdata.json').users.find((user) => { var _a; return user.id == ((_a = i.user) === null || _a === void 0 ? void 0 : _a.id); });
                        embed === null || embed === void 0 ? void 0 : embed.addFields({ name: (_b = i.member) === null || _b === void 0 ? void 0 : _b.displayName, value: `Level ${user ? user.level : '<Unknown>'}`, inline: false });
                        embed.setDescription(`Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n${game.players.length}/4 players have joined`);
                        yield i.update({ embeds: [embed] });
                    }
                }
                else if (((_c = i.user) === null || _c === void 0 ? void 0 : _c.id) == game.host) {
                    if (i.customId == 'cancel') {
                        if (i.user.id == interaction.user.id) {
                            if (game) {
                                games.splice(games.indexOf(game), 1);
                            }
                            gameChan.delete('Game cancelled');
                            games.splice(games.indexOf(game), 1);
                        }
                        else {
                            yield i.reply({ content: "Only the host can perform this action", ephemeral: true });
                        }
                    }
                    else if (i.customId == 'start') {
                        if (game.players.length > 1) {
                            collector.stop();
                            game.deck = randomizeArray(game.deck);
                            for (let i = 0; i < game.players.length; i++) {
                                const element = game.players[i];
                                element.hand = [game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop(), game.deck.pop()];
                            }
                            startTurn(i, game);
                        }
                        else {
                            yield i.reply({ content: "There must be more than 1 player for the game to start", ephemeral: true });
                        }
                    }
                }
                else {
                    yield i.reply({ content: 'Command is only available to host', ephemeral: true });
                }
            }));
        }
        else {
            interaction.reply('Could not find uno forum.');
        }
    });
};
// Turn Start
function startTurn(interaction, game) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (game.msg instanceof discord_js_1.Message) {
            let player = game.players[game.round % game.players.length];
            let member = ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(player.id)) ? (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(player.id) : interaction.member;
            let hands = [];
            hands.push(player.hand);
            for (let i = 0; i < game.players.length; i++) {
                const plr = game.players[(game.round + i) % game.players.length];
                if (plr != player) {
                    hands.push(plr.hand);
                }
            }
            const attachment = new discord_js_2.AttachmentBuilder(yield dispBoard(hands, game, true));
            yield game.msg.edit({ content: '<a:loading:1011794755203645460>', embeds: [], components: [] });
            yield game.msg.edit({
                content: null,
                embeds: [{ "title": `${member instanceof discord_js_1.GuildMember ? member.displayName : '<DATA ERROR>'}'s turn (${game.round + 1})`, "description": `15 Seconds until turn forfeited`, "color": 0xed0606, "thumbnail": { "url": `attachment://board.png`, "height": 700, "width": 450 } }], components: [createButtons([{ string: "Begin Turn", id: "turn", style: discord_js_1.ButtonStyle.Primary }])],
                files: [attachment]
            });
            let collector = (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, filter: i => i.user.id == player.id, max: 1 });
            collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                var _e, _f, _g;
                yield i.deferReply({ ephemeral: true });
                const attachment = new discord_js_2.AttachmentBuilder(yield dispBoard(hands, game, false));
                yield ((_e = game.msg) === null || _e === void 0 ? void 0 : _e.edit({ content: '<a:loading:1011794755203645460>', embeds: [], components: [] }));
                yield ((_f = game.msg) === null || _f === void 0 ? void 0 : _f.edit({
                    content: null,
                    embeds: [{ "title": `${i.member instanceof discord_js_1.GuildMember ? i.member.displayName : i.user.id} has begun round ${game.round + 1}`, "description": `They have 30 seconds to play or draw a card.`, "color": 0xed0606, "thumbnail": { "url": `attachment://board.png`, "height": 700, "width": 450 } }], components: undefined,
                    files: Array.from(game.msg.attachments.values())
                }));
                let playableCards = [{ label: 'Draw', value: 'draw' }];
                player.hand.forEach(card => {
                    if (playableCards.find(card1 => card1.value == card) == undefined && ((card === null || card === void 0 ? void 0 : card.startsWith(game.forceColor ? game.forceColor : game.deck[0].charAt(0))) || (card === null || card === void 0 ? void 0 : card.charAt(1)) == game.deck[0].charAt(1) || (card === null || card === void 0 ? void 0 : card.startsWith('w')))) {
                        playableCards.push({ label: getLabel(card), value: card });
                    }
                });
                let SelectMenu = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.SelectMenuBuilder()
                    .setCustomId('playcard')
                    .addOptions(playableCards));
                yield i.editReply({
                    components: [SelectMenu],
                    files: [attachment],
                    embeds: [
                        new discord_js_2.EmbedBuilder()
                            .setTitle('Time to make your move')
                            .setDescription(`It is now your turn, you have 30 seconds to play or draw a card.`)
                            .setColor(0xed0606)
                            .setThumbnail(`attachment://board.png`)
                    ]
                });
                let collector = (_g = interaction.channel) === null || _g === void 0 ? void 0 : _g.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.SelectMenu, max: 1 });
                collector === null || collector === void 0 ? void 0 : collector.on('collect', (interaction) => __awaiter(this, void 0, void 0, function* () {
                    var _h, _j, _k, _l, _m;
                    if (interaction.values[0] !== 'draw') {
                        game.forceColor = undefined;
                        player.hand.splice(player.hand.findIndex(card => card == interaction.values[0]), 1);
                        game.deck.splice(0, 0, interaction.values[0]);
                        if (player.hand.length == 0) {
                            let embed = new discord_js_2.EmbedBuilder()
                                .setTitle(`Game Over`)
                                .setDescription(`${interaction.user.username} has won the game.`);
                            yield ((_h = game.msg) === null || _h === void 0 ? void 0 : _h.channel.send({ embeds: [embed] }));
                        }
                        games.splice(games.findIndex(gam => gam == game), 1);
                    }
                    let embed = new discord_js_2.EmbedBuilder()
                        .setTitle(`Round ${game.round + 1}`)
                        .setDescription(`${interaction.user.username} Played a ${getLabel(interaction.values[0])}`)
                        .setThumbnail(`attachment://board.png`);
                    if (interaction.values[0].startsWith('w')) {
                        let row = new discord_js_1.ActionRowBuilder()
                            .addComponents(new discord_js_1.ButtonBuilder()
                            .setCustomId('red')
                            .setLabel('Red')
                            .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
                            .setCustomId('blue')
                            .setLabel('Blue')
                            .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
                            .setCustomId('green')
                            .setLabel('Green')
                            .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
                            .setCustomId('yellow')
                            .setLabel('Yellow')
                            .setStyle(discord_js_1.ButtonStyle.Secondary)
                            .setEmoji('1032791232449085590'));
                        let embed1 = new discord_js_2.EmbedBuilder()
                            .setTitle(`Round ${game.round + 1}`)
                            .setDescription(`Choose a color to switch to.`)
                            .setThumbnail(`attachment://board.png`);
                        let message = yield ((_j = interaction.channel) === null || _j === void 0 ? void 0 : _j.send({ components: [row], embeds: [embed1] }));
                        let collector = (_k = interaction.channel) === null || _k === void 0 ? void 0 : _k.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, filter: i => i.user.id == player.id && ['green', 'red', 'blue', 'yellow'].includes(i.customId), max: 1 });
                        collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                            var _o, _p;
                            embed1.setDescription(`The color is now ${i.customId}.`);
                            message === null || message === void 0 ? void 0 : message.edit({ embeds: [embed] });
                            game.forceColor = i.customId.charAt(0);
                            if (interaction.values[0].endsWith('d')) {
                                let nextPlr = game.players[(game.round + 1) % game.players.length];
                                nextPlr.hand.push(game.deck.pop());
                                nextPlr.hand.push(game.deck.pop());
                                nextPlr.hand.push(game.deck.pop());
                                nextPlr.hand.push(game.deck.pop());
                                embed.setDescription(embed.data.description + ` and made @<${nextPlr.id}> draw 4 cards. The color is now ${i.customId}.`);
                                game.round++;
                            }
                            else {
                                embed.setDescription(embed.data.description + ` and changed the color to ${i.customId}`);
                            }
                            yield ((_o = game.msg) === null || _o === void 0 ? void 0 : _o.edit({ embeds: [embed], components: [] }));
                            let msg = yield ((_p = interaction.channel) === null || _p === void 0 ? void 0 : _p.send('<a:loading:1011794755203645460>'));
                            if (msg instanceof discord_js_1.Message) {
                                game.msg = msg;
                            }
                            game.round++;
                            startTurn(interaction, game);
                        }));
                    }
                    else {
                        if (interaction.values[0].endsWith('s')) {
                            game.round++;
                        }
                        else if (interaction.values[0].endsWith('d')) {
                            game.players[(game.round + 1) % game.players.length].hand.push(game.deck.pop());
                            game.players[(game.round + 1) % game.players.length].hand.push(game.deck.pop());
                            game.round++;
                        }
                        else if (interaction.values[0].endsWith('r')) {
                            reverseCycle(game.players, player.id);
                            if (game.players.length == 2) {
                                game.round++;
                            }
                        }
                        else if (interaction.values[0] == 'draw') {
                            game.players[(game.round + 1) % game.players.length].hand.push(game.deck.pop());
                        }
                        yield ((_l = game.msg) === null || _l === void 0 ? void 0 : _l.edit({ embeds: [embed], components: [] }));
                        let msg = yield ((_m = interaction.channel) === null || _m === void 0 ? void 0 : _m.send('<a:loading:1011794755203645460>'));
                        if (msg instanceof discord_js_1.Message) {
                            game.msg = msg;
                        }
                        game.round++;
                        startTurn(interaction, game);
                    }
                }));
            }));
        }
        else {
            (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.send('Fuck.');
        }
    });
}
