import { ClientEvents } from "discord.js";
import { EventType } from "../typings/enums/EventType";
import { IAvailableInteractions } from "../typings/interfaces/IAvailableInteractions";
import { InteractionEventListener as IEListener } from "../typings/types/InteractionEventListener";
import { DiscordEventListener } from "../typings/types/DiscordEventListener";
import { InteractionListenerData } from "../typings/interfaces/InteractionListenerData";

class EventListener<Type, Data> {
    public constructor(public readonly type: Type, public readonly data: Data) {}
}

export class InteractionEventListener<InteractionType extends keyof IAvailableInteractions = keyof IAvailableInteractions> extends EventListener<InteractionType, InteractionListenerData<InteractionType>> {}

export class WebsocketEventListener<Type extends keyof ClientEvents = keyof ClientEvents> extends EventListener<Type, DiscordEventListener<Type>> {}