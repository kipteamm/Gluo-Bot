import { WarningActionType } from "../typings/enums/WarningActionType";
import { WarningAction } from "../typings/types/WarningAction";

export default function<T extends WarningActionType>(type: T, data: Omit<WarningAction<T>, 'type'>): WarningAction<T> {
    return {
        ...data,
        type
    } as WarningAction<T>
}