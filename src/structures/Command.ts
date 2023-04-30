import { ApplicationCommandData, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { IArgData } from "../typings/interfaces/IArgData";
import { ICommandData } from "../typings/interfaces/ICommandData";
import getRealArgType from "../functions/getRealArgType";
import cast from "../functions/cast";
import { NekoClient } from "../core/NekoClient";
import { ArgType } from "../typings/enums/ArgType";

export class Command<Args extends [...IArgData[]] = IArgData[]> {
    constructor(public readonly data: ICommandData<Args>) {}

    async parseArgs(int: ChatInputCommandInteraction<'cached'>) {
        const client = int.client as NekoClient
        const arr = new Array()
        if (!this.data.args?.length) return arr 

        for (let i = 0, len = this.data.args.length;i < len;i++) {
            const arg = this.data.args[i]
            
            let value: any;

            switch (arg.type) {
                case ArgType.Float: {
                    value = int.options.getNumber(arg.name, arg.required)
                    break
                }

                case ArgType.User: {
                    value = int.options.getUser(arg.name, arg.required)
                    break
                }

                case ArgType.Enum: {
                    value = arg.enum![int.options.getString(arg.name, arg.required) as keyof typeof arg.enum]
                    break
                }

                case ArgType.Member: {
                    value = int.options.getMember(arg.name)
                    break
                }

                case ArgType.Attachment: {
                    value = int.options.getAttachment(arg.name, arg.required)
                    break
                }
                
                case ArgType.String: {
                    value = int.options.getString(arg.name, arg.required)
                    break
                }

                case ArgType.Integer: {
                    value = int.options.getInteger(arg.name, arg.required)
                    break
                }

                default: {
                    throw new Error(`Unresolved arg type ${ArgType[arg.type]}`)
                }
            }

            value ??= arg.default?.call(client, cast(int))

            arr.push(value ?? null)
        }

        return arr 
    }

    private async reject(i: ChatInputCommandInteraction<'cached'>, msg: string) {
        await i.reply({
            ephemeral: true,
            content: msg
        })
        return false
    }

    async hasPermissions(i: ChatInputCommandInteraction<'cached'>): Promise<boolean> {
        const client = i.client as NekoClient

        const reject = this.reject.bind(this, i)

        if (this.data.owner && !client.config.owners.includes(cast(i.user.id))) {
            return reject('You must be owner to run this command.')
        }

        return true 
    }

    toJSON(): ApplicationCommandData {
        return {
            name: this.data.name,
            description: this.data.description,
            defaultMemberPermissions: this.data.permissions ?? null,
            dmPermission: this.data.allowDm ?? false,
            type: ApplicationCommandType.ChatInput,
            options: cast(this.data.args?.map(
                arg => ({
                    name: arg.name,
                    description: arg.description,
                    channelTypes: arg.channelTypes,
                    choices: arg.enum ? Object.entries(arg.enum).map(d => ({
                        name: d[0],
                        value: d[1]
                    })) : null,
                    min_length: arg.min,
                    min_value: arg.min,
                    max_length: arg.max,
                    max_value: arg.max,
                    required: arg.required,
                    autocomplete: !!arg.autocomplete,
                    type: getRealArgType(arg.type)
                })) ?? null 
            )            
        }
    }
}