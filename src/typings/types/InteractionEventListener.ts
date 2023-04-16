import { NekoClient } from "../../core/NekoClient";
import { IAvailableInteractions } from "../interfaces/IAvailableInteractions";
import { NoResult } from "./NoResult";

export type InteractionEventListener<K extends keyof IAvailableInteractions> = (this: NekoClient, arg: IAvailableInteractions[K]) => NoResult