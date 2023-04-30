import { TextChannel, channelMention } from "discord.js";
import { TicketManager } from "../../core/TicketManager";
import cast from "../../functions/cast";
import { InteractionEventListener } from "../../structures/EventListener";

export default new InteractionEventListener('button', {
    customId: 'close_ticket',
    async execute(i) {
        await i.reply({
            ephemeral: true,
            content: `Ticket is now flagged as closing.`
        })
        
        await TicketManager.closeTicket(i.channel! as TextChannel, i.user)
    }
})