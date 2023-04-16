import { WarningActionType } from "../enums/WarningActionType"
import { IWarningAction } from "../interfaces/IWarningAction"

export type WarningAction<Type extends WarningActionType> = 
    Type extends WarningActionType.Ban ? Omit<IWarningAction<Type>, 'duration'> : 
    Type extends WarningActionType.Kick ? Omit<IWarningAction<Type>, 'duration'> : 
    Type extends WarningActionType.Tempban | WarningActionType.Timeout ? IWarningAction<Type> : 
    never