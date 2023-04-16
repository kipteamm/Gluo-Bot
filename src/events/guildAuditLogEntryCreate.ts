import { AuditLogEvent, EmbedBuilder } from "discord.js";
import { EventManager } from "../core/EventManager";
import { AuditLogEntryDescription } from "../constants";
import cast from "../functions/cast";

export default EventManager.createWebsocketEventListener('guildAuditLogEntryCreate', async function(entry) {
    if (!this.config.modLogsChannel) return;
    const method = AuditLogEntryDescription[entry.action]
    if (!method) return;
    // Before execution, fetch data
    await this.fetchEntryInfo(entry)
    const res = await method.call(this, entry as never)
    if (!res) return;
    await this.config.modLogsChannel.send(res)
})