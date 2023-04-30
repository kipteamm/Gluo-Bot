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
    name: `unmute`,
    description: `Un-timeouts an user`,
    defer: true,
    permissions: [
        'KickMembers',
        'ModerateMembers'
    ],
    args: [
        {
            name: 'user',
            type: ArgType.Member,
            description: `The user to remove their timeout`,
            required: true
        },
        {
            name: 'reason',
            type: ArgType.String,
            description: `The reason to timeout this user for`,
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

        const isTimedOut = member.communicationDisabledUntil && member.communicationDisabledUntil.getTime() > Date.now()
        if (!isTimedOut) {
            await i.editReply(`${member.user.tag} is not timed out!`)
            return false
        }

        const timed = await member.disableCommunicationUntil(null, reason).catch(noop)
        if (!timed) {
            await i.editReply(`Failed to remove timeout from ${member.user.tag}.`)
            return false
        }

        await i.editReply(`Successfully removed timeout from ${member.user.tag}!`)

        await this.config.modLogsChannel?.send(`${userMention(i.user.id)} removed timeout from ${userMention(member.id)} for \`${reason}\``)

        return true 
    }
})