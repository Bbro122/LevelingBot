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
const datamanager_1 = __importDefault(require("./datamanager"));
let axios = require('axios');
const easyVM = { "*": .1, "-": .3, "+": 0.3 };
const medVM = { "*": .3, "-": .3, "+": 0.3 };
const hardVM = { "*": .5, "-": .3, "+": 0.3 };
let valueMap = { "+": 10, "-": 20, "*": 30, "/": 40 };
const chanceMap = { "*": .2, "-": .3, "+": 0.3 };
let currentValues = [];
let client;
const _ = {
    setup(bot) {
        client = bot;
        client.guilds.fetch().then(() => {
            client.guilds.cache.forEach(guild => {
                startGame(guild.id, true);
            });
        });
    },
    getAnswer(guildId) {
        return currentValues.find(value => value.guildId = guildId);
    },
    answer(guildId) {
        let value = currentValues.find(value => value.guildId == guildId);
        if (value) {
            value.reward = 0;
            return true;
        }
        return false;
    }
};
exports.default = _;
function generateEquation(vm) {
    let termCount = random(3, 6);
    let terms = [];
    let tAvg = 0;
    let signValue = 0;
    for (let i = 0; i < termCount; i++) {
        let term = random(3, 50);
        terms.push(term);
        tAvg = tAvg + term;
    }
    tAvg = Math.round(tAvg / termCount);
    if (random(0, 1) == 1) {
        let tindex = random(0, terms.length - 1);
        let term = terms[tindex];
        let multipleArray = multiples(term);
        if (multipleArray.length > 1) {
            let multiple = 0;
            while (multiple == term || multiple == 0) {
                multiple = multipleArray[random(0, multipleArray.length - 1)];
            }
            term = `(${term} / ${multiple})`;
            terms[tindex] = term;
        }
        signValue = 40;
    }
    for (let i = 0; i < 3; i++) {
        let randTerm = random(0, terms.length - 1);
        if (typeof terms[randTerm] == 'number' || (typeof terms[randTerm] == 'string' && !terms[randTerm].includes('^'))) {
            let term = typeof terms[randTerm] == 'string' ? eval(terms[randTerm]) : terms[randTerm];
            if (isSqrt(term)) {
                terms[randTerm] = `${terms[randTerm]}^0.5`;
                signValue = signValue + 30;
            }
            else if (term <= 10) {
                terms[randTerm] = `${terms[randTerm]}^2`;
                signValue = signValue + 30;
            }
        }
        else {
            i--;
        }
    }
    let equation = '';
    for (let i = 0; i < terms.length - 1; i++) {
        const term = terms[i];
        let values = getSign(vm);
        signValue = signValue + values[1];
        equation = equation + `${term} ${values[0]} `;
    }
    equation = equation + terms[terms.length - 1];
    let value = signValue + tAvg + Math.abs(eval(equation.replace('^', '**')) * (random(1, 4) / 10));
    return [equation, Math.round((value > 300) ? 300 : value)];
}
function getSign(vm) {
    let value = undefined;
    while (value == undefined) {
        if (Math.random() < vm["+"]) {
            value = ['+', valueMap["+"]];
        }
        else if (Math.random() < vm["-"]) {
            value = ['-', valueMap["-"]];
        }
        else if (Math.random() < vm["*"]) {
            value = ['*', valueMap["*"]];
        }
    }
    return value;
}
function multiples(num) {
    let multiples = [];
    for (let i = 0; i < num; i++) {
        const result = num / i;
        if ((result - Math.floor(result) == 0)) {
            multiples.push(result);
        }
    }
    return multiples;
}
function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
function randomizeWord(word) {
    while (true) {
        let array = word.split('');
        let b = '';
        for (let i = 0; i < array.length; i++) {
            const element = array[random(0, array.length - 1)];
            array.splice(array.indexOf(element), 1);
            b = b + element;
            i--;
        }
        if (b != word) {
            return b;
        }
    }
}
function isSqrt(value) {
    return ((value ** 0.5) == Math.floor(value ** 0.5) ? true : false);
}
function startGame(serverID, repeat) {
    return __awaiter(this, void 0, void 0, function* () {
        let manager = datamanager_1.default.getManager(serverID);
        let guild = client.guilds.cache.get(serverID);
        let delay = manager.getSetting('gameDelay');
        let enabled = manager.getSetting('gameBool');
        let channelID = manager.getSetting('gameChannel');
        if (enabled && channelID && serverID) {
            let channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(channelID.value);
            if (channel && channel instanceof discord_js_1.TextChannel) {
                let game = random(1, 3);
                switch (game) {
                    case 1:
                        {
                            let equation;
                            let color = 'Red';
                            switch (random(1, 3)) {
                                case 1:
                                    equation = generateEquation(easyVM);
                                    color = 'Green';
                                    break;
                                case 2:
                                    equation = generateEquation(medVM);
                                    color = 'Yellow';
                                    break;
                                case 3:
                                    equation = generateEquation(hardVM);
                                    color = 'Red';
                                    break;
                                default:
                                    equation = generateEquation(hardVM);
                                    break;
                            }
                            let embed = new discord_js_1.EmbedBuilder()
                                .setTitle('Solve the Equation')
                                .setDescription(equation[0])
                                .setColor(color)
                                .setFooter({ text: `Solve for ${equation[1]} xp || Ends in ${delay.value / 3600000} hour${delay.value / 3600000 > 1 ? 's' : ''}` });
                            channel.send({ embeds: [embed] });
                            let collector = channel.createMessageCollector({ time: delay.value });
                            collector.on('collect', message => {
                                if (message.content == eval(equation[0].replace('^', '**')).toString()) {
                                    let user = manager.getUser(message.author.id);
                                    user.addXP(equation[1]);
                                    message.channel.send(`<@${message.author.id}> solved the problem.`);
                                    collector.stop();
                                }
                            });
                        }
                        break;
                    case 2:
                        {
                            let words = require('../data/scramble.json');
                            let word = words[random(0, words.length - 1)];
                            let color = 'Green';
                            if (word.length > 7) {
                                color = 'Red';
                            }
                            else if (word.length > 5) {
                                color = 'Yellow';
                            }
                            else {
                                color = 'Green';
                            }
                            let embed = new discord_js_1.EmbedBuilder()
                                .setTitle('Unscramble the Word')
                                .setDescription(randomizeWord(word))
                                .setColor(color)
                                .setFooter({ text: `Solve for ${50 + (word.length - 4) * 10} xp || Ends in ${delay.value / 3600000} hour${delay.value / 3600000 > 1 ? 's' : ''}` });
                            yield channel.send({ embeds: [embed] });
                            let collector = channel.createMessageCollector({ time: delay.value });
                            collector.on('collect', message => {
                                if (message.content == word) {
                                    let user = manager.getUser(message.author.id);
                                    user.addXP(50 + (word.length - 4) * 10);
                                    message.channel.send(`<@${message.author.id}> solved the problem.`);
                                    collector.stop();
                                }
                            });
                        }
                        break;
                    case 3:
                        {
                            let difficulty;
                            let value = 0;
                            let color = 'Green';
                            switch (random(1, 3)) {
                                case 1:
                                    difficulty = 'hard';
                                    color = 'Red';
                                    value = 150;
                                    break;
                                case 2:
                                    difficulty = 'medium';
                                    color = 'Yellow';
                                    value = 100;
                                    break;
                                case 3:
                                    difficulty = 'easy';
                                    color = 'Green';
                                    value = 50;
                                    break;
                            }
                            let trivia;
                            try {
                                trivia = (yield axios.get(`https://the-trivia-api.com/api/questions?limit=1&difficulty=${difficulty}`)).data[0];
                            }
                            catch (error) {
                                return console.log(error);
                            }
                            let array = trivia.incorrectAnswers;
                            array.push(trivia.correctAnswer);
                            let answers = [];
                            for (let i = 0; i < array.length; i++) {
                                const element = array[random(0, array.length - 1)];
                                console.log(element);
                                array.splice(array.indexOf(element), 1);
                                answers.push(element);
                                i--;
                            }
                            let embed = new discord_js_1.EmbedBuilder()
                                .setColor(color)
                                .setTitle(trivia.category)
                                .setDescription(trivia.question)
                                .addFields([{ value: answers[0], name: 'A.' }, { value: answers[1], name: 'B.' }, { value: answers[2], name: 'C.' }, { value: answers[3], name: 'D.' }])
                                .setFooter({ text: `Choose the correct answer for ${value} || Ends in ${delay.value / 3600000} hour${delay.value / 3600000 > 1 ? 's' : ''}` });
                            let row = new discord_js_1.ActionRowBuilder()
                                .addComponents(new discord_js_1.StringSelectMenuBuilder()
                                .setCustomId('trivia')
                                .setOptions(new discord_js_1.StringSelectMenuOptionBuilder()
                                .setLabel(answers[0].slice(0, 99))
                                .setDescription('0')
                                .setValue('0'), new discord_js_1.StringSelectMenuOptionBuilder()
                                .setLabel(answers[1].slice(0, 99))
                                .setDescription('1')
                                .setValue('1'), new discord_js_1.StringSelectMenuOptionBuilder()
                                .setLabel(answers[2].slice(0, 99))
                                .setDescription('2')
                                .setValue('2'), new discord_js_1.StringSelectMenuOptionBuilder()
                                .setLabel(answers[3].slice(0, 99))
                                .setDescription('3')
                                .setValue('3')));
                            let msg = yield channel.send({ embeds: [embed], components: [row] });
                            let collector = channel.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, time: delay.value });
                            let users = [];
                            console.log(trivia.correctAnswer);
                            collector.on('collect', answer => {
                                if (!users.includes(answer.user.id)) {
                                    if (answer.values[0] == answers.indexOf(trivia.correctAnswer).toString()) {
                                        let user = manager.getUser(answer.user.id);
                                        user.addXP(value);
                                        answer.reply(`<@${answer.user.id}> answered correctly.`);
                                    }
                                    else {
                                        answer.reply(`<@${answer.user.id}> answered incorrectly.`);
                                    }
                                }
                                users.push(answer.user.id);
                            });
                            collector.on('end', () => {
                                let row = new discord_js_1.ActionRowBuilder()
                                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                                    .setCustomId('trivia')
                                    .setDisabled(true)
                                    .setOptions(new discord_js_1.StringSelectMenuOptionBuilder()
                                    .setLabel(answers[0])
                                    .setDescription('0')
                                    .setValue('0'), new discord_js_1.StringSelectMenuOptionBuilder()
                                    .setLabel(answers[1])
                                    .setDescription('1')
                                    .setValue('1'), new discord_js_1.StringSelectMenuOptionBuilder()
                                    .setLabel(answers[2])
                                    .setDescription('2')
                                    .setValue('2'), new discord_js_1.StringSelectMenuOptionBuilder()
                                    .setLabel(answers[3])
                                    .setDescription('3')
                                    .setValue('3')));
                                msg.edit({ embeds: [embed], components: [row] });
                            });
                        }
                        break;
                }
            }
        }
        if (repeat) {
            setTimeout(() => startGame(serverID, true), delay.value);
        }
    });
}
class UnoPlayer {
    constructor() {
        this.hand = [];
    }
}
class UnoMatch {
    constructor() {
        this.deck = [];
        this.players = [];
    }
}
