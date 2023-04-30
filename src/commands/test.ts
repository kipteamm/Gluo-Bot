import { Command } from "../structures/Command";

export default new Command({
    name: `test`,
    description: 'Yes',
    permissions: [
        'Administrator'
    ],
    async execute(i) {
        this.emit('guildMemberAdd', i.member)
        this.emit('guildMemberRemove', i.member)
        await i.reply('owo')
        return true
    }
})