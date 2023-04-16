import { ClientEvents, Collection, Guild, Interaction } from "discord.js";
import { EventType } from "../typings/enums/EventType";
import { Method } from "../typings/types/Method";
import { IEventData } from "../typings/interfaces/IEventData";
import { NekoClient } from "./NekoClient";
import { DiscordEventListener } from "../typings/types/DiscordEventListener";
import { IAvailableInteractions } from "../typings/interfaces/IAvailableInteractions";
import { InteractionEventListener } from "../typings/types/InteractionEventListener";
import { readdirSync } from "fs";
import { Nullable } from "../typings/types/Nullable";
import { CommandManager } from "./CommandManager";

export class EventManager {
    public static readonly events = new Collection<EventType, Collection<string, Method[]>>()

    private static _register(client: NekoClient, data: IEventData) {
        const arr = this.events.ensure(data.type, () => new Collection()).ensure(data.id, () => new Array())
        arr.push(data.listener)
    }

    private static _setupHandlers(client: NekoClient) {
        for (const [ type, col ] of this.events) {
            switch (type) {
                case EventType.WebsocketEvent: {
                    for (const [ eventName, methods ] of col) {
                        console.log(`Loaded websocket event handler for ${eventName} (${methods.length} methods)`)
                        const len = methods.length
                        client.on(eventName as keyof ClientEvents, (...args) => {
                            // Safe check to ensure this is executed in the desired guild.
                            const arg = args.at(0)
                            if (!arg && arg !== null && typeof arg === 'object') {
                                const guild = Reflect.get(arg, 'guild') as Guild | undefined
                                if (guild && client.config.guild.id !== guild.id) return; 
                            }

                            for (let i = 0;i < len;i++) {
                                methods[i].call(client, ...args)
                            }
                        })
                    }
                    break
                }
            }
        }

        console.log(`Loaded interaction handler`)
        client.on('interactionCreate', async i => {
            if (!i.inCachedGuild() || i.guild.id !== client.config.guild.id) return;

            if (i.isAutocomplete()) {
                await CommandManager.handleAutocomplete(i)
            } else if (i.isChatInputCommand()) {
                await CommandManager.handle(i)
            } else {
                const type = this.findInteractionHandlerType(i)
                const handlers = this.events.get(EventType.InteractionEvent)?.get(type!)
                if (!handlers?.length) return;
                for (const handler of handlers) {
                    // Not awaited
                    handler.call(client, i)
                }
            }
        })
    }

    public static load(client: NekoClient) {
        for (const file of readdirSync(`./dist/events`)) {
            const req = require(`../events/${file}`).default as IEventData
            this._register(client, req)
        }
        
        this._setupHandlers(client)
    }

    public static createWebsocketEventListener<K extends keyof ClientEvents>(name: K, listener: DiscordEventListener<K>): IEventData {
        return {
            id: name,
            listener,
            type: EventType.WebsocketEvent
        }
    }

    public static createInteractionEventListener<K extends keyof IAvailableInteractions>(name: K, listener: InteractionEventListener<K>): IEventData {
        return {
            id: name,
            listener,
            type: EventType.InteractionEvent
        }
    }

    public static findInteractionHandlerType(i: Interaction<'cached'>): Nullable<keyof IAvailableInteractions> {
        return i.isContextMenuCommand() ? 'context' : 
            i.isModalSubmit() ? 'modal' :
            i.isRoleSelectMenu() ? 'roleMenu' :
            i.isMentionableSelectMenu() ? 'mentionableMenu' :
            i.isUserSelectMenu() ? 'userMenu' :
            i.isChannelSelectMenu() ? 'channelMenu' :
            i.isButton() ? 'button' :
            null
    }
}