import { PrismaClient, TempBan, Warning } from "@prisma/client";
import { TempBanManager } from "./TempBanManager";
import { NekoClient } from "./NekoClient";

class Database extends PrismaClient {
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
