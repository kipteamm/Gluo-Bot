import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { DatabaseManager } from "../core/DatabaseManager";
import { Command } from "../structures/Command";
import { ArgType } from "../typings/enums/ArgType";
import { NoReason } from "../constants";
import createCaseOuput from "../functions/createCaseOuput";

export default new Command({
    name: `case`,
    description: `View a case`,
    args: [
        {
            name: 'case',
            type: ArgType.Integer,
            min: 1,
            required: true,
            description: `The case to view`
        }
    ],
    permissions: [
        "KickMembers"
    ],
    defer: true,
    async execute(i, [ id ]) {
        const c = await DatabaseManager.getCase(id)
        if (!c) {
            await i.editReply(`Case not found.`)
            return false
        }

        const target = await this.users.fetch(c.target_id)
        const mod = await this.users.fetch(c.moderator_id)

        const { embed, row } = createCaseOuput(c, i, mod, target)

        await i.editReply({
            embeds: [
                embed
            ],
            components: [
                row
            ]
        })

        return true
    }
})