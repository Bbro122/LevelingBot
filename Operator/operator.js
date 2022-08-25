"use strict";
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
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
const child_process_1 = require("child_process");
//______________________________/
const fs = require('fs');
const can = require('canvas');
const { Client, Intents, Message } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, WebhookClient } = require('discord.js');
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'], intents: [new Intents(32767)], fetchAllMembers: true });
let server;
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
function checkOwner(interaction) {
    if (interaction.user.id == '316243027423395841') {
        return true;
    }
    else {
        interaction.reply("Unpermitted Access- This command is only usable by the regretful one.");
        return false;
    }
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client.guilds.cache.get('632995494305464331').commands.set(require('./commands.json'));
    }
    catch (err) {
        console.log(err);
    }
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.commandName == 'start' && checkOwner(interaction)) {
        if (server == undefined || server.killed) {
            yield interaction.reply('Operator has started the development bot.');
            server = (0, child_process_1.fork)('./index.js');
            server.on('message', function (data) {
                console.log(data.toString());
            });
            server.on('close', function (code) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('operator instance crashed with ' + code);
                    yield interaction.followUp(`Operator detected a bot crash.\n**Error Code:** ${code}`);
                });
            });
        }
    }
    else if (interaction.commandName == 'stop' && checkOwner(interaction) && server) {
        if (!server.killed) {
            yield interaction.reply('Closing current operator instance.');
            if (server.kill()) {
                yield interaction.followUp('Operator has closed the bot successfully.');
            }
            else {
                yield interaction.followUp('Operator was unable to properly close the current instance.');
            }
        }
    }
}));
client.login("NTg1MjQ4NjI4MjgxNTczMzk3.XPWtQg.0dfaOW1hRJS9hwwMO9DiRLoIlFk");