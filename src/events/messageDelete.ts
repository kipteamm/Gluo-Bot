import { NekoClient } from "../core/NekoClient";
import { StarboardManager } from "../core/StarboardManager";
import { WebsocketEventListener } from "../structures/EventListener";

export default new WebsocketEventListener(
    'messageDelete',
    async function(data) {
        await StarboardManager['removeStarboardMessage'](data.client as NekoClient, data.id)
    }
)