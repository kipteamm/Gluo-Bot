import { ButtonInteraction, ModalSubmitInteraction, ChannelSelectMenuInteraction, ContextMenuCommandInteraction, MentionableSelectMenuInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction, AutocompleteInteraction } from "discord.js";

type Cached = 'cached'

export interface IAvailableInteractions {
    button: ButtonInteraction<Cached>
    context: ContextMenuCommandInteraction<Cached>
    stringMenu: StringSelectMenuInteraction<Cached>
    roleMenu: RoleSelectMenuInteraction<Cached>
    channelMenu: ChannelSelectMenuInteraction<Cached>
    mentionableMenu: MentionableSelectMenuInteraction<Cached>
    userMenu: UserSelectMenuInteraction<Cached>
    modal: ModalSubmitInteraction<Cached>
}