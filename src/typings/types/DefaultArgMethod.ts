import { ChatInputCommandInteraction } from "discord.js";
import { NekoClient } from "../../core/NekoClient";
import { ArgType } from "../enums/ArgType";
import { Result } from "./Result";
import { GetArgType, RetrieveArg } from "./UnwrapArgs";

export type DefaultArgMethod<Type extends ArgType = ArgType, Required extends boolean = boolean, Enum = any> = (this: NekoClient, i: ChatInputCommandInteraction<'cached'>) => RetrieveArg<Type, Enum, Required>