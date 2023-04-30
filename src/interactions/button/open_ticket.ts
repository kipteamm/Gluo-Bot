import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, channelMention } from "discord.js";
import { TicketManager } from "../../core/TicketManager";
import cast from "../../functions/cast";
import { InteractionEventListener } from "../../structures/EventListener";
import toTitleCase from "../../functions/toTitleCase";

export default new InteractionEventListener('button', {
    startsWith: 'open_ticket',
    async execute(i) {
        const [, , type ] = i.customId.split(/_/g)
        if (!TicketManager.canOpenTicket(i.member, type)) {
            return void i.reply({
                ephemeral: true,
                content: `You've already opened a ${type} ticket.`
            })
        }

        await i.showModal(
            new ModalBuilder()
            .setTitle(`New ${toTitleCase(type)} Ticket`)
            .setCustomId('open_ticket_' + type)
            .setComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setRequired(true)
                    .setPlaceholder(`I have a very big issue!`)
                    .setMaxLength(1024)
                    .setMinLength(4)
                    .setLabel('Reason')
                    .setStyle(TextInputStyle.Paragraph)
                    .setCustomId('reason')
                )
            )
        )
    }
})