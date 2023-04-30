import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";
import { ArgType } from "../typings/enums/ArgType";
import objectKeys from "../functions/objectKeys";
import toTitleCase from "../functions/toTitleCase";

export default new Command({
    name: `ticket-embed`,
    description: `Sends ticket system panel`,
    args: [
        {
            name: `title`,
            description: `The title of the embed`,
            required: true,
            type: ArgType.String
        },
        {
            name: `description`,
            description: `The description of the embed`,
            required: true,
            type: ArgType.String
        },
        {
            name: `footer`,
            description: `The footer of the embed`,
            required: false,
            type: ArgType.String
        },
        {
            name: `author`,
            description: `The text of the author`,
            required: false,
            type: ArgType.String
        },
        {
            name: `thumbnail`,
            description: `The thumbnail of the embed`,
            required: false,
            type: ArgType.Attachment
        },
        {
            name: `image`,
            description: `The image of the embed`,
            required: false,
            type: ArgType.Attachment
        }
    ],
    permissions: [
        'ManageGuild'
    ],
    async execute(i, [ title, desc, footer, author, thumbnail, image ]) {
        await i.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Blue')
                .setTitle(title)
                .setAuthor(author ? {
                    name: author
                } : null)
                .setImage(image ? image.url : null)
                .setThumbnail(thumbnail ? thumbnail.url : null)
                .setDescription(desc)
                .setFooter(footer ? {
                    text: footer
                } : null)
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    objectKeys(this.config.ticketCategories).map(
                        c => {
                            const btn = new ButtonBuilder()
                            .setCustomId(`open_ticket_${c}`)
                            .setLabel(toTitleCase(c))
                            .setStyle(ButtonStyle.Primary)
                            const data = this.config.ticketCategories[c]
                            if (data.emoji) {
                                btn.setEmoji(data.emoji)
                            }
                            
                            return btn
                        }
                    )
                )
            ]
        })
        return true
    }
})