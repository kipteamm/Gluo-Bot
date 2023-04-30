import { MessageManager } from "discord.js";
import fetchMessages from "./fetchMessages";

export default async function(channel: unknown & { messages: MessageManager }) {
    return fetchMessages(channel)    
}