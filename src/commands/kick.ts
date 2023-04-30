import { userMention } from "discord.js";
import { NoReason, TimeParser } from "../constants";
import { DatabaseManager } from "../core/DatabaseManager";
import { PermissionManager } from "../core/PermissionManager";
import { TempBanManager } from "../core/TempBanManager";
import markdown from "../functions/markdown";
import noop from "../functions/noop";
import { Command } from "../structures/Command";
import { ArgType } from "../typings/enums/ArgType";
import { WarningActionType } from "../typings/enums/WarningActionType";

export default new Command({
    name: `kick`,
    description: `Kicks an user`,
    defer: true,
    permissions: [
        'KickMembers',
        'ModerateMembers'
    ],
    args: [
        {
            name: 'member',
            type: ArgType.Member,
            description: `The user to kick`,
            required: true
        },
        {
            name: 'reason',
            type: ArgType.String,
            description: `The reason to kick this user for`,
            default: () => NoReason
        },
    ],
    async execute(i, [ member, reason ]) {
        if (!PermissionManager.hasHigherRole(i.member, member)) {
            await i.editReply({
                content: `You cannot manage ${member.user.tag}.`
            })
            return false
        }

        const kicked = await i.guild.members.kick(member, reason)
        
        if (!kicked) {
            await i.editReply(`Failed to kick ${member.user.tag}.`)
            return false
        }

        await i.editReply(`Successfully kicked ${member.user.tag}!`)

        await this.config.modLogsChannel?.send(`${userMention(i.user.id)} kicked ${userMention(member.user.id)} for \`${reason}\``)

        return true 
    }
})