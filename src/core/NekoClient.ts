import { Channel, Client, GuildAuditLogsEntry } from "discord.js";
import dotenv from "dotenv"
import config from "../config";
import { Nullable } from "../typings/types/Nullable";
dotenv.config()

export class NekoClient extends Client<true> {
    public config!: ReturnType<typeof config> 

    public login(): Promise<string> {
        this.once('ready', () => void (this.config = config(this)))
        return super.login(process.env['TOKEN'])
    }

    getChannel<T extends Channel>(id: string) {
        return this.channels.cache.get(id) as Nullable<T> 
    }

    getUser(id: string) {
        return this.users.fetch(id)
    }

    async fetchEntryInfo(entry: GuildAuditLogsEntry) {
        if (entry.executorId) await this.users.fetch(entry.executorId)
        if (entry.targetType === 'User') await this.users.fetch(entry.targetId!)
    }
}