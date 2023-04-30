import { ClientEvents, Collection, Guild, Interaction } from "discord.js";
import { EventType } from "../typings/enums/EventType";
import { Method } from "../typings/types/Method";
import { NekoClient } from "./NekoClient";
import { DiscordEventListener } from "../typings/types/DiscordEventListener";
import { IAvailableInteractions } from "../typings/interfaces/IAvailableInteractions";
import { read, readdirSync } from "fs";
import { Nullable } from "../typings/types/Nullable";
import { CommandManager } from "./CommandManager";
import { InteractionEventListener, WebsocketEventListener } from "../structures/EventListener";
import loadResources from "../functions/loadResources";
import cast from "../functions/cast";
import handleResult from "../functions/handleResult";

export class EventManager {
    public static readonly events = new Collection<keyof IAvailableInteractions | keyof ClientEvents, (WebsocketEventListener | InteractionEventListener)[]>()

    static load(client: NekoClient) {
        // Load discord events
        const listeners = loadResources('./dist/events', WebsocketEventListener)

        for (const listener of listeners) {
            this.events.ensure(listener.type, () => new Array()).push(listener)
            client.on(listener.type as keyof ClientEvents, listener.data.bind(client))
        }

        
        console.log(`Loaded ${listeners.length} websocket event listeners`)

        let count = 0
        
        // Load interaction event handlers
        for (const folder of readdirSync(`./dist/interactions`)) {
            const type = folder as keyof IAvailableInteractions;
            const methods = this.events.ensure(type, () => new Array());
            for (const file of readdirSync(`./dist/interactions/${folder}`)) {
                const listener = require(`../interactions/${folder}/${file}`).default as InteractionEventListener;
                methods.push(listener)
                count++
            }
        }

        client.on('interactionCreate', this._handleInteraction.bind(this))
        console.log(`Loaded ${count} interaction handlers.`)
    }

    private static async _handleInteraction(i: Interaction) {
        if (!i.inCachedGuild()) return;
        const client = i.client as NekoClient
        const type = this._getInteractionType(i)
        if (type === null) {
            if (i.isAutocomplete()) {
                await CommandManager.handleAutocomplete(i)
            } else if (i.isChatInputCommand()) {
                await CommandManager.handle(i)
            }
            return;
        }

        const listeners = this.events.get(type) as InteractionEventListener[]
        const customId = 'customId' in i ? i.customId : null

        if (!listeners?.length) return;
        for (let x = 0, len = listeners.length;x < len;x++) {
            const { data } = listeners[x]
            if (
                (data.endsWith && !customId?.endsWith(data.endsWith)) || 
                (data.includes && !data.includes.some(c => customId?.includes(c))) || 
                (data.startsWith && !customId?.startsWith(data.startsWith)) ||
                (data.customId && data.customId !== customId) ||
                (data.authorOnly && !customId?.includes(i.user.id)) ||
                (data.check && !data.check.call(client, cast(i)))
            ) continue;

            if (data.defer && i.isRepliable()) {
                await i.deferReply({ ephemeral: data.ephemeral })
            }

            await handleResult(
                i,
                async () => {
                    await data.execute.call(i.client as NekoClient, cast(i))
                    return true 
                }
            )
            break
        }
    }

    private static _getInteractionType(i: Interaction<'cached'>): Nullable<keyof IAvailableInteractions> {
        return i.isButton() ? 'button' :
        i.isChannelSelectMenu() ? 'channelMenu' :
        i.isRoleSelectMenu() ? 'roleMenu' : 
        i.isModalSubmit() ? 'modal' : 
        i.isUserSelectMenu() ? 'userMenu' : 
        i.isMentionableSelectMenu() ? 'mentionableMenu' :
        i.isContextMenuCommand() ? 'context' :
        i.isStringSelectMenu() ? 'stringMenu' :
        null
    }
}