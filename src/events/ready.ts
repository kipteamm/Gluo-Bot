import { inspect } from "util";
import { CommandManager } from "../core/CommandManager";
import { EventManager } from "../core/EventManager";
import { TempBanManager } from "../core/TempBanManager";
import { WebsocketEventListener } from "../structures/EventListener";

export default new WebsocketEventListener('ready', async function() {
    console.log(`Ready on client ${this.user.username}!`)
    await this.application.commands.set(CommandManager.json)
    await TempBanManager.load(this)
})