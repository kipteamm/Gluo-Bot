import { setTimeout } from "timers/promises"

const max = 1000 * 60 * 24 * 21

export default async function sleep(ms: number) {
    if (ms < 1) return Promise.resolve()
    
    if (ms > max) {
        while (ms !== 0) {
            await sleep(max)
            ms -= max
        }
    }
    return setTimeout(ms)
}