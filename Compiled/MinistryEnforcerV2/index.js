"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let fs = require('fs');
const client = new discord_js_1.Client({ partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction, discord_js_1.Partials.GuildMember, discord_js_1.Partials.User], intents: 131071 });
//let xp: XpManager = require('./xpmanager.js')
let game = require('./gamemanager.js');
let axios = require('axios');
let config = require("./config.json");
let medals = ['🥇', '🥈', '🥉'];
let charMap = "`~1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]};:'.>,<qwertyuiopasdfghjklzxcvbnm /?|" + '"';
client.on('ready', () => {
});
client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case 'addbounty':
                {
                }
                break;
            case 'removebounty':
                {
                }
                break;
        }
    }
});
client.login(config.server.token);
