import type { BunRequest } from "bun"

export type BunRoutes = Record<string, (req: BunRequest) => Response | Promise<Response>>
