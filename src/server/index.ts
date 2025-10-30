import webUI from "../web/index.html"

export function startServer() {
    const app = Bun.serve({
        port: 3000,
        routes: {
            "/*": webUI,
        },
        development: process.env.NODE_ENV !== "production" && {
            // Enable browser hot reloading in development
            hmr: true,

            // Echo console logs from the browser to the server
            console: true,
        },
    })

    console.log(`↪ http://${app.hostname || "localhost"}:${app.port}`)
    return app
}
