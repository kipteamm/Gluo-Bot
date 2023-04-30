import { CategoryChannel, TextChannel } from "discord.js";
import { NekoClient } from "./core/NekoClient";
import { Nullable } from "./typings/types/Nullable";
import createWarningAction from "./functions/createWarningAction";
import { WarningActionType } from "./typings/enums/WarningActionType";
import { TimeParser } from "./constants";
import createTicketCategory from "./functions/createTicketCategory";
import createButtonRole from "./functions/createButtonRole";

/**
 * The reason the config is a typescript file is to make it easier to parse
 */
export default (client: NekoClient) => ({
    owners: [
        '1096285761365610576'
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
    ],
    transcriptChannel: client.getChannel<TextChannel>('1102189071071182888')!,
    buttonRoles: [
        createButtonRole({
            name: 'Announcements',
            roleId: '1102205582070513664',
            emoji: '🎯'
        }),
        createButtonRole({
            name: 'Giveaways',
            roleId: '1102205574927634473',
            emoji: '🎉'
        }),
        createButtonRole({
            name: 'Updates',
            roleId: '1102205582984871997',
            emoji: '☣️'
        })
    ],
    ticketCategories: {
        premium: createTicketCategory({
            channel: client.getChannel<CategoryChannel>('1102189023503585420')!,
            description: u => `You opened a ticket regarding a premium feature issue! Please explain to us what happened.`
        }),
        support: createTicketCategory({
            channel: client.getChannel<CategoryChannel>('1102176218398339112')!,
            description: u => `You opened a ticket to get support! Explain us your problem.`
        }),
        concern: createTicketCategory({
            channel: client.getChannel<CategoryChannel>('1102188955421651015')!,
            description: u => `You opened a ticket for something that concerns you, what is it?.`
        }),
        report: createTicketCategory({
            channel: client.getChannel<CategoryChannel>('1102188985079574548')!,
            description: u => `You opened a ticket to report an user, please provide a reason(s) and attach proof of the incident.`
        })
    }
} as const)