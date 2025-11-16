import webUI from "../web/index.html"
import { apiApplicationRoutes } from "./api/application"
import { apiSystemRoutes } from "./api/system"
import { apiWorkspaceRoutes } from "./api/workspace"

export function startServer() {
    const app = Bun.serve({
        hostname: "127.0.0.1",
        port: 3000,
        routes: {
            "/*": webUI,
            ...apiSystemRoutes,
            ...apiWorkspaceRoutes,
            ...apiApplicationRoutes,
        },
        development: process.env.NODE_ENV !== "production" && {
            hmr: true,
            console: true,
        },
    })

    console.log(`↪ http://${app.hostname || "localhost"}:${app.port}`)
    return app
}
