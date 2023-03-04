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
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
let axios = require('axios');
let client;
let channel;
let currentWord;
let miniTimer;
function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.setup = function setup(client1, channel1) {
    client = client1;
    channel = channel1;
};
exports.selGame = function selectGame() {
    let random = randomize(0, 2);
    if (random == 0) {
        exports.scramble();
    }
    else if (random == 1) {
        exports.math();
    }
    else if (random == 2) {
        exports.trivia();
    }
};
exports.math = function math() {
    miniTimer = setTimeout(() => exports.selGame(), 3600000);
    let time = new Date().getHours();
    if (time >= 7 && time <= 22) {
        let termCount = randomize(2, require('./config.json').server.maxTerms);
        let terms = '';
        let expressions = ['+', '-', '*'];
        for (let i = 0; i < termCount; i++) {
            terms = terms + randomize(5, 25).toString() + " ";
            if (i + 1 < termCount) {
                terms = terms + expressions[randomize(0, 2)] + " ";
            }
        }
        currentWord = eval(terms).toString();
        let embed = new builders_1.Embed()
            .setTitle(`Solve the problem`)
            .setDescription(terms)
            .setColor(0x00FFFF)
            .setFooter({ text: `You have 2 hours to solve for 50 xp` });
        if (channel) {
            channel.send({ embeds: [embed] });
        }
        else {
            client.channels.cache.get(require('./config.json').server.gamechannel);
        }
    }
};
exports.trivia = function trivia() {
    return __awaiter(this, void 0, void 0, function* () {
        let trivia;
        try {
            trivia = yield axios.get('https://the-trivia-api.com/api/questions?limit=1&difficulty=easy');
        }
        catch (error) {
            exports.math();
            return;
        }
        miniTimer = setTimeout(() => { exports.selGame(); }, 3600000);
        let time = new Date().getHours();
        if (time >= 7 && time <= 22) {
            let question = trivia.data[0];
            let answers = [question.correctAnswer].concat(question.incorrectAnswers);
            function Randomize() {
                for (let i = answers.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [answers[i], answers[j]] = [answers[j], answers[i]];
                }
            }
            Randomize();
            answers.forEach(answer => {
                answers[answers.findIndex(a => a == answer)] = answer.slice(0, 100);
            });
            let embed = new discord_js_1.EmbedBuilder()
                .setColor('LuminousVividPink')
                .setTitle(question.category)
                .setDescription(question.question)
                .addFields([{ value: answers[0], name: 'A.' }, { value: answers[1], name: 'B.' }, { value: answers[2], name: 'C.' }, { value: answers[3], name: 'D.' }])
                .setFooter({ text: 'Do not enter the answer by letter, answer correctly for 50 xp' });
            let row = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.SelectMenuBuilder()
                .addOptions({ value: answers[0], label: answers[0] }, { value: answers[1], label: answers[1] }, { value: answers[2], label: answers[2] }, { value: answers[3], label: answers[3] })
                .setCustomId('guess'));
            if (channel) {
                channel.send({ embeds: [embed], components: [row] }).then(msg => {
                    setTimeout(() => { msg.edit({ components: undefined }); }, 3600000);
                });
                let collector = channel.createMessageComponentCollector({ time: 3600000 });
                let users = [];
                collector.on('collect', interaction => {
                    if (users.includes(interaction.user.id)) {
                        interaction.reply({ ephemeral: true, content: 'Question already attempted.' });
                    }
                    else if (interaction.isSelectMenu()) {
                        users.push(interaction.user.id);
                        if (interaction.values[0] == question.correctAnswer) {
                            interaction.reply(`<@${interaction.user.id}> Chose the correct answer.`);
                            require('./xpmanager.js').give({ author: interaction.user, channel: channel }, 50, false, client);
                        }
                        else {
                            interaction.reply(`<@${interaction.user.id}> Chose incorrectly.`);
                        }
                    }
                });
            }
            else {
                client.channels.cache.get(require('./config.json').server.gamechannel);
            }
        }
    });
};
exports.scramble = function scramble() {
    miniTimer = setTimeout(() => exports.selGame(), 3600000);
    let time = new Date().getHours();
    if (time >= 7 && time <= 22) {
        let words = require('./scramble.json');
        currentWord = words[Math.floor(Math.random() * (words.length))];
        let wordArr = [];
        for (let i = 0; i < currentWord['length']; i++) {
            wordArr.push(currentWord.charAt(i));
        }
        function Randomize() {
            for (let i = wordArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [wordArr[i], wordArr[j]] = [wordArr[j], wordArr[i]];
            }
        }
        while (wordArr.join('') == currentWord) {
            Randomize();
        }
        let embed = new builders_1.Embed()
            .setTitle(`Unscramble the word`)
            .setDescription(wordArr.join(''))
            .setColor(0x00FFFF)
            .setFooter({ text: `You have 2 hours to unscramble for 50 xp` });
        if (channel) {
            channel.send({ embeds: [embed] });
        }
        else {
            client.channels.cache.get(require('./config.json').server.gamechannel);
        }
    }
};
exports.checkWord = function (msg) {
    if (currentWord && msg.content.toLowerCase() == currentWord.toLowerCase() && !(msg.channel instanceof discord_js_1.StageChannel)) {
        msg.channel.send(`<@${msg.author.id}> solved the problem.`);
        require('./xpmanager.js').give(msg, 50, false, client);
        currentWord = '';
    }
};
