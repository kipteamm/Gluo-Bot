import { TempBan } from "@prisma/client";
import noop from "../functions/noop";
import sleep from "../functions/sleep";
import { DatabaseManager } from "./DatabaseManager";
import { NekoClient } from "./NekoClient";

export class TempBanManager {
    static async load(client: NekoClient) {
        const tempbans = await DatabaseManager.tempBan.findMany()
        for (const temp of tempbans) {
            this.loadOne(client, temp)
        }
    }

    static async loadOne(client: NekoClient, temp: TempBan) {
        await sleep(temp.ends_at - Date.now())
        await DatabaseManager.tempBan.delete({
            where: {
                user_id: temp.user_id
            }
        })
        await client.config.guild.bans.remove(temp.user_id).catch(noop)
        console.log(`User with ID ${temp.user_id} has been unbanned.`)
    }
}