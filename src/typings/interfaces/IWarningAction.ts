import { WarningActionType } from "../enums/WarningActionType";

export interface IWarningAction<T extends WarningActionType = WarningActionType> {
    type: T 
    duration: number
    amount: number
}