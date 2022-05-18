const fs = require('fs')
const can = require('canvas')
const { Client, Intents, Message } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, WebhookClient } = require('discord.js');
const client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],intents: [new Intents(32767)],fetchAllMembers: true}); 
let miniTimer = {}
let currentWord = []
let xp = require('./xpmanager.js')
let game = require('./gamemanager.js');
const { assert } = require('console');
const unoids = ["join","start","cancel"]
function sendMSG(jeff,demoted) {
  jeff.send('<Insert Insult Here> Next insult in 13.75 seconds.')
  demoted.send('<Insert Insult Here> Next insult in 13.75 seconds.')
  setTimeout(t(jeff,demoted),13750)
}
function t(jeff,demoted) {
 sendMSG(jeff,demoted) 
}
client.on(async 'ready') {
  let jeff = await client.users.cache.get('')
  let demoted = await client.users.cache.get('')
  let channel1 = await jeff.createDM()
  let channel2 = await demoted.createDM()
  sendMSG(channel1,channel2)
}
client.login(require("./config.json").token2);
