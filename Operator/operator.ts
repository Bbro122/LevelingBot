
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
// |‾‾‾‾  |‾‾‾ ‾‾|‾‾ |   | |‾‾| | 
// └────┐ ├──    |   |   | |──┘ |
//  ____| |___   |   |___| |    |
//______________________________/
import { AttachmentBuilder, Client, ActionRowBuilder, CommandInteraction, GuildMember, Interaction, Message, Embed, TextChannel, SelectMenuInteraction, SelectMenuBuilder, EmbedField, SelectMenuOptionBuilder, User, GuildMemberRoleManager, ButtonBuilder, ButtonInteraction, Partials, GatewayIntentBits, AnyAPIActionRowComponent, AnyComponentBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonStyle, ComponentType } from "discord.js";
import { fork, ChildProcessWithoutNullStreams, ChildProcess } from 'child_process'
const fs = require('fs')
const can = require('canvas')
const client = new Client({ partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User], intents: 131071 });
let server: ChildProcess | undefined;
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//  |‾‾‾‾ |    | |\  | |‾‾‾ ‾‾|‾‾ ‾‾|‾‾  |‾‾‾| |\  | |‾‾‾‾  |
//  |‾‾   |    | | \ | |      |     |    |   | | \ | └────┐ |
//  |     |____| |  \| |___   |   __|__  |___| |  \|  ____| |
//__________________________________________________________/
function checkOwner(interaction: CommandInteraction) {
    if (interaction.user.id == '316243027423395841') {
        return true
    } else {
        interaction.reply("Unpermitted Access- This command is only usable by the regretful one.")
        return false
    }
}
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
// |‾‾| |‾‾‾ |‾‾‾  |‾‾| |‾‾‾| |\  | |‾‾‾  |‾‾‾  ||
// ├─┬┘ ├──  └───┐ |──┘ |   | | \ | └───┐ ├──   ||
// | |  |___  ___| |    |___| |  \|  ___| |___  ||
//______________________________________________//
client.on('ready', async () => {
    try { client.application?.commands.set(require('./commands.json')) } catch (err) { console.log(err) }
})
client.on('interactionCreate', async (interaction: CommandInteraction) => {
    if (interaction.commandName == 'start' && checkOwner(interaction)) {
        if (server == undefined || server.killed) {
            await interaction.reply('Operator has started the development bot.')
            server = fork('./index.js');
            server.on('message', function (data: Buffer) {
                console.log(data.toString());
            });

            server.on('close', async function (code) {
                console.log('Operator instance crashed with ' + code);
                if (code != null) {
                    await interaction.followUp(`Operator detected a bot crash.\n**Error Code:** ${code}`)
                }
            });
        }
    } else if (interaction.commandName == 'stop' && checkOwner(interaction) && server) {
        if (!server.killed) {
            await interaction.reply('Closing current operator instance.')
            if (server.kill()) {
                await interaction.followUp('Operator has closed the bot successfully.')
            } else {
                await interaction.followUp('Operator was unable to properly close the current instance.')
            }
        }
    } else if (interaction.commandName == 'restart' && checkOwner(interaction) && server && !server.killed) {
        await interaction.reply('Operator has restarted the development bot.')
        server.kill()
        server = fork('./index.js');
        server.on('message', function (data: Buffer) {
            console.log(data.toString());
        });

        server.on('close', async function (code) {
            console.log('Operator instance crashed with ' + code);
            if (code != null) {
                await interaction.followUp(`Operator detected a bot crash.\n**Error Code:** ${code}`)
            }
        });
    }
})
client.login(require('./token.json').token);