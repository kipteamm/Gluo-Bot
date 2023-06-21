import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, EmbedBuilder, GuildMember, OverwriteType, TextChannel, User } from "discord.js";
import config from "../config";
import { NekoClient } from "./NekoClient";
import objectKeys from "../functions/objectKeys";
import cast from "../functions/cast";
import toTitleCase from "../functions/toTitleCase";
import fetchAllMessages from "../functions/fetchAllMessages";
import { setTimeout } from "timers/promises";
import noop from "../functions/noop";

export class TicketManager {
    static canOpenTicket(member: GuildMember, category: string) {
        const client = member.client as NekoClient
        const keys = objectKeys(client.config.ticketCategories)
        if (!keys.includes(cast(category))) {
            return false
        }

        const channel = client.config.ticketCategories[category as keyof ReturnType<typeof config>['ticketCategories']].channel
        if (channel.children.cache.has(member.id)) {
            return false
        }

        return true
    }

    static async createTicket(member: GuildMember, category: keyof ReturnType<typeof config>['ticketCategories'], reason: string) {
        const client = member.client as NekoClient
        const { channel, description } = client.config.ticketCategories[category]
        const desc = description(member.user)
        const ch = await channel.children.create({
            type: ChannelType.GuildText,
            name: member.id,
            topic: category,
            permissionOverwrites: channel.permissionOverwrites.cache
        });

        await ch.permissionOverwrites.create(member.id, {
            'SendMessages': true,
            'ReadMessageHistory': true,
            'ViewChannel': true
        })

        await ch.send({
            content: `<@${member.id}>`,
            embeds: [
                new EmbedBuilder()
                .setColor('Blue')
                .setTimestamp()
                .setDescription(`**__${desc}__**\n${reason}`)
                .setFooter({
                    text: `Opened at`
                })
                .setTitle(`${member.user.username}'s ${toTitleCase(category)} Ticket`)
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel(`Close`)
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('close_ticket')
                )
            ]
        })

        return ch
    }

    static async createTranscript(ticket: TextChannel) {
        const messages = await fetchAllMessages(ticket).then(c => c.filter(c => !c.author.bot))
        
        return new AttachmentBuilder(Buffer.from(
            messages.map(
                m => `${m.author.username} | ${m.createdAt.toUTCString()}\nContent:\n${m.content}${
                    m.attachments.size ? '\nAttachments:\n' + m.attachments.map(
                        a => a.url
                    ).join('\n') :
                    ''
                }`
            ).reverse().join('\n\n'),
            'utf-8'
        ), {
            name: `transcript.txt`
        })
    }

    static async closeTicket(ticket: TextChannel, user: User) {
        const client = ticket.client as NekoClient
        const ticketUser = await client.users.fetch(ticket.name)

        const m = await ticket.send(`Creating transcript before channel deletion...`)
        const transcript = await this.createTranscript(ticket)

        m.edit(`Transcript created, the ticket will be closed in 10 seconds.`)
        await setTimeout(10e3)
        await ticket.delete().catch(noop);
        
        await client.config.transcriptChannel.send({
            embeds: [
                new EmbedBuilder()
                .setColor('Blue')
                .setAuthor({
                    name: user.username,
                    iconURL: user.displayAvatarURL()
                })
                .setTitle(`${toTitleCase(ticket.topic!)} Ticket by ${ticketUser.username} has been closed`)
                .setFooter({
                    text: `Closed at`
                })
                .setTimestamp()
            ],
            files: [
                transcript
            ]
        })
    }
}