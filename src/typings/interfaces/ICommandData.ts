import { ChatInputCommandInteraction, PermissionsString } from "discord.js";
import { NekoClient } from "../../core/NekoClient";
import { IArgData } from "./IArgData";
import { Result } from "../types/Result";
import { UnwrapArgs } from "../types/UnwrapArgs";

export interface ICommandData<Args extends [...IArgData[]]> {
    name: string
    description: string
    defer?: boolean
    ephemeral?: boolean
    allowDm?: boolean
    permissions?: PermissionsString[]
    owner?: boolean
    args?: [...Args]
    execute: (this: NekoClient, i: ChatInputCommandInteraction<'cached'>, args: UnwrapArgs<Args>) => Result<boolean>
}