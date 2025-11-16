import { stdErrorResponse, stdResponse, stdStatusMethodNotAllowed } from "@/server/utils/response"
import { applicationController, listApplications } from "@/services/application"
import type { DropservApplicationState } from "@/services/application/types"
import type { BunRoutes } from "../type"
import type { MarkRequired } from "ts-essentials"

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
    "/api/application/delete": async (req) => {
        try {
            const payload = (await req.json()) as Partial<DropservApplicationState> | undefined
            if (!payload?.id) throw "未提供应用 id"
            const app = applicationController(payload.id)
            await app.delete()
            return stdResponse()
        } catch (e) {
            return stdErrorResponse(String(e))
        }
    },
    "/api/application/list": async (req) => {
        const apps = await listApplications()
        return stdResponse(apps)
    },
}
