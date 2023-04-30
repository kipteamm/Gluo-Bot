import { userMention } from "discord.js";
import { WebsocketEventListener } from "../structures/EventListener";

export default new WebsocketEventListener('guildMemberAdd', function(m) {
    this.config.welcomeLeaveLogs?.send(`**→ Welcome ${userMention(m.id)}!** You are member **º${m.guild.memberCount.toLocaleString()}**!`)
})