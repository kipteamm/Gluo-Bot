import { BaseInteraction, DiscordAPIError, Interaction, Message } from "discord.js";
import noop from "./noop";

/**
 * Returns whether this was run successfully.
 * @param i 
 * @param fn 
 */
export default async function(i: Interaction | Message, fn: () => boolean | Promise<boolean>): Promise<boolean> {
    try {
        return await fn()
    } catch (error: any) {
        const reply = `There was an error whilst trying to execute this listener:\n\`\`\`js\n${error.message}\`\`\`\nThe error has been logged.`
        if (i instanceof BaseInteraction) {
            if (i.isRepliable()) {
                if (i.replied || i.deferred) await i.editReply(reply).catch(noop)
                else await i.reply({
                    ephemeral: true,
                    content: reply
                }).catch(noop)
            }
        } else {
            await i.reply(reply).catch(noop)
        }
        console.error(error)
        return false
    }
}