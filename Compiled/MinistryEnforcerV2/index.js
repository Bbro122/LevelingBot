"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
//import { UserProfile, XpManager } from "./xpmanager";
//import can from 'canvas';
//let fs = require('fs')
const client = new discord_js_1.Client({ partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction, discord_js_1.Partials.GuildMember, discord_js_1.Partials.User], intents: 131071 });
//let xp: XpManager = require('./xpmanager.js')
//let game = require('./gamemanager.js');
//let axios = require('axios')
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
            case 'setup': {
                const modal = new discord_js_1.ModalBuilder()
                    .setCustomId('setup')
                    .setTitle('Nothing entered will disable feature.');
                const row = new discord_js_1.ActionRowBuilder();
                const gameChannel = new discord_js_1.TextInputBuilder()
                    .setCustomId('gameChannel')
                    .setLabel('ID of Game Channel')
                    .setStyle(discord_js_1.TextInputStyle.Short);
                const countChannel = new discord_js_1.TextInputBuilder()
                    .setCustomId('countChannel')
                    .setLabel('ID of Count Channel')
                    .setStyle(discord_js_1.TextInputStyle.Short);
                const unoChannel = new discord_js_1.TextInputBuilder()
                    .setCustomId('unoChannel')
                    .setLabel('ID of Uno Thread')
                    .setStyle(discord_js_1.TextInputStyle.Short);
                const cahChannel = new discord_js_1.TextInputBuilder()
                    .setCustomId('cahChannel')
                    .setLabel('ID of Cah Thread')
                    .setStyle(discord_js_1.TextInputStyle.Short);
                modal.setComponents([row.setComponents([gameChannel, countChannel, unoChannel, cahChannel])]);
                interaction.showModal(modal);
            }
        }
    }
    else if (interaction.isModalSubmit()) {
        if (interaction.customId == 'setup') {
        }
    }
});
client.login(config.server.token);
