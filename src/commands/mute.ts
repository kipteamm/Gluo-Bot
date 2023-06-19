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
    name: `mute`,
    description: `Timeouts an user`,
    defer: true,
    permissions: [
        'KickMembers',
        'ModerateMembers'
    ],
    args: [
        {
            name: 'user',
            type: ArgType.Member,
            description: `The user to timeout`,
            required: true
        },
        {
            name: `duration`,
            type: ArgType.String,
            description: `How long to time this user out for`,
            required: true
        },
        {
            name: 'reason',
            type: ArgType.String,
            description: `The reason to timeout this user for`,
            default: () => NoReason
        },
    ],
    async execute(i, [ member, time, reason ]) {
        if (!PermissionManager.hasHigherRole(i.member, member)) {
            await i.editReply({
                content: `You cannot manage ${member.user.username}.`
            })
            return false
        }

        const ms = TimeParser.parseToMS(time)
        if (ms < 1) {
            await i.editReply(`Please provide a valid timeout duration.`)
            return false
        }

        const isTimedOut = member.communicationDisabledUntil && member.communicationDisabledUntil.getTime() > Date.now()
        if (isTimedOut) {
            await i.editReply(`${member.user.username} is already timed out!`)
            return false
        }

        const timed = await member.disableCommunicationUntil(new Date(Date.now() + ms), reason).catch(noop)
        if (!timed) {
            await i.editReply(`Failed to time ${member.user.username} out.`)
            return false
        }

        await i.editReply(`Successfully timed ${member.user.username} out!`)

        await this.config.modLogsChannel?.send(`${userMention(i.user.id)} timed ${userMention(member.id)} out for \`${
            TimeParser.parseToString(ms)
        }\` for \`${reason}\``)

        return true 
    }
})