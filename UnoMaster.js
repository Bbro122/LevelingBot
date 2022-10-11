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
let displayValues = [["Red ", "Blue ", "Green ", "Yellow "], ["Draw 2", "Reverse", "Skip"]];
const reso = 0.1;
const newDeck = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g0", "gs", "gd", "gr", "gs", "gd", "gr", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b0", "bs", "bd", "br", "bs", "bd", "br", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y0", "ys", "yd", "yr", "ys", "yd", "yr", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r0", "rs", "rd", "rr", "rs", "rd", "rr"];
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
        label = label + card.charAt(1);
    }
    return label;
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
    return { id: msg.channelId, msg: msg, deck: newDeck, players: [newPlayer(host)], round: 0, inLobby: true, timeouts: [], host: host };
}
function newPlayer(plr) {
    return { "id": plr, "hand": [] };
}
function createButton(string, id, style, emoji, disabled) {
    let button = new discord_js_1.MessageButton()
        .setCustomId(id)
        .setLabel(string)
        .setStyle(style)
        .setDisabled(disabled);
    if (emoji) {
        button.setEmoji(emoji);
    }
    return button;
}
function row(array) {
    return new discord_js_1.MessageActionRow().addComponents(array);
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
function startTurn(interaction, game) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
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
        const attachment = new discord_js_2.MessageAttachment(yield dispBoard(hands, game, true), 'board.png');
        yield game.msg.edit({ content: '<a:loading:1011794755203645460>', embeds: [], components: [] });
        yield game.msg.edit({
            content: null,
            embeds: [{ "type": "rich", "title": `${member instanceof discord_js_1.GuildMember ? member.displayName : '<DATA ERROR>'}'s turn (${game.round + 1})`, "description": `15 Seconds until turn forfeited`, "color": 0xed0606, "thumbnail": { "url": `attachment://board.png`, "height": 700, "width": 450 } }], components: [row([createButton("Begin Turn", "turn", "SUCCESS", null, false)])],
            files: [attachment]
        });
        let collector = (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.createMessageComponentCollector({ componentType: 'BUTTON', filter: i => i.user.id == player.id, time: 20000, max: 1 });
        collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            yield i.deferReply({ ephemeral: true });
            const attachment = new discord_js_2.MessageAttachment(yield dispBoard(hands, game, false), 'board.png');
            yield game.msg.edit({ content: '<a:loading:1011794755203645460>', embeds: [], components: [] });
            yield game.msg.edit({
                content: null,
                embeds: [{ "type": "rich", "title": `${i.member instanceof discord_js_1.GuildMember ? i.member.displayName : i.user.id} has begun round ${game.round + 1}`, "description": `They have 30 seconds to play or draw a card.`, "color": 0xed0606, "thumbnail": { "url": `attachment://board.png`, "height": 700, "width": 450 } }], components: undefined,
                files: Array.from(game.msg.attachments.values())
            });
            let playableCards = [{ label: 'Draw', value: 'draw' }];
            player.hand.forEach(card => {
                if (playableCards.find(card1 => card1.value == card) == undefined && ((card === null || card === void 0 ? void 0 : card.startsWith(game.deck[0].charAt(0))) || (card === null || card === void 0 ? void 0 : card.charAt(1)) == game.deck[0].charAt(1))) {
                    playableCards.push({ label: getLabel(card), value: card });
                }
            });
            let SelectMenu = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageSelectMenu()
                .setCustomId('playcard')
                .addOptions(playableCards));
            yield i.editReply({
                components: [SelectMenu],
                files: [attachment],
                embeds: [
                    new discord_js_2.MessageEmbed()
                        .setTitle('Time to make your move')
                        .setDescription(`It is now your turn, you have 30 seconds to play or draw a card.`)
                        .setColor(0xed0606)
                        .setThumbnail(`attachment://board.png`)
                ]
            });
            let collector = (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 35000, max: 1 });
            collector === null || collector === void 0 ? void 0 : collector.on('collect', (interaction) => __awaiter(this, void 0, void 0, function* () {
                var _e;
                player.hand.splice(player.hand.findIndex(card => card == interaction.values[0]), 1);
                if (player.hand.length == 0) {
                    let embed = new discord_js_2.MessageEmbed()
                        .setTitle(`Game Over`)
                        .setDescription(`${interaction.user.username} has won the game.`);
                    yield game.msg.channel.send({ embeds: [embed] });
                }
                else {
                    game.deck.splice(0, 0, interaction.values[0]);
                    let embed = new discord_js_2.MessageEmbed()
                        .setTitle(`Round ${game.round + 1}`)
                        .setDescription(`${interaction.user.username} Played a ${getLabel(interaction.values[0])}`)
                        .setThumbnail(`attachment://board.png`);
                    if (interaction.values[0].startsWith('w'))
                        yield game.msg.edit({ embeds: [embed], components: [] });
                    let msg = yield ((_e = interaction.channel) === null || _e === void 0 ? void 0 : _e.send('<a:loading:1011794755203645460>'));
                    if (msg instanceof discord_js_1.Message) {
                        game.msg = msg;
                    }
                    game.round++;
                    startTurn(interaction, game);
                }
            }));
        }));
    });
}
exports.startNewGame = function startNewGame(interaction) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let gameChan = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.create(`${interaction.user.username}s-uno-match`));
        if (gameChan && interaction.member instanceof discord_js_1.GuildMember) {
            let msg = yield gameChan.send({
                embeds: [{
                        "title": `${(_b = interaction === null || interaction === void 0 ? void 0 : interaction.member) === null || _b === void 0 ? void 0 : _b.displayName}'s Uno Match`,
                        "description": `Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n1/4 players have joined`,
                        "color": 0xed0606,
                        "thumbnail": {
                            "url": `https://cdn.discordapp.com/attachments/758884272572071944/971648962505351198/logo.png`,
                            "height": 700,
                            "width": 450
                        },
                        "fields": [{ name: (_c = interaction === null || interaction === void 0 ? void 0 : interaction.member) === null || _c === void 0 ? void 0 : _c.displayName, value: `Level ${require('./userdata.json').users.find((user) => user.id = interaction.user.id).level}` }]
                    }], components: [row([createButton("🎮 Join Match", "join", "SUCCESS", null, false), createButton("Start Match", "start", "SUCCESS", "814199679704891423", false), createButton("Cancel Match", "cancel", "DANGER", "814199666778308638", false)])]
            });
            if (msg) {
                let game = newGame(msg, interaction.user.id);
                games.push(game);
                interaction.reply(`[InDev] Game starting in <#${gameChan.id}>`);
                const collector = gameChan === null || gameChan === void 0 ? void 0 : gameChan.createMessageComponentCollector({ componentType: 'BUTTON' });
                collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _d, _e, _f;
                    if (i.customId == 'join') {
                        if (game.players.find(plr => plr.id == i.user.id)) {
                            yield i.reply({ content: 'You are already in this match.', ephemeral: true });
                        }
                        else if (i.member instanceof discord_js_1.GuildMember) {
                            game.players.push(newPlayer(i.user.id));
                            let embed = game.msg.embeds[0];
                            let user = require('./userdata.json').users.find((user) => { var _a; return user.id == ((_a = i.user) === null || _a === void 0 ? void 0 : _a.id); });
                            embed.description = `Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n${game.players.length}/4 players have joined`;
                            embed.fields.push({ name: (_d = i.member) === null || _d === void 0 ? void 0 : _d.displayName, value: `Level ${user.level}`, inline: false });
                            yield i.update({ embeds: [embed] });
                        }
                    }
                    else if (((_e = i.user) === null || _e === void 0 ? void 0 : _e.id) == game.host) {
                        if (i.customId == 'cancel') {
                            if (i.user.id == game.host) {
                                (_f = i.channel) === null || _f === void 0 ? void 0 : _f.delete();
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
                yield gameChan.delete();
                yield interaction.reply('Failed to create game');
            }
        }
    });
};
