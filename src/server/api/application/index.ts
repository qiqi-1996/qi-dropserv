import { stdErrorResponse, stdResponse, stdStatusMethodNotAllowed } from "@/server/utils/response"
import { applicationController } from "@/services/application"
import type { DropservApplicationState } from "@/services/application/types"
import type { BunRoutes } from "../type"

export const apiApplicationRoutes: BunRoutes = {
    "/api/application/create": async (req) => {
        if (req.method !== "POST") return stdStatusMethodNotAllowed()
        try {
            const payload = (await req.json()) as DropservApplicationState
            const app = applicationController(payload.id)
            app.apply(payload)
            app.save()
            return stdResponse(app satisfies DropservApplicationState)
        } catch (e) {
            return stdErrorResponse(String(e))
        }
    },
    "/api/application/list": async (req) => {
        return stdResponse()
    },
}
