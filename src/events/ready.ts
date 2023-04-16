import { inspect } from "util";
import { CommandManager } from "../core/CommandManager";
import { EventManager } from "../core/EventManager";
import { TempBanManager } from "../core/TempBanManager";

export default EventManager.createWebsocketEventListener('ready', async function() {
    console.log(`Ready on client ${this.user.tag}!`)
    await this.application.commands.set(CommandManager.json)
    await TempBanManager.load(this)
})