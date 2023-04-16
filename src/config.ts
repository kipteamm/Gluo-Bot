import { TextChannel } from "discord.js";
import { NekoClient } from "./core/NekoClient";
import { Nullable } from "./typings/types/Nullable";
import createWarningAction from "./functions/createWarningAction";
import { WarningActionType } from "./typings/enums/WarningActionType";
import { TimeParser } from "./constants";

/**
 * The reason the config is a typescript file is to make it easier to parse
 */
export default (client: NekoClient) => ({
    owners: [
        ''
    ],
    modLogsChannel: client.getChannel<TextChannel>('1054002760665792562'),
    guild: client.guilds.cache.get('861581041902813194')!,
    // Please keep this ordered
    warnings: [
        createWarningAction(WarningActionType.Tempban, {
            amount: 1,
            // Duration is in ms
            duration: TimeParser.parseToMS('1m')
        }),
        createWarningAction(WarningActionType.Timeout, {
            amount: 2,
            // Duration is in ms
            duration: TimeParser.parseToMS('10m')
        }),
        createWarningAction(WarningActionType.Timeout, {
            amount: 3,
            duration: TimeParser.parseToMS('1h')
        }),
        createWarningAction(WarningActionType.Kick, {
            amount: 4
        }),
        createWarningAction(WarningActionType.Tempban, {
            amount: 5,
            duration: TimeParser.parseToMS('1h')
        }),
        createWarningAction(WarningActionType.Tempban, {
            amount: 6,
            duration: TimeParser.parseToMS('1d')
        }),
        createWarningAction(WarningActionType.Ban, {
            amount: 7 
        })
    ]
} as const)