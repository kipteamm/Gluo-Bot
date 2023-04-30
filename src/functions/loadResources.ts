import { lstatSync, readdirSync } from "fs";
import { InteractionEventListener, WebsocketEventListener } from "../structures/EventListener";
import { ClassInstance, ClassType } from "../typings/types/ClassType";
import { isAbsolute, resolve } from "path";

type UnwrapOne<T> = T extends ClassType<infer P> ? ClassInstance<P> : never
type Unwrap<T> = T extends [
    infer L,
    ...infer R
] ? [ UnwrapOne<L>, ...Unwrap<R> ] : []

export default function loadResources<T extends [...ClassType<any>[]]>(path: string, ...classes: [...T]) {
    if (!isAbsolute(path)) path = resolve(path)
    const resources = [] as Unwrap<T>[number][]
    for (const file of readdirSync(path)) {
        const filePath = `${path}/${file}`
        const stat = lstatSync(filePath)
        if (stat.isDirectory()) {
            resources.push(...loadResources(filePath, ...classes))
        } else {
            const res = require(filePath).default
            if (!classes.some(c => res instanceof (c as ClassType<any>))) continue
            resources.push(res)
        }
    }
    return resources
}