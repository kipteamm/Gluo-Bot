import { PrismaClient, TempBan, Warning } from "@prisma/client";
import { TempBanManager } from "./TempBanManager";

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

    addCase(data: Omit<Warning, 'case' | 'issued_at'>) {
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

    addTempBan(data: TempBan) {
        return this.tempBan.create({
            data
        })
    }

    updateCase(c: number, data: Partial<Omit<Warning, 'case' | 'issued_at'>>) {
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
