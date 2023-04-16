import { AuditLogEvent, GuildAuditLogsEntry, GuildBasedChannel, Role, User, roleMention } from "discord.js";
import { AsyncMethod, Method } from "./typings/types/Method";
import { NekoClient } from "./core/NekoClient";
import { Nullable } from "./typings/types/Nullable";
import Parser from "ms-utility"
import { inspect } from "util";
import markdown from "./functions/markdown";

type LogObject = Partial<{
    [P in keyof Record<AuditLogEvent, string>]: AsyncMethod<[
        entry: GuildAuditLogsEntry<P>
    ], Nullable<string>, NekoClient>
}>

export const AuditLogEntryDescription: LogObject = {
    [AuditLogEvent.MemberKick](action) {
        return `${markdown(action.executor?.tag)} kicked ${markdown(action.target?.tag)} for ${markdown(action.reason ?? NoReason)}`
    },
    [AuditLogEvent.MemberUpdate](action) {
        const timeout = action.changes.find(c => c.key === 'communication_disabled_until')
        if (!timeout) return null;
        return `${markdown(action.executor?.tag)} ${
            timeout.new ? `timed ${markdown(action.target?.tag)} out for ${markdown(
                TimeParser.parseToString(
                    new Date(timeout.new as string).getTime() - Date.now()
                )
            )} for ${markdown(action.reason ?? NoReason)}` :
            `removed timeout from ${markdown(action.target?.tag)}`
        }`
    },
    [AuditLogEvent.MemberBanAdd](action) {
        return `${markdown(action.executor?.tag)} banned ${markdown(action.target?.tag)} for ${markdown(action.reason) ?? NoReason}`
    },
    [AuditLogEvent.MemberBanRemove](action) {
        return `${markdown(action.executor?.tag)} removed ban from ${markdown(action.target?.tag)}`
    },
    [AuditLogEvent.ChannelCreate](action) {
        return `${markdown(action.executor?.tag)} created channel ${markdown(action.target.name as string)}`
    },
    [AuditLogEvent.ChannelDelete](action) {
        return `${markdown(action.executor?.tag)} deleted channel ${markdown(action.target.name as string)}`
    },
    [AuditLogEvent.RoleCreate](action) {
        return `${markdown(action.executor?.tag)} created role ${roleMention(action.target!.id)}`
    },
    [AuditLogEvent.RoleDelete](action) {
        return `${markdown(action.executor?.tag)} deleted role ${roleMention(action.target!.id)}`
    },
    [AuditLogEvent.MemberRoleUpdate](action) {
        return `${markdown(action.executor?.tag)} updated role(s) for ${markdown(action.target?.tag)}:\n${
            action.changes.map(
                c => {
                    const data = c.new as { id: string }[]
                    return data.map(
                        d => `${c.key === '$add' ? 'Added' : 'Removed'} <@&${d.id}>`
                    ).join('\n')
                }
            ).join('\n')
        }`
    },
}

export const NoReason = 'No reason provided'
export const TimeParser = new Parser()