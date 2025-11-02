import { stdErrorResponse, stdResponse, stdStatusMethodNotAllowed } from "@/server/utils/response"
import type { BunRoutes } from "../type"

export const apiUploadRoutes: BunRoutes = {
    "/api/upload/": async (req) => {
        const form = await req.formData()

        const workspaceId = form.get("workspaceId")
        const file = form.get("file")

        if (req.method !== "POST") return stdStatusMethodNotAllowed()
        if (!workspaceId) return stdErrorResponse("未提供工作空间 ID")
        if (!file) return stdErrorResponse("未提供文件")
        
        return stdResponse()
    },
}
