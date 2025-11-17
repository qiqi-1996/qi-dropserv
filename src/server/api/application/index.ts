import { stdErrorResponse, stdResponse, stdStatusMethodNotAllowed } from "@/server/utils/response"
import { applicationController, listApplications } from "@/services/application"
import type { DropservApplicationState } from "@/services/application/types"
import type { BunRoutes } from "../type"
import type { ApiApplicationListResult } from "./types"
import { allEndpoints } from "@/services/endpoint"
import { isNil, negate } from "lodash"

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
        type EndpointItem = ApiApplicationListResult[number]["endpointControllers"][number]

        const apps = await listApplications()
        const endpoints = await allEndpoints()
        const result: ApiApplicationListResult = await Promise.all(
            apps.map(async (app) => {
                const endpointControllers = (
                    await Promise.all(
                        app.endpoints.map(async (item) => {
                            const ep = endpoints.find((ep) => item.id === ep.id)
                            if (ep) {
                                const epctrl = ep.endpoint({
                                    workspace: app.workspace,
                                })
                                return {
                                    id: ep.id,
                                    status: await epctrl.status(),
                                    statusMessage: await epctrl.statusMessage(),
                                    urls: await epctrl.urls(),
                                } as EndpointItem
                            } else {
                                return undefined
                            }
                        }),
                    )
                ).filter(negate(isNil)) as EndpointItem[]

                return {
                    ...app,
                    endpointControllers,
                }
            }),
        )
        return stdResponse(result)
    },
}
