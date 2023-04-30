import { userMention } from "discord.js";
import { WebsocketEventListener } from "../structures/EventListener";

export default new WebsocketEventListener('guildMemberRemove', function(m) {
    this.config.welcomeLeaveLogs?.send(`**→ Goodbye ${userMention(m.user.tag)}!** We now have **${m.guild.memberCount.toLocaleString()}** members!`)
})