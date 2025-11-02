import webUI from "../web/index.html"
import { apiSystemRoutes } from "./api/system"
import { apiUploadRoutes } from "./api/upload"

export function startServer() {
    const app = Bun.serve({
        port: 3000,
        routes: {
            "/*": webUI,
            ...apiSystemRoutes,
            ...apiUploadRoutes,
        },
        development: process.env.NODE_ENV !== "production" && {
            hmr: true,
            console: true,
        },
    })

    console.log(`↪ http://${app.hostname || "localhost"}:${app.port}`)
    return app
}
