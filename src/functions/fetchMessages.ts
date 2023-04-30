import { Collection, Message, MessageManager } from "discord.js";
import splitNumber from "./splitNumber";

export default async function(channel: unknown & { messages: MessageManager }, count?: number) {
    const arr = new Array<Message>()
    const times = count ? splitNumber(count, 100) : null;
    let before: string | undefined
    for (let i = 0;i < (times ? times.length : i + 1);i++) {
        const limit = times?.[i] ?? 100 
        const messages = await channel.messages.fetch({
            before,
            limit
        }).then(c => c.filter(c => c.deletable))

        if (!messages.size) break
        before = messages.last()!.id
        arr.push(...messages.values())
    }
    return arr
}