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
    starboard: {
        minimumStars: 3,
        emoji: '⭐',
        channel: client.getChannel<TextChannel>('1118611344443326484')
    },
    nicknameSystem: {
        pendingNickChangeRoleId: '1102309860349063340',
        requestNickChangeRoleId: '1102309899830046732',
        logChannel: client.getChannel<TextChannel>('1102309826069020724')!,
        reviewChannel: client.getChannel<TextChannel>('1102309791122067506')!
    },
    welcomeLeaveLogs: client.getChannel<TextChannel>('937613835454521405'),
    modLogsChannel: client.getChannel<TextChannel>('937613835454521405'),
    guild: client.guilds.cache.get('924979519977320459')!,
    // Please keep this ordered
    warnings: [
        createWarningAction(WarningActionType.Timeout, {
            amount: 1,
            // Duration is in ms
            duration: TimeParser.parseToMS('10m')
        }),
        createWarningAction(WarningActionType.Timeout, {
            amount: 2,
            duration: TimeParser.parseToMS('1h')
        }),
        createWarningAction(WarningActionType.Tempban, {
            amount: 3,
            // Duration is in ms
            duration: TimeParser.parseToMS('1m')
        }),
        createWarningAction(WarningActionType.Tempban, {
            amount: 4,
            duration: TimeParser.parseToMS('1h')
        }),
        createWarningAction(WarningActionType.Tempban, {
            amount: 5,
            duration: TimeParser.parseToMS('1d')
        }),
        createWarningAction(WarningActionType.Ban, {
            amount: 6 
        })
    ],
    transcriptChannel: client.getChannel<TextChannel>('1121155371642396683')!,
    buttonRoles: [
        createButtonRole({
            name: 'Announcements',
            roleId: '944940789375565935',
            emoji: '📢'
        }),
        createButtonRole({
            name: 'Updates',
            roleId: '944940767774908476',
            emoji: '📚'
        }),
        createButtonRole({
            name: 'Events',
            roleId: '1041026251785248789',
            emoji: '🎉'
        })
    ],
    ticketCategories: {
        premium: createTicketCategory({
            channel: client.getChannel<CategoryChannel>('975033746900283442')!,
            description: u => `Welcome to the Premium Feature Support. Please provide detailed information about your issue with our premium features.`
        }),
        support: createTicketCategory({
            channel: client.getChannel<CategoryChannel>('1120028854623424604')!,
            description: u => `Welcome to Customer Support. We're here to help you resolve any issues with our services. Please describe your problem in detail, and we'll do our best to provide you with a solution.`
        }),
        complaint: createTicketCategory({
            channel: client.getChannel<CategoryChannel>('1223914364424290304')!,
            description: u => `Welcome to the Complaints Department. Your feedback matters to us, and we're here to address any complaints or concerns you may have.`
        }),
        report: createTicketCategory({
            channel: client.getChannel<CategoryChannel>('1120029949219311638')!,
            description: u => `Welcome to Reporting Services. If you've encountered behaviour that doesn't follow our community guidelines, please report it here. Kindly provide specific details and attach any relevant evidence to assist us in our investigation.`
        })
    }
} as const)
