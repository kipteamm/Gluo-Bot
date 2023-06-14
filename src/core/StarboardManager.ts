import { Collection, EmbedBuilder, Message, MessageReaction, PartialMessage, PartialMessageReaction } from "discord.js";
import { DatabaseManager } from "./DatabaseManager";
import { StarboardMessage } from "@prisma/client";
import { NekoClient } from "./NekoClient";
import noop from "../functions/noop";

export class StarboardManager {
    private static footer(emote: string, count: number) {
        return `${emote} Starred by ${count.toLocaleString()} people`
    }

    static canHandleReaction(r: MessageReaction | PartialMessageReaction) {
        const client = r.client as NekoClient
        return this.canHandleMessage(r.message) && r.emoji.toString() === client.config.starboard.emoji
    }

    static canHandleMessage(r: Message | PartialMessage) {
        const client = r.client as NekoClient
        return !!client.config.starboard.channel && r.channelId !== client.config.starboard.channel.id
    }

    static hasRequirement(client: NekoClient, count: number) {
        return count >= client.config.starboard.minimumStars
    }

    static async handleReactionAdd(reaction: MessageReaction) {
        const client = reaction.client as NekoClient
        if (!client.config.starboard.channel || !this.hasRequirement(client, reaction.count)) return;

        const found = await DatabaseManager.getMessageData(reaction.message.id)
        
        const msg = await reaction.message.fetch()

        // Create message, and add to database
        if (!found) {
            const embed = new EmbedBuilder()
            .setAuthor({
                name: msg.author.tag,
                iconURL: msg.author.displayAvatarURL({ size: 2048 })
            })
            .setColor('Orange')
            .setDescription(msg.content.slice(0, 2000) || (msg.embeds.length ? msg.embeds[0].description : null))
            .setTimestamp()
            .setFooter({
                text: this.footer(client.config.starboard.emoji, reaction.count)
            });

            if (msg.attachments.size !== 0) {
                const arr = [...msg.attachments.values()]
                embed.setImage(arr.shift()!.url)
                
                if (arr.length !== 0) {
                    embed.addFields({
                        name: `Other Attachment Links`,
                        value: arr.map((x, y) => `**__[Attachment #${y + 2}](${x.url})__**`).join('\n')
                    })
                }
            }

            embed.addFields({
                name: '\u200b',
                value: `[Jump to Message](${msg.url})`
            })

            const m = await client.config.starboard.channel.send({
                embeds: [
                    embed
                ]
            }).catch(noop)

            if (!m) return;

            await DatabaseManager.addMessageData({
                reference_message_id: m.id,
                starred_message_id: msg.id
            })
        } else {
            await this.updateStarboardMessage(
                client,
                msg,
                found,
                reaction.count
            )
        }
    }

    static async updateStarboardMessage(client: NekoClient, msg: Message, found: StarboardMessage, count: number) {
        if (!client.config.starboard.channel) return;

        // IF it exists we just get the msg to get embed lmao
        const m = await client.config.starboard.channel.messages.fetch(found.reference_message_id).catch(noop)
        // Huh? Well lets just delete the data then.
        if (!m) {
            await this.removeStarboardMessage(client, msg.id)
            return;
        }

        const embed = EmbedBuilder.from(m.embeds[0]);
        embed.setFooter({
            text: this.footer(client.config.starboard.emoji, count)
        })

        await m.edit({
            embeds: [
                embed
            ]
        })
        .catch(noop)
    }

    static async handleReactionRemove(reaction: MessageReaction) {
        const client = reaction.client as NekoClient
        if (!client.config.starboard.channel) return;
        if (this.hasRequirement(client, reaction.count)) {
            const msg = await reaction.message.fetch().catch(noop)
            if (!msg) return;
            const data = await DatabaseManager.getMessageData(msg.id)
            if (!data) return;

            await this.updateStarboardMessage(
                client,
                msg,
                data,
                reaction.count
            )
            return;
        }
        await this.removeStarboardMessage(client, reaction.message.id)
    }

    private static async removeStarboardMessage(client: NekoClient, messageId: string) {
        if (!client.config.starboard.channel) return;

        const found = await DatabaseManager.getMessageData(messageId)
        if (found) {
            const msg = await client.config.starboard.channel.messages.fetch(found.reference_message_id).catch(noop)
            if (msg) {
                await msg.delete().catch(noop)
            }
            await DatabaseManager.deleteMessageData(found.starred_message_id)
        }
    }
}