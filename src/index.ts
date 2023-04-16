import { GatewayIntentBits, IntentsBitField, Partials } from "discord.js";
import { NekoClient } from "./core/NekoClient";
import { EventManager } from "./core/EventManager";
import { CommandManager } from "./core/CommandManager";
import bash from "./functions/bash";

const client = new NekoClient({
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ],
    intents: [
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.Guilds
    ]
})

CommandManager.load()
EventManager.load(client)

client.login()

bash(client)