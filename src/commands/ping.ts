import { Command } from "../structures/Command";
import { ArgType } from "../typings/enums/ArgType";

export default new Command({
    name: 'ping',
    description: 'cope',  
    args: [
        {
            name: 'bro',
            type: ArgType.String,
            description: 'ok',
            async autocomplete(i) {
                await i.respond([ { name: 'no', value: 'cope' }])
            }
        }
    ],
    async execute(i, args) {
        await i.reply('uwu! reply: ' + args[0])
        return true
    },
})