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
    name: `softban`,
    description: `Soft-bans an user`,
    defer: true,
    permissions: [
        'KickMembers',
        'ModerateMembers'
    ],
    args: [
        {
            name: 'user',
            type: ArgType.User,
            description: `The user to soft-ban`,
            required: true
        },
        {
            name: 'reason',
            type: ArgType.String,
            description: `The reason to soft-ban this user for`,
            default: () => NoReason
        },
        {
            name: `days`,
            type: ArgType.Integer,
            min: 1,
            max: 14,
            default: () => 7,
            description: `How many days to delete user messages`
        }
    ],
    async execute(i, [ user, reason, days ]) {
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
            reason,
            deleteMessageSeconds: days * 24 * 60 * 60 
        })
        
        if (!banned) {
            await i.editReply(`Failed to softban ${user.username}.`)
            return false
        }

        await i.guild.members.unban(user)

        await i.editReply(`Successfully soft-banned ${user.username}!`)

        await this.config.modLogsChannel?.send(`${userMention(i.user.id)} soft-banned ${userMention(user.id)} for \`${reason}\``)

        return true 
    }
})