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
const cards = require('./cards.json');
let games = [];
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
class Game {
    constructor(interaction, msg) {
        this.interaction = interaction;
        this.msg = msg;
        this.players = [];
        this.round = 0;
        this.id = msg.channel.id;
        this.promptDeck = cards.prompt;
        this.responseDeck = cards.response;
        this.host = interaction.user.id;
    }
}
class Player {
    constructor(identification, game) {
        this.identification = identification;
        this.game = game;
        let response = [];
        for (let i = 0; i < 7; i++) {
            const element = game.responseDeck.pop();
            response.push(element ? element : '');
        }
        this.id = identification;
        this.prompt = [];
        this.response = response;
    }
}
exports.createGame = function (interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let cahthread = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find(chan => chan.name == 'cah-matches');
        let member = interaction.member;
        if (cahthread && cahthread.type == discord_js_1.ChannelType.GuildForum && member instanceof discord_js_1.GuildMember) {
            let message = undefined;
            let game;
            let embed = new discord_js_1.EmbedBuilder()
                .setTitle(`${member.displayName}'s Cards Against Humanity Match`)
                .setDescription(`Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n1/10 players have joined`)
                .setColor('Gold')
                .addFields([{ name: member.displayName, value: `Level ${require('../userdata.json').users.find((user) => user.id = interaction.user.id).level}` }]);
            let cahChan = yield cahthread.threads.create({ name: `${interaction.user.username}s-uno-match`, message: { embeds: [embed], components: [createButtons([{ string: "🎮 Join Match", id: "join", style: discord_js_1.ButtonStyle.Success }, { string: "Start Match", id: "start", style: discord_js_1.ButtonStyle.Success, emoji: "814199679704891423" }, { string: "Cancel Match", id: "cancel", style: discord_js_1.ButtonStyle.Danger, emoji: "814199666778308638" }])] } });
            interaction.reply(`[InDev] Cards Against Humanity starting in <#${cahChan.id}>`);
            const collector = cahChan === null || cahChan === void 0 ? void 0 : cahChan.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button });
            collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                console.log('received');
                if (!game) {
                    game = new Game(interaction, i.message);
                    game.players.push(new Player(game.host, game));
                    games.push(game);
                }
                switch (i.customId) {
                    case 'join':
                        if (game.players.find(plr => plr.id === i.user.id)) {
                            yield i.reply({ content: 'You are already in this match.', ephemeral: true });
                        }
                        else if (i.member instanceof discord_js_1.GuildMember) {
                            game.players.push(new Player(i.user.id, game));
                            let user = require('../userdata.json').users.find((user) => { var _a; return user.id == ((_a = i.user) === null || _a === void 0 ? void 0 : _a.id); });
                            embed === null || embed === void 0 ? void 0 : embed.addFields({ name: (_b = i.member) === null || _b === void 0 ? void 0 : _b.displayName, value: `Level ${user ? user.level : '<Unknown>'}`, inline: false });
                            embed.setDescription(`Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n${game.players.length}/4 players have joined`);
                            yield i.update({ embeds: [embed] });
                        }
                        break;
                    case 'cancel':
                        collector.stop();
                        if (i.user.id == interaction.user.id) {
                            if (game) {
                                collector.stop();
                                games.splice(games.indexOf(game), 1);
                                let cancel = new discord_js_1.EmbedBuilder()
                                    .setTitle(`Match Cancelled`)
                                    .setDescription(`Match was cancelled by the host.`)
                                    .setColor('Red');
                                yield i.update({ embeds: [cancel], components: undefined });
                            }
                            else {
                                yield i.reply({ content: "Only the host can perform this action", ephemeral: true });
                            }
                        }
                        break;
                    case 'start':
                        if (game.players.length > 1 && i.user.id == interaction.user.id) {
                            collector.stop();
                            for (let i = 0; i < game.players.length; i++) {
                                const element = game.players[i];
                                let array = [game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop(), game.responseDeck.pop()];
                                array.forEach(card => {
                                    if (typeof card == 'undefined') {
                                        array.splice(array.indexOf(card), 1);
                                    }
                                });
                                element.response = array;
                            }
                            startTurn(i, game);
                        }
                        else {
                            yield i.reply({ content: "There must be more than 1 player for the game to start", ephemeral: true });
                        }
                        break;
                }
            }));
        }
        else {
            interaction.reply('Could not find cah forum.');
        }
    });
};
function startTurn(interaction, game) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (game.msg instanceof discord_js_1.Message) {
            let cardMaster = game.players[game.round % game.players.length];
            let member = ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(cardMaster.id)) ? (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(cardMaster.id) : interaction.member;
            let prompt = game.promptDeck[Math.floor(Math.random() * game.promptDeck.length)];
            yield game.msg.edit({
                content: null,
                embeds: [{ "title": `${member instanceof discord_js_1.GuildMember ? member.displayName : '<DATA ERROR>'} is the Card Master (${game.round + 1})`, "description": `Everyone must play a card\nClick the button below to play a card.\n${prompt}`, "color": 0xed0606 }], components: [createButtons([{ string: "Play Card", id: "card", style: discord_js_1.ButtonStyle.Primary }])],
            });
            let collector = (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, filter: i => i.user.id != cardMaster.id, maxUsers: game.players.length - 1 });
            let plays = [];
            collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                var _d;
                let player = game.players.find(plr => plr.id == i.user.id);
                if (i.customId == 'card' && player) {
                    let cards = [];
                    let menuCards = [];
                    for (let i = 0; i < (player === null || player === void 0 ? void 0 : player.response.length); i++) {
                        const card = player === null || player === void 0 ? void 0 : player.response[i];
                        cards.push({ name: i.toString(), value: card });
                        menuCards.push({ label: card.slice(0, 100), value: i.toString() });
                    }
                    let embed = new discord_js_1.EmbedBuilder()
                        .setTitle(`Time to choose`)
                        .setDescription(`The following numbers correspond to the card your gonna play. Choose wisely.`)
                        .setColor('Gold')
                        .addFields(cards);
                    let row = new discord_js_1.ActionRowBuilder()
                        .addComponents(new discord_js_1.SelectMenuBuilder()
                        .setCustomId('playcard')
                        .addOptions(menuCards));
                    i.reply({ ephemeral: true, embeds: [embed], components: [row] });
                    let collector = (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.SelectMenu, filter: interaction => interaction.user.id == i.user.id, max: 1 });
                    collector === null || collector === void 0 ? void 0 : collector.on('collect', (interaction) => __awaiter(this, void 0, void 0, function* () {
                        let card = cards.find(card => card.name == interaction.values[0]);
                        if ((card === null || card === void 0 ? void 0 : card.value) && interaction.customId == 'playcard') {
                            plays.push({ id: interaction.user.id, response: card.value });
                            interaction.update({ components: undefined, embeds: [], content: 'Successfully played card.' });
                        }
                    }));
                }
            }));
            collector === null || collector === void 0 ? void 0 : collector.on('end', reason => {
                console.log('End');
                //while (plays.length<game.players.length-1) {}
                let menuCards = [];
                let cards = [];
                for (let i = 0; i < plays.length; i++) {
                    const card = plays[i].response;
                    cards.push({ name: i.toString(), value: card });
                    menuCards.push({ label: card.slice(0, 100), value: i.toString() });
                }
                let embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`All replies Received, Cardmaster picks their favorite, pick yours while waiting.`)
                    .setDescription(prompt)
                    .setColor('Gold')
                    .addFields(cards);
                let row = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
                    .setCustomId('playcard')
                    .addOptions(menuCards));
                interaction.update({ embeds: [embed], components: [row] });
            });
        }
    });
}
