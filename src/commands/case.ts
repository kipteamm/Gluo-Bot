import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { DatabaseManager } from "../core/DatabaseManager";
import { Command } from "../structures/Command";
import { ArgType } from "../typings/enums/ArgType";
import { NoReason } from "../constants";

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

        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setAuthor({
            name: target.tag,
            iconURL: target.displayAvatarURL({
                size: 2048
            })
        })
        .setTitle(`Case ${c.case}#`)
        .setDescription(c.reason ?? NoReason)
        .setFooter({
            iconURL: mod.displayAvatarURL({ size: 2048 }),
            text: `Issued by ${mod.tag}`
        })
        .setTimestamp(c.issued_at)

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`case_update_${i.user.id}_${c.case}`)
            .setLabel(`Update`)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId(`case_delete_${i.user.id}_${c.case}`)
            .setLabel(`Delete`)
            .setStyle(ButtonStyle.Danger)
        )

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