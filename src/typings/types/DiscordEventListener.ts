import { ClientEvents } from "discord.js";
import { NekoClient } from "../../core/NekoClient";
import { NoResult } from "./NoResult";

export type DiscordEventListener<K extends keyof ClientEvents> = (this: NekoClient, ...args: ClientEvents[K]) => NoResult