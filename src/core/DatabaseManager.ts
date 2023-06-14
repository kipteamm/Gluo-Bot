import { PrismaClient, StarboardMessage, TempBan, Warning } from "@prisma/client";
import { TempBanManager } from "./TempBanManager";
import { NekoClient } from "./NekoClient";
import { Collection } from "discord.js";

class Database extends PrismaClient {
    private stardboardMessageCache = new Collection<string, StarboardMessage>()
    async getMessageData(messageId: string) {
        const existing = this.stardboardMessageCache.get(messageId)
        if (existing) return existing

        const found = await this.starboardMessage.findUnique({
            where: {
                starred_message_id: messageId
            }
        })

        if (found) {
            this.stardboardMessageCache.set(messageId, found)
        }

        return found
    }

    async addMessageData(data: StarboardMessage) {
        const r = await this.starboardMessage.create({
            data
        })
        this.stardboardMessageCache.set(data.starred_message_id, data)
        return r
    }

    saveMessageData(data: StarboardMessage) {
        if (!this.stardboardMessageCache.has(data.starred_message_id)) {
            this.stardboardMessageCache.set(data.starred_message_id, data)
        }

        return this.starboardMessage.update({
            data,
            where: {
                starred_message_id: data.starred_message_id
            }
        })
    }

    deleteMessageData(messageId: string) {
        this.stardboardMessageCache.delete(messageId)
        return this.starboardMessage.delete({
            where: {
                starred_message_id: messageId
            }
        })
    }

    getCase(c: number) {
        return this.warning.findFirst({
            where: {
                case: c
            }
        })
    }

    getUserCases(userId: string) {
        return this.warning.findMany({
            where: {
                target_id: userId
            }
        })
    }

    deleteCase(c: number) {
        return this.warning.delete({
            where: {
                case: c
            }
        })
    }

    deleteUserCases(userId: string) {
        return this.warning.deleteMany({
            where: {
                target_id: userId
            }
        })
    }

    addCase(data: Omit<Warning, 'case' | 'issued_at' | 'updated_at'>) {
        return this.warning.create({
            data
        })
    }

    getWarningAmount(userId: string) {
        return this.warning.count({
            where: {
                target_id: userId
            }
        })
    }

    addTempBan(client: NekoClient, data: TempBan) {
        return TempBanManager.create(client, data)
    }

    updateCase(c: number, data: Partial<Omit<Warning, 'case' | 'updated_at' | 'issued_at'>>) {
        return this.warning.update({
            data,
            where: {
                case: c
            }
        })
    }
}

export const DatabaseManager = new Database()
DatabaseManager.$connect()
