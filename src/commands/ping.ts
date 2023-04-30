import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../structures/Command";
import { ArgType } from "../typings/enums/ArgType";

export default new Command({
    name: 'ping',
    description: 'Returns the bot\'s ping (it doesn\'t actually)!',
    async execute(i, args) {
        await i.reply('Pong!')
        return true
    },
})