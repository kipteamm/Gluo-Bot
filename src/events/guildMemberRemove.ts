import { userMention } from "discord.js";
import { WebsocketEventListener } from "../structures/EventListener";

export default new WebsocketEventListener('guildMemberRemove', function(m) {
    this.config.welcomeLeaveLogs?.send(`**→ Goodbye ${m.user.username}!** We now have **${m.guild.memberCount.toLocaleString()}** members!`)
})