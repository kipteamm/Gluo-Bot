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
    name: `tempban`,
    description: `Temp bans an user`,
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
            name: 'time',
            type: ArgType.String,
            required: true,
            description: `The time to ban this user for`
        },
        {
            name: 'reason',
            type: ArgType.String,
            default: () => NoReason,
            description: `The reason to ban this user for`
        },
    ],
    async execute(i, [ user, time, reason ]) {
        const member = await i.guild.members.fetch(user.id).catch(noop)
        if (member && !PermissionManager.hasHigherRole(i.member, member)) {
            await i.editReply({
                content: `You cannot manage ${user.tag}.`
            })
            return false
        }

        const ms = TimeParser.parseToMS(time)
        if (ms < 1) {
            await i.editReply(`Please provide a valid ban duration.`)
            return false
        }

        const isBanned = await i.guild.bans.fetch(user).catch(noop)
        if (isBanned) {
            await i.editReply(`${user.tag} is already banned!`)
            return false
        }

        const banned = await i.guild.members.ban(user, {
            reason
        })
        
        if (!banned) {
            await i.editReply(`Failed to ban ${user.tag}.`)
            return false
        }
        
        await TempBanManager.create(this, {
            ends_at: Date.now() + ms,
            user_id: user.id
        })

        await i.editReply(`Successfully banned ${user.tag} for \`${
            TimeParser.parseToString(ms)
        }\``)

        await this.config.modLogsChannel?.send(`${userMention(i.user.id)} banned ${userMention(user.id)} for \`${
            TimeParser.parseToString(ms)
        }\` for \`${reason}\``)

        return true 
    }
})