import { Message } from "discord.js";
import handleLinks from "../functions/handleLinks";
import { WebsocketEventListener } from "../structures/EventListener";

export default new WebsocketEventListener('messageCreate', async function(m) {
    if (m.author.bot || m.partial) return;
    await handleLinks(m as Message<true>)
})