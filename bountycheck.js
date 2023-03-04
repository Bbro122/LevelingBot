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
const axios = require('axios');
const fs = require('fs');
let bountychannel;
function bountyCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = getBountyData();
        data.users.forEach((bounty) => __awaiter(this, void 0, void 0, function* () {
            let hypixelresponse = yield axios.get(`https://api.hypixel.net/player?key=0980e33a-8052-4c48-aca7-2117c200ba09&uuid=${bounty.uuid}`);
            if (hypixelresponse && hypixelresponse.data.player.lastLogin != bounty.lastLogin) {
                let announceString = "";
                bounty.trackers.forEach(tracker => {
                    announceString = announceString + `<@${tracker}> `;
                });
                announceString = announceString + `A log on has been detected for ${hypixelresponse.data.player.displayname} at <t:${Math.round(hypixelresponse.data.player.lastLogin / 1000)}:F>`;
                bounty.lastLogin = hypixelresponse.data.player.lastLogin;
                fs.writeFileSync('./bountydata.json', JSON.stringify(data));
                bountychannel.send(announceString);
            }
        }));
    });
}
function getBountyData() {
    return require('./bountydata.json');
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sync = function sync(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        bountychannel = channel;
        while (true) {
            bountyCheck();
            yield sleep(300000);
        }
    });
};
