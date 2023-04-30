import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ModalBuilder, TextInputStyle, userMention } from "discord.js";
import noop from "../../functions/noop";
import { InteractionEventListener } from "../../structures/EventListener";
import { TextInputBuilder, embedLength } from "@discordjs/builders";
import cast from "../../functions/cast";

export default new InteractionEventListener('button', {
    startsWith: 'nick',
    async execute(i) {
        const [, action, id] = i.customId.split(/_/g)
        const member = await i.guild.members.fetch(id).catch(noop)
        if (!member) {
            await i.message.delete()
            return void i.reply(`Member <@${id}> has left the server.`) 
        }

        switch (action) {
            case 'accept': {
                await i.deferReply({ ephemeral: true })

                const embed = EmbedBuilder.from(i.message!.embeds[0]);
                embed.setColor('Green')
                const row = ActionRowBuilder.from(cast(i.message!.components[0])) as ActionRowBuilder<ButtonBuilder>;
                row.components.map(c => c.setDisabled(true))
                embed.addFields({
                    name: `\u200b`,
                    value: `Accepted by ${userMention(member.id)}`
                })

                await member.setNickname(embed.data.description!)
                await member.roles.remove(this.config.nicknameSystem.pendingNickChangeRoleId)
                
                await i.message.edit({
                    embeds: [ embed ],
                    components: [ row ]
                })

                await this.config.nicknameSystem.logChannel.send(`✅ ${userMention(i.user.id)} has accepted ${userMention(member.id)}'s nickname change request!`)
                await i.editReply(`${userMention(member.id)}'s nickname request has been accepted!`)
                break
            }

            case 'decline': {
                await i.showModal(
                    new ModalBuilder()
                    .setCustomId(`nick_decline_` + id)
                    .setTitle(`Nick Change Rejection`)
                    .setComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                        .setComponents(
                            new TextInputBuilder()
                            .setRequired(true)
                            .setMaxLength(1024)
                            .setMinLength(1)
                            .setCustomId('reason')
                            .setStyle(TextInputStyle.Short)
                            .setLabel(`Reason`)
                            .setPlaceholder(`Bad nickname!`)
                        )
                    )
                )
                break
            }
        }
    }
})