import { AutocompleteInteraction, ChannelType, ChatInputCommandInteraction, PermissionsString } from "discord.js";
import { ArgType } from "../enums/ArgType";
import { Method } from "../types/Method";
import { GetArgType, RetrieveArg } from "../types/UnwrapArgs";
import { DefaultArgMethod } from "../types/DefaultArgMethod";
import { NekoClient } from "../../core/NekoClient";
import { NoResult } from "../types/NoResult";

export interface IArgData<Type extends ArgType = ArgType, Required extends boolean = boolean, Enum = any> {
    name: string
    description: string
    autocomplete?: (this: NekoClient, i: AutocompleteInteraction<'cached'>, value: GetArgType<Type, Enum>) => NoResult
    type: Type
    min?: number
    max?: number
    required?: Required
    enum?: Enum
    channelTypes?: ChannelType[]
    default?: DefaultArgMethod<Type, Required>
}