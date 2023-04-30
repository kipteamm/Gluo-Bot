import { TempBan } from "@prisma/client";
import noop from "../functions/noop";
import sleep from "../functions/sleep";
import { DatabaseManager } from "./DatabaseManager";
import { NekoClient } from "./NekoClient";

export class TempBanManager {
    static timeouts = new Map<string, NodeJS.Timeout>()

    static async load(client: NekoClient) {
        const tempbans = await DatabaseManager.tempBan.findMany()
        for (const temp of tempbans) {
            this.loadOne(client, temp)
        }
    }

    static async loadOne(client: NekoClient, temp: TempBan) {
        const time = sleep(temp.ends_at - Date.now(), (timeout) => {
            this.timeouts.set(temp.user_id, timeout)
        })
        await time
        await DatabaseManager.tempBan.delete({
            where: {
                user_id: temp.user_id
            }
        })
        await client.config.guild.bans.remove(temp.user_id).catch(noop)
        console.log(`User with ID ${temp.user_id} has been unbanned.`)
    }

    static async create(client: NekoClient, data: TempBan) {
        const existing = this.timeouts.get(data.user_id)
        if (existing) {
            clearTimeout(existing)
            this.timeouts.delete(data.user_id)
        }

        const update = await DatabaseManager.tempBan.upsert({
            create: data,
            update: {
                ends_at: data.ends_at
            },
            where: {
                user_id: data.user_id
            }
        })

        this.loadOne(client, data)
        return update
    }
}