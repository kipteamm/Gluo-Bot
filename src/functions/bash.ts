import { createInterface } from "readline"
import { NekoClient } from "../core/NekoClient"

export default async function(client: NekoClient) {
    const i = createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    while (true) {
        const res = await new Promise(resolve => {
            i.question('> ', async answer => {
                try {
                    const result = await eval(answer)
                    resolve(result)
                } catch (error: any) {
                    resolve(error)
                }
            })
        })
        console.log(res)
    }
}