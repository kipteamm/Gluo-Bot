import { Nullable } from "../typings/types/Nullable"

const escape = /`/g

export default function(str: undefined | Nullable<string>) {
    return str ? `\`${str.replace(escape, '')}\`` : ''
}