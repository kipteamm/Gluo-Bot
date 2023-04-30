import { ApplicationCommandData, AutocompleteInteraction, ChatInputCommandInteraction, Collection } from "discord.js";
import { Command } from "../structures/Command";
import { readdirSync } from "fs";
import { NekoClient } from "./NekoClient";
import handleResult from "../functions/handleResult";
import cast from "../functions/cast";

export class CommandManager {
    public static commands = new Collection<string, Command>()
    public static json = new Array<ApplicationCommandData>()

    private static _register(command: Command) {
        this.commands.set(command.data.name, command)
        this.json.push(command.toJSON())
    }

    public static load() {
        for (const file of readdirSync(`./dist/commands`)) {
            const cmd = require(`../commands/${file}`).default as Command
            this._register(cmd)
        }
        console.log(`Loaded ${this.commands.size} commands!`)
    }

    public static async handle(i: ChatInputCommandInteraction<'cached'>) {
        const command = this.commands.get(i.commandName)
        if (!command) return;
        if (command.data.defer) {
            await i.deferReply({ ephemeral: command.data.ephemeral })
        }

        if (!(await command.hasPermissions(i))) return;
        
        const args = await command.parseArgs(i)
        await handleResult(
            i,
            async () => await command.data.execute.call(i.client as NekoClient, cast(i), args as [])
        )
    }

    public static async handleAutocomplete(i: AutocompleteInteraction<'cached'>) {
        const command = this.commands.get(i.commandName)
        if (!command) return;
        const focus = i.options.getFocused(true)
        const arg = command.data.args!.find(arg => arg.name === focus.name)
        if (!arg) return;
        await arg.autocomplete!.call(i.client as NekoClient, i, focus.value)
    }
}