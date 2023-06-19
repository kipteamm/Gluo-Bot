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
    name: `ban`,
    description: `Bans an user`,
    defer: true,
    permissions: [
        'KickMembers',
        'ModerateMembers'
    ],
    args: [
        {
            name: 'user',
            type: ArgType.User,
            description: `The user to ban`,
            required: true
        },
        {
            name: 'reason',
            type: ArgType.String,
            description: `The reason to ban this user for`,
            default: () => NoReason
        },
    ],
    async execute(i, [ user, reason ]) {
        const member = await i.guild.members.fetch(user.id).catch(noop)
        if (member && !PermissionManager.hasHigherRole(i.member, member)) {
            await i.editReply({
                content: `You cannot manage ${user.username}.`
            })
            return false
        }

        const isBanned = await i.guild.bans.fetch(user).catch(noop)
        if (isBanned) {
            await i.editReply(`${user.username} is already banned!`)
            return false
        }

        const banned = await i.guild.members.ban(user, {
            reason
        })
        
        if (!banned) {
            await i.editReply(`Failed to ban ${user.username}.`)
            return false
        }

        await i.editReply(`Successfully banned ${user.username}!`)

        await this.config.modLogsChannel?.send(`${userMention(i.user.id)} banned ${userMention(user.id)} for \`${reason}\``)

        return true 
    }
})