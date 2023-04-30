import noop from "./noop"

const max = 1000 * 60 * 24 * 21

export default async function sleep(ms: number, onTimeout?: (timeout: NodeJS.Timeout) => any) {
    if (ms < 1) return Promise.resolve()
    
    if (ms > max) {
        while (ms !== 0) {
            await sleep(max, onTimeout)
            ms -= max
        }
    }
    const timeout = new Promise(r => {
        const got = setTimeout(r, ms)
        onTimeout?.(got)
    })

    return timeout
}