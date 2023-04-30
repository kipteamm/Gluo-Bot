import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { DatabaseManager } from "../core/DatabaseManager";
import { Command } from "../structures/Command";
import { ArgType } from "../typings/enums/ArgType";
import { NoReason } from "../constants";
import createCaseOuput from "../functions/createCaseOuput";

export default new Command({
    name: `cases`,
    description: `View all cases of an user`,
    args: [
        {
            name: 'user',
            type: ArgType.User,
            required: true,
            description: `The user to view their cases`
        }
    ],
    permissions: [
        "KickMembers"
    ],
    defer: true,
    async execute(i, [ user ]) {
        const cases = await DatabaseManager.getUserCases(user.id)

        if (!cases.length) {
            await i.editReply({
                content: `User has no cases.`
            })
            return false
        }

        const embeds = new Array<EmbedBuilder>()
        
        for (const c of cases) {
            const target = await this.users.fetch(c.target_id)
            const mod = await this.users.fetch(c.moderator_id)
    
            const { embed } = createCaseOuput(c, i, mod, target)
            embeds.push(embed)
        }

        await i.editReply({
            embeds
        })

        return true
    }
})