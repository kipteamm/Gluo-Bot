import { ApplicationCommandOptionType } from "discord.js";
import { ArgType } from "../typings/enums/ArgType";

export default function(type: ArgType): ApplicationCommandOptionType {
    switch (type) {
        case ArgType.Float: {
            return ApplicationCommandOptionType.Number
        }
        
        case ArgType.Member:
        case ArgType.User: {
            return ApplicationCommandOptionType.User
        }
        case ArgType.Integer: {
            return ApplicationCommandOptionType.Integer
        }
        case ArgType.String: {
            return ApplicationCommandOptionType.String
        }
        case ArgType.Enum: {
            return ApplicationCommandOptionType.String
        }
        default: throw new Error(`Unhandled arg type ${ArgType[type]}`)
    }
}