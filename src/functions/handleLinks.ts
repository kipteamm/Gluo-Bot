import { Message, userMention } from "discord.js";
import noop from "./noop";

export const LinkRegex = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discordapp.com\/invite)\/([^\s/]+)?(?=\b)/gim

const Cache = new Map<string, string>()

export default async function(m: Message<true>) {
    if (!m.member || m.member.permissions.has('ManageMessages')) return;

    for (const match of m.content.matchAll(LinkRegex)) {
        const code = match[5]
        if (!code) continue 
        let res = `:x: ${userMention(m.author.id)} you cannot send server invite links here!`
        const guildId = Cache.get(code)
        if (guildId && m.guildId !== guildId) {
            await m.delete()
            return void await m.channel.send(res)
        }
        const exists = await m.client.fetchInvite(code).catch(noop)
        if (!exists) continue
        let allowed = exists.guild?.id === m.guildId
        
        if (exists.guild?.id) Cache.set(code, exists.guild.id)

        if (!allowed) {
            await m.delete()
            return void await m.channel.send(res)
        }
    }   
}