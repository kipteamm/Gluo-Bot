import { NekoClient } from "../core/NekoClient";
import { StarboardManager } from "../core/StarboardManager";
import { WebsocketEventListener } from "../structures/EventListener";

export default new WebsocketEventListener(
    'messageReactionRemoveAll',
    async function(msg) {
        if (StarboardManager.canHandleMessage(msg)) {
            await StarboardManager['removeStarboardMessage'](msg.client as NekoClient, msg.id)
        }
    }
)