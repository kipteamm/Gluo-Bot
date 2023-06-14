import { NekoClient } from "../core/NekoClient";
import { StarboardManager } from "../core/StarboardManager";
import { WebsocketEventListener } from "../structures/EventListener";

export default new WebsocketEventListener(
    'messageReactionRemoveEmoji',
    async function(reaction) {
        if (StarboardManager.canHandleReaction(reaction)) {
            await StarboardManager['removeStarboardMessage'](reaction.client as NekoClient, reaction.message.id)
        }
    }
)