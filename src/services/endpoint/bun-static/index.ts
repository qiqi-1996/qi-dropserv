import { createDropservEndpoint } from "../common"

let appServerMap: Record<string, Bun.Server<undefined>> = {}

export const bunStaticEndpoint = createDropservEndpoint((init) => {
    const { workspace } = init

    return {
        name: "Bun Static Endpoint",

        checkAvailable() {
            return workspace.files.some((filepath) => filepath.endsWith(".html")) ? 1 : 0
        },

        status() {},

        start() {},
    }
})
