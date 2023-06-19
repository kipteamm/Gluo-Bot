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
    name: `unban`,
    description: `Unbans an user`,
    defer: true,
    permissions: [
        'KickMembers',
        'ModerateMembers'
    ],
    args: [
        {
            name: 'user',
            type: ArgType.User,
            description: `The user to unban`,
            required: true
        },
        {
            name: 'reason',
            type: ArgType.String,
            description: `The reason to unban this user for`,
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
        if (!isBanned) {
            await i.editReply(`${user.username} is not banned!`)
            return false
        }

        const unbanned = await i.guild.members.unban(user, reason)
        
        if (!unbanned) {
            await i.editReply(`Failed to unban ${user.username}.`)
            return false
        }

        const existing = TempBanManager.timeouts.get(user.id)
        if (existing) {
            clearTimeout(existing)
            TempBanManager.timeouts.delete(user.id)
            await DatabaseManager.tempBan.delete({
                where: {
                    user_id: user.id
                }
            })
        }
        
        await i.editReply(`Successfully unbanned ${user.username}!`)

        await this.config.modLogsChannel?.send(`${userMention(i.user.id)} unbanned ${userMention(user.id)} for \`${reason}\``)

        return true 
    }
})