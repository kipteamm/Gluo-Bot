import { CategoryChannel, EmojiResolvable, User } from "discord.js";

export interface ITicketCategoryData {
    channel: CategoryChannel
    emoji?: string
    description: (user: User) => string
}