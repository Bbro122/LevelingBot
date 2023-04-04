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
//import { UserProfile, XpManager } from "./xpmanager";
const canvas_1 = __importDefault(require("canvas"));
let xpmanager = require('./modules/xpmanager');
let fs = require('fs');
const client = new discord_js_1.Client({ partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction, discord_js_1.Partials.GuildMember, discord_js_1.Partials.User], intents: 131071 });
let game = require('./gamemanager.js');
let axios = require('axios');
let config = require("./config.json");
let medals = ['🥇', '🥈', '🥉'];
let charMap = "`~1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]};:'.>,<qwertyuiopasdfghjklzxcvbnm /?|" + '"';
function checkOwner(interaction, reply) {
    var _a;
    let permissions = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions;
    if (permissions && typeof permissions != 'string') {
        if (permissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            return true;
        }
        else {
            if (reply) {
                interaction.reply("This command is reserved for Ministry usage only.");
            }
            return false;
        }
    }
}
function getWelcomeBanner(imagelink) {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = canvas_1.default.createCanvas(1200, 300);
        let context = canvas.getContext('2d');
        context.drawImage(yield canvas_1.default.loadImage(imagelink), 478, 51, 203, 203);
        context.drawImage(yield canvas_1.default.loadImage('./welcome.png'), 0, 0, 1200, 300);
        return canvas.toBuffer('image/png');
    });
}
function getImage(exp, requirement, username, number, level, imagelink, rank, ministry, namecard) {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = canvas_1.default.createCanvas(1200, 300);
        let context = canvas.getContext('2d');
        context.fillStyle = '#171717';
        context.fillRect(0, 0, 1200, 300);
        context.fillStyle = '#171717';
        context.fillRect(325, 200, 800, 50);
        context.fillStyle = '#00EDFF';
        context.fillRect(325, 200, Math.round((exp - xpmanager.getLevel(level - 1)) / (requirement - xpmanager.getLevel(level - 1)) * 800), 50);
        context.drawImage(yield canvas_1.default.loadImage(imagelink), 50, 50, 200, 200);
        //if (ministry) { context.drawImage(await can.loadImage('./MinistrySymbol.png'), 500, 71, 26, 30); context.drawImage(await can.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300) }
        //else if (overwatch) { context.drawImage(await can.loadImage('./namecards/overwatch.png'), 0, 0, 1200, 300) }
        //else { context.drawImage(await can.loadImage('./namecards/default.png'), 0, 0, 1200, 300) }
        if (namecard) {
            context.drawImage(yield canvas_1.default.loadImage((namecard && typeof namecard == 'string') ? namecard : './namecards/ministry.png'), 0, 0, 1200, 300);
        }
        else {
            if (ministry) {
                context.drawImage(yield canvas_1.default.loadImage('./namecards/ministry.png'), 0, 0, 1200, 300);
            }
            else {
                context.drawImage(yield canvas_1.default.loadImage('./namecards/default.png'), 0, 0, 1200, 300);
            }
        }
        context.fillStyle = '#ffffff';
        context.font = '40px Arial';
        context.fillText(`Rank #${rank}`, 325, 100);
        context.fillText(username, 325, 190);
        let wid = context.measureText(username).width;
        context.font = '30px Arial';
        context.fillText(number, 335 + wid, 192);
        context.fillText(`${exp - xpmanager.getLevel(level - 1)} / ${requirement - xpmanager.getLevel(level - 1)} XP`, 1125 - context.measureText(`${exp - xpmanager.getLevel(level - 1)} / ${requirement - xpmanager.getLevel(level - 1)} XP`).width, 192);
        context.fillStyle = '#00EDFF';
        context.fillText("Level", 960, 75);
        context.font = '60px Arial';
        context.fillText(level, 1043, 75);
        return canvas.toBuffer('image/png');
    });
}
client.on('ready', () => {
});
client.on('interactionCreate', (interaction) => {
    var _a;
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            //Xp Commands
            case 'level':
                {
                    let user = interaction.options.get("user");
                    if (!user) {
                        user = interaction.user;
                    }
                    let xp = xpmanager.getXP(((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) ? interaction.guild.id : '', user.id);
                    interaction.reply(xpmanager.getLevel(xp).toString());
                }
                break;
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
//client.login(config.server.token);
