import z from "zod"
import { createDropservEndpoint } from "../../"
import getPort from "get-port"
import path from "path"

/**
 * AppId & Bun.Server Map
 */
let appServerMap: Record<string, Bun.Server<undefined>> = {}

const bunStaticEndpointSchema = () =>
    z.object({
        host: z
            .string()
            .default("127.0.0.1")
            .meta({ title: "监听地址", description: "出于安全考虑，默认只监听 127.0.0.1" }),
        port: z.number().default(-1).meta({ title: "端口号", description: "填入 -1 使用随机端口号" }),
    })

export const builtInBunStaticEndpoint = createDropservEndpoint(
    "built-in:bun-static-endpoint",
    (init) => {
        const { workspace } = init

        let url: string | undefined
        let error: Error | undefined

        const options = async () => {
            let options = bunStaticEndpointSchema().parse(init.options ?? {})
            if (options.port === -1) options.port = await getPort({ host: options.host })
            return options
        }

        const server = async () => {
            error = undefined
            const opts = await options()
            const server =
                appServerMap[workspace.id] ??
                Bun.serve({
                    hostname: opts.host,
                    port: opts.port,
                    routes: {
                        "/*": (req) => {
                            const subpath = new URL(req.url).pathname.slice(1)
                            return new Response(Bun.file(path.resolve(workspace.workingDir, subpath)))
                        },
                    },
                    error(err) {
                        error = err
                        server.stop(true)
                        delete appServerMap[workspace.id]
                    },
                })
            appServerMap[workspace.id] = server
            url = server.url.toString()
            return server
        }

        return {
            name: "Bun Static Endpoint",

            checkAvailable() {
                return workspace.files.some((filepath) => filepath.endsWith(".html")) ? 1 : 0
            },

            status() {
                if (error) return "error"
                if (!appServerMap[workspace.id]) return "stopped"
                return "running"
            },

            statusMessage() {
                return error ? String(error) : ""
            },

            start() {
                server()
            },

            urls() {
                return url
                    ? [
                          {
                              url,
                          },
                      ]
                    : []
            },
        }
    },
    bunStaticEndpointSchema,
)
