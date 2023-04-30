import { userMention } from "discord.js";
import { DatabaseManager } from "../../core/DatabaseManager";
import markdown from "../../functions/markdown";
import { InteractionEventListener } from "../../structures/EventListener";

export default new InteractionEventListener('modal', {
    startsWith: 'case_update',
    async execute(i) {
        const [, , caseId ] = i.customId.split(/_/g)
        const c = await DatabaseManager.getCase(Number(caseId))
        if (!c) {
            return void i.reply({
                ephemeral: true,
                content: `Case not found.`
            })
        }

        const reason = i.fields.getTextInputValue('reason')
        await DatabaseManager.warning.update({
            where: {
                case: c.case
            },
            data: {
                reason
            }
        })
        await i.reply(`Successfully updated the case reason!`)
        await this.config.modLogsChannel?.send(`✅ Case ${markdown(c.case.toString())} has been updated by ${userMention(i.user.id)} with new reason ${markdown(reason)}!`)
    }
})