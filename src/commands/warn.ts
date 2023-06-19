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
    name: `warn`,
    description: `Warns an user`,
    defer: true,
    permissions: [
        'KickMembers',
        'ModerateMembers'
    ],
    args: [
        {
            name: 'member',
            type: ArgType.Member,
            description: `The user to warn`,
            required: true
        },
        {
            name: 'reason',
            type: ArgType.String,
            default: () => NoReason,
            description: `The reason to warn this user for`
        }
    ],
    async execute(i, [ member, reason ]) {
        if (!PermissionManager.hasHigherRole(i.member, member)) {
            await i.editReply({
                content: `You cannot manage ${member.user.username}.`
            })
            return false
        }

        const warning = await DatabaseManager.addCase({
            moderator_id: i.member.id,
            reason,
            target_id: member.id
        })

        const amount = await DatabaseManager.getWarningAmount(member.id)

        const action = this.config.warnings.find(c => c.amount === amount)
        
        const result = action ? `\nWarning ${markdown(`${amount}#`)} Which resulted in a \`${
            WarningActionType[action.type]
        }\`${
            'duration' in action ? `for ${markdown(
                TimeParser.parseToString(action.duration)
            )}` : ''
        }!` : ''
        
        const realReason = reason ? ` for ${markdown(reason)}` : ''

        await member.send(`You've been warned in ${markdown(i.guild.name)}${realReason}!${result}`).catch(noop)

        if (action) {
            switch (action.type) {
                case WarningActionType.Tempban:
                case WarningActionType.Ban: {
                    await member.ban({
                        reason,
                        deleteMessageSeconds: 1 * 60 * 24,
                    })

                    if (action.type === WarningActionType.Tempban) {
                        const temp = await DatabaseManager.addTempBan(this, {
                            ends_at: Date.now() + action.duration,
                            user_id: member.id
                        })
                        TempBanManager.loadOne(this, temp)
                    }

                    break
                }

                case WarningActionType.Kick: {
                    await member.kick(reason)
                    break
                }

                case WarningActionType.Timeout: {
                    await member.timeout(action.duration, reason)
                    break
                }
            }
        }

        await this.config.modLogsChannel?.send(`Case \`${warning.case}\`: ${markdown(member.user.username)} has been warned by ${markdown(
            i.member.user.username
        )}${realReason}${result}`)

        await i.editReply(`✅ Case ${markdown(warning.case.toString())}: ${markdown(member.user.username)} has been successfully warned!`)

        return true 
    }
})