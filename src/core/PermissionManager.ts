import { GuildMember } from "discord.js";
import { NekoClient } from "./NekoClient";

export class PermissionManager {
    static canBan(executor: GuildMember, target: GuildMember) {
        return executor.permissions.has('BanMembers') && 
        this.hasHigherRole(executor, target)
    }

    static canKick(executor: GuildMember, target: GuildMember) {
        return executor.permissions.has('KickMembers') &&
        this.hasHigherRole(executor, target)
    }

    static canTimeout(executor: GuildMember, target: GuildMember) {
        return !target.permissions.has('Administrator') && 
        executor.permissions.has('ModerateMembers') &&
        this.hasHigherRole(executor, target)
    }

    static canNick(executor: GuildMember, target: GuildMember) {
        return executor.permissions.has('ManageNicknames') &&
        this.hasHigherRole(executor, target)
    }

    static hasHigherRole(executor: GuildMember, target: GuildMember) {
        return executor.roles.highest.position > target.roles.highest.position
    }
}