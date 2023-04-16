import { GuildMember, User } from "discord.js";
import { ArgType } from "../enums/ArgType";
import { IArgData } from "../interfaces/IArgData";
import { DefaultArgMethod } from "./DefaultArgMethod";
import { Method } from "./Method";
import { Nullable } from "./Nullable";

export type TryMarkNullable<Type, Required extends boolean> = Required extends true ? Type : Nullable<Type>

export type GetArgType<T extends ArgType, Enum> = 
    T extends ArgType.Float | ArgType.Integer ? number : 
    T extends ArgType.String ? string :
    T extends ArgType.Enum ? keyof Enum :
    T extends ArgType.Member ? GuildMember : 
    T extends ArgType.User ? User :  
    never

export type RetrieveArg<
    Type extends ArgType, 
    Enum,
    Required extends boolean> = 
    TryMarkNullable<GetArgType<Type, Enum>, Required>

export type UnwrapArg<T> = T extends IArgData<infer Type, infer Required, infer Enum> ? RetrieveArg<Type, Enum, T['default'] extends Method ? true : Required> : never

export type UnwrapArgs<T extends any[]> = 
    T extends [ infer L, ...infer R ] ? [ UnwrapArg<L>, ...UnwrapArgs<R> ] : []