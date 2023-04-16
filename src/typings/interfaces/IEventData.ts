import { EventType } from "../enums/EventType";
import { Method } from "../types/Method";

export interface IEventData {
    id: string
    type: EventType
    listener: Method
}