import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, parseEmoji } from "discord.js";
import { Command } from "../structures/Command";
import { ArgType } from "../typings/enums/ArgType";
import objectKeys from "../functions/objectKeys";
import toTitleCase from "../functions/toTitleCase";
import cast from "../functions/cast";

export default new Command({
    name: `button-embed`,
    description: `Sends button role panel`,
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
                    this.config.buttonRoles.map(
                        c => {
                            const btn = new ButtonBuilder()
                            .setCustomId(`role_button_${c.roleId}`)
                            .setLabel(toTitleCase(c.name))
                            .setStyle(ButtonStyle.Primary)
                            if (c.emoji) {
                                btn.setEmoji(c.emoji)
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