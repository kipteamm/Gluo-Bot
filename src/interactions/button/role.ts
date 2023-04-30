import { InteractionEventListener } from "../../structures/EventListener";

export default new InteractionEventListener(
    'button',
    {
        ephemeral: true,
        defer: true,
        startsWith: "role_button",
        async execute(btn) {
            const [ ,, id ] = btn.customId.split(/_/g)
            let out: string;
            if (btn.member.roles.cache.has(id)) {
                await btn.member.roles.remove(id)
                out = `Successfully removed <@&${id}> from you.`
            } else {
                await btn.member.roles.add(id)
                out = `Successfully added <@&${id}> to you.`
            }
            
            await btn.editReply(out)
        }
    }
)