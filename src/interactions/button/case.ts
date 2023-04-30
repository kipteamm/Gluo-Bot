import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, userMention } from "discord.js";
import { DatabaseManager } from "../../core/DatabaseManager";
import { InteractionEventListener } from "../../structures/EventListener";
import markdown from "../../functions/markdown";

export default new InteractionEventListener('button', {
    startsWith: 'case',
    authorOnly: true,
    async execute(i) {
        const [, action, , caseId ] = i.customId.split(/_/g)
        const c= await DatabaseManager.getCase(Number(caseId))
        if (!c) {
            return void i.reply({
                ephemeral: true,
                content: `Case not found.`
            })
        }

        switch (action) {
            case 'delete': {
                await DatabaseManager.deleteCase(c.case)
                await i.reply(`The case has been deleted!`)
                await this.config.modLogsChannel?.send(`✅ Case ${markdown(c.case.toString())} has been deleted by ${userMention(i.user.id)}`)
                break
            }

            case 'update': {
                await i.showModal(
                    new ModalBuilder()
                    .setTitle('Case Update')
                    .setCustomId(`case_update_${c.case}`)
                    .setComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId(`reason`)
                            .setLabel(`Reason`)
                            .setPlaceholder('They behaved so bad')
                            .setMaxLength(1024)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(1)
                        )
                    )
                )
                break
            }
        }
    }
})