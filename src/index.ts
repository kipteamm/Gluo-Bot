import { GatewayIntentBits, IntentsBitField, Partials } from "discord.js";
import { NekoClient } from "./core/NekoClient";
import { EventManager } from "./core/EventManager";
import { CommandManager } from "./core/CommandManager";
import bash from "./functions/bash";
import { appendFileSync } from "fs";
import { inspect } from "util";

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
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.Guilds
    ]
})

CommandManager.load()
EventManager.load(client)

client.login()

process.on('uncaughtException', console.error)
process.on('uncaughtExceptionMonitor', console.error)
process.on('unhandledRejection', console.error)

bash(client)