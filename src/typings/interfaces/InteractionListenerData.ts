import { NekoClient } from "../../core/NekoClient";
import { InteractionEventListener } from "../types/InteractionEventListener";
import { IAvailableInteractions } from "./IAvailableInteractions";

export interface InteractionListenerData<InteractionType extends keyof IAvailableInteractions> {
    authorOnly?: boolean
    customId?: string
    ephemeral?: boolean
    defer?: boolean
    startsWith?: string
    endsWith?: string
    includes?: string[]
    check?(this: NekoClient, i: IAvailableInteractions[InteractionType]): boolean
    execute: InteractionEventListener<InteractionType>
}