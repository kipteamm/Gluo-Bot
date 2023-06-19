import { ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, User } from "discord.js"
import { NoReason } from "../constants"
import { Warning } from "@prisma/client"
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders"

export default function(c: Warning, i: ChatInputCommandInteraction<'cached'>, mod: User, target: User) {
    const embed = new EmbedBuilder()
    .setColor('Blue')
    .setAuthor({
        name: target.username,
        iconURL: target.displayAvatarURL({
            size: 2048
        })
    })
    .setTitle(`Case ${c.case}#`)
    .setDescription(c.reason ?? NoReason)
    .setFooter({
        iconURL: mod.displayAvatarURL({ size: 2048 }),
        text: `Issued by ${mod.username}`
    })
    .setTimestamp(c.issued_at)

    const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`case_update_${i.user.id}_${c.case}`)
        .setLabel(`Update`)
        .setStyle(ButtonStyle
        .Primary),
        new ButtonBuilder()
        .setCustomId(`case_delete_${i.user.id}_${c.case}`)
        .setLabel(`Delete`)
        .setStyle(ButtonStyle.Danger)
    )

    return {
        embed,
        row
    }
}