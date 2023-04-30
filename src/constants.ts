import { AuditLogEvent, GuildAuditLogsEntry, GuildBasedChannel, Interaction, Role, User, roleMention } from "discord.js";
import { AsyncMethod, Method } from "./typings/types/Method";
import { NekoClient } from "./core/NekoClient";
import { Nullable } from "./typings/types/Nullable";
import Parser from "ms-utility"
import { inspect } from "util";
import markdown from "./functions/markdown";

export const NoReason = 'No reason provided'
export const TimeParser = new Parser()