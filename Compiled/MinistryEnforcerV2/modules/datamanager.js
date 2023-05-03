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
exports.ServerDataManager = void 0;
const fs_1 = __importDefault(require("fs"));
const types_1 = require("./types");
// Functions
const _ = {
    onStart(client) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(fs_1.default.readdirSync('./data'));
            yield client.guilds.fetch();
            client.guilds.cache.forEach(guild => {
                console.log(fs_1.default.existsSync('./modules'));
                if (!fs_1.default.existsSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guild.id}`)) {
                    exports.registerServer(guild.id);
                }
                guild.commands.set(require('/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/commands.json'));
            });
        });
    },
    getGlobalXPData() {
        let path = `./data/userData.json`;
        if (fs_1.default.existsSync(path)) {
            return require(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/userData.json`);
        }
        return new types_1.UserData();
    },
    listServers() {
        return fs_1.default.readdirSync('/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata');
    },
    registerServer(guildID) {
        if (!fs_1.default.existsSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}`)) {
            fs_1.default.mkdirSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}`);
            fs_1.default.writeFileSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/userData.json`, JSON.stringify(new types_1.UserData(guildID)));
            fs_1.default.writeFileSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/guildSettings.json`, JSON.stringify(new types_1.GuildSettings(guildID)));
        }
    },
    getServer(guildID) {
        return new ServerDataManager(guildID);
    },
    readFile(file) {
        return require(file);
    },
    writeFile(file, data) {
        fs_1.default.writeFileSync(file, data);
    },
    write(data) {
        console.log(data);
        switch (true) {
            case data.fileCode.endsWith('global'):
                {
                    fs_1.default.writeFileSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/userData.json`, JSON.stringify(data));
                }
                break;
            case data.fileCode.startsWith("userData"):
                {
                    const serverID = data.fileCode.match(/[0-9]+/);
                    fs_1.default.writeFileSync(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${serverID}/userData.json`, JSON.stringify(data));
                }
                break;
            default:
                break;
        }
    },
    pathTest(path) {
        return fs_1.default.readdirSync(path);
    }
};
exports.default = _;
class ServerDataManager {
    constructor(guildID) {
        this.getXPData = function () {
            let path = `/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/userData.json`;
            if (fs_1.default.existsSync(path)) {
                return require(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/userData.json`);
            }
            else {
                return false;
            }
        };
        this.getSettings = function () {
            let path = `/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/guildSettings.json`;
            if (fs_1.default.existsSync(path)) {
                return require(`/workspaces/LevelingBot/Compiled/MinistryEnforcerV2/data/serverdata/${guildID}/guildSettings.json`);
            }
            else {
                return false;
            }
        };
        this.getSetting = function (setting) {
            let settings = this.getSettings();
            if (settings) {
                return eval(`settings.${setting}`);
            }
            else {
                return false;
            }
        };
    }
}
exports.ServerDataManager = ServerDataManager;
