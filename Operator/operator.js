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
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
//______________________________/
const discord_js_1 = require("discord.js");
const child_process_1 = require("child_process");
const fs = require('fs');
const can = require('canvas');
const client = new discord_js_1.Client({ partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction, discord_js_1.Partials.GuildMember, discord_js_1.Partials.User], intents: 131071 });
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
    var _a;
    try {
        (_a = client.application) === null || _a === void 0 ? void 0 : _a.commands.set(require('./commands.json'));
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
                    console.log('Operator instance crashed with ' + code);
                    if (code != null) {
                        yield interaction.followUp(`Operator detected a bot crash.\n**Error Code:** ${code}`);
                    }
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
    else if (interaction.commandName == 'restart' && checkOwner(interaction) && server && !server.killed) {
        yield interaction.reply('Operator has restarted the development bot.');
        server.kill();
        server = (0, child_process_1.fork)('./index.js');
        server.on('message', function (data) {
            console.log(data.toString());
        });
        server.on('close', function (code) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('Operator instance crashed with ' + code);
                if (code != null) {
                    yield interaction.followUp(`Operator detected a bot crash.\n**Error Code:** ${code}`);
                }
            });
        });
    }
}));
client.login(require('./token.json').token);
