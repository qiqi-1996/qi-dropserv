import { stdResponse } from "@/server/utils/response"
import type { BunRoutes } from "../type"

export const apiSystemRoutes: BunRoutes = {
    "/api/system/health-check": () => {
        return stdResponse("ok")
    },
}
