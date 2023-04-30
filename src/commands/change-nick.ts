import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";
import { ArgType } from "../typings/enums/ArgType";

export default new Command({
    name: `change-nick`,
    description: `Requests nickname change`,
    defer: true,
    ephemeral: true,
    args: [
        {
            name: `nick`,
            min: 1,
            max: 32,
            description: `The nick to request change to, empty to set to default.`,
            required: false,
            type: ArgType.String
        }
    ],
    async execute(i, [ nick ]) {        
        if (i.member.roles.cache.has(this.config.nicknameSystem.pendingNickChangeRoleId)) {
            await i.editReply(`Your nickname change request is currently pending for review.`)
            return false
        }

        if (!i.member.roles.cache.has(this.config.nicknameSystem.requestNickChangeRoleId)) {
            await i.editReply(`You're missing the nickname change role!`)
            return false
        }

        if (!nick) {
            await i.member.setNickname(null)
            await i.member.roles.remove(this.config.nicknameSystem.requestNickChangeRoleId)
            await i.editReply(`Successfully reset your nickname.`)
            return true
        }

        const roles = [...i.member.roles.cache.values()].filter(c => c.id !== this.config.nicknameSystem.requestNickChangeRoleId)
        roles.push(this.config.guild.roles.cache.get(this.config.nicknameSystem.pendingNickChangeRoleId)!)
        await i.member.roles.set(roles)

        await this.config.nicknameSystem.reviewChannel.send({
            embeds: [
                new EmbedBuilder()
                .setAuthor({
                    name: i.user.tag,
                    iconURL: i.user.displayAvatarURL()
                })
                .setColor('Yellow')
                .setTimestamp()
                .setFooter({
                    text: `Requested at`
                })
                .setTitle(`Nickname Change Request`)
                .setDescription(nick)
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('nick_accept_' + i.user.id)
                    .setLabel('Accept')
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setLabel(`Decline`)
                    .setCustomId('nick_decline_' + i.user.id)
                    .setStyle(ButtonStyle.Danger)
                )
            ]
        })

        await i.editReply(`Successfully sent nickname change request! Now pending for review.`)
        return true
    }
})