import { channelMention } from "discord.js";
import { TicketManager } from "../../core/TicketManager";
import cast from "../../functions/cast";
import { InteractionEventListener } from "../../structures/EventListener";

export default new InteractionEventListener('modal', {
    startsWith: 'open_ticket',
    async execute(i) {
        const [, , type ] = i.customId.split(/_/g)

        await i.deferReply({ ephemeral: true })

        const ch = await TicketManager.createTicket(i.member, cast(type), i.fields.getTextInputValue('reason'))

        await i.editReply(`Your ${type} ticket has been created! ${channelMention(ch.id)}`)
    }
})