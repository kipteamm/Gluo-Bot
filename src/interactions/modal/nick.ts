import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, userMention } from "discord.js";
import { InteractionEventListener } from "../../structures/EventListener";
import cast from "../../functions/cast";
import noop from "../../functions/noop";
import markdown from "../../functions/markdown";

export default new InteractionEventListener('modal', {
    startsWith: 'nick',
    defer: true,
    ephemeral: true, 
    async execute(i) {
        const [, action, id] = i.customId.split(/_/g)
        const member = await i.guild.members.fetch(id).catch(noop)
        if (!member) {
            await i.message!.delete()
            return void i.editReply(`Member <@${id}> has left the server.`) 
        }

        const reason = i.fields.getTextInputValue('reason')
        
        const embed = EmbedBuilder.from(i.message!.embeds[0]);
        embed.setColor('Red')
        const row = ActionRowBuilder.from(cast(i.message!.components[0])) as ActionRowBuilder<ButtonBuilder>;
        row.components.map(c => c.setDisabled(true))
        embed.addFields({
            name: `\u200b`,
            value: `Declined by ${userMention(member.id)}`
        })

        const roles = [...i.member.roles.cache.values()].filter(c => c.id !== this.config.nicknameSystem.pendingNickChangeRoleId)
        roles.push(this.config.guild.roles.cache.get(this.config.nicknameSystem.requestNickChangeRoleId)!)
        
        await i.member.roles.set(roles)
        
        await i.message!.edit({
            embeds: [ embed ],
            components: [ row ]
        })

        await this.config.nicknameSystem.logChannel.send(`:x: ${userMention(i.user.id)} has declined ${userMention(member.id)}'s nickname change request for ${markdown(reason)}`)
        await i.editReply(`${userMention(member.id)}'s nickname request has been declined!`)   
    }
})