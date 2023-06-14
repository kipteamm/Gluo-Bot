import { NekoClient } from "../core/NekoClient";
import { StarboardManager } from "../core/StarboardManager";
import { WebsocketEventListener } from "../structures/EventListener";

export default new WebsocketEventListener(
    'messageReactionRemove',
    async function(reaction) {
        if (StarboardManager.canHandleReaction(reaction)) {
            await StarboardManager.handleReactionRemove(await reaction.fetch())
        }
    }
)