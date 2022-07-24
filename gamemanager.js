"use strict";
exports.__esModule = true;
var client;
var channel;
var currentWord;
var miniTimer;
function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.setup = function setup(client1, channel1) {
    client = client1;
    channel = channel1;
};
exports.selGame = function selectGame() {
    if (randomize(0, 1)) {
        exports.scramble();
    }
    else {
        exports.math();
    }
};
exports.math = function math() {
    miniTimer = setTimeout(function () { return exports.selGame(); }, 7200000);
    var time = new Date().getHours();
    if (time >= 7 && time <= 22) {
        var termCount = randomize(2, require('./config.json').maxTerms);
        var terms = '';
        var expressions = ['+', '-', '*'];
        for (var i = 0; i < termCount; i++) {
            terms = terms + randomize(5, 25).toString() + " ";
            if (i + 1 < termCount) {
                terms = terms + expressions[randomize(0, 2)] + " ";
            }
        }
        currentWord = eval(terms).toString();
        var embed = {
            "type": "rich",
            "title": "Solve the problem",
            "description": terms,
            "color": 0x00FFFF,
            "footer": {
                "text": "You have 2 hours to solve for 50 xp"
            }
        };
        channel.send({ embeds: [embed] });
    }
};
exports.scramble = function scramble() {
    miniTimer = setTimeout(function () { return exports.selGame(); }, 7200000);
    var time = new Date().getHours();
    if (time >= 7 && time <= 22) {
        var words = require('./scramble.json');
        currentWord = words[Math.floor(Math.random() * (words.length))];
        var wordArr_1 = [];
        for (var i = 0; i < currentWord['length']; i++) {
            wordArr_1.push(currentWord.charAt(i));
        }
        function Randomize() {
            var _a;
            for (var i = wordArr_1.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                _a = [wordArr_1[j], wordArr_1[i]], wordArr_1[i] = _a[0], wordArr_1[j] = _a[1];
            }
        }
        Randomize();
        if (wordArr_1.join('') == currentWord) {
            Randomize();
        }
        var embed = {
            "type": "rich",
            "title": "Unscramble the word",
            "description": wordArr_1.join(''),
            "color": 0x00FFFF,
            "footer": {
                "text": "You have 2 hours to unscramble for 50 xp"
            }
        };
        channel.send({ embeds: [embed] });
    }
};
exports.checkWord = function (msg) {
    if (msg.content.toLowerCase() == currentWord) {
        msg.channel.send("<@".concat(msg.author.id, "> solved the problem."));
        require('./xpmanager.js').give(msg, 50, false, client);
        currentWord = '';
    }
};
