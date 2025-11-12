import { workspaceController } from "@/services/workspace"
import type { DropservWorkspaceState } from "@/services/workspace/types"
import { stdErrorResponse, stdResponse, stdStatusMethodNotAllowed } from "@/server/utils/response"
import type { BunRoutes } from "../type"

export const apiWorkspaceRoutes: BunRoutes = {
    "/api/workspace/create": async () => {
        return stdResponse(workspaceController() satisfies DropservWorkspaceState)
    },
    "/api/workspace/upload": async (req) => {
        const form = await req.formData()

        const workspaceId = form.get("workspaceId")?.toString()
        const file = form.get("file")
        const filepath = form.get("filepath")?.toString()

        if (req.method !== "POST") return stdStatusMethodNotAllowed()
        if (!workspaceId) return stdErrorResponse("未提供工作空间 ID")
        if (!file || !filepath) return stdErrorResponse("未提供文件和路径")

        try {
            const workspace = workspaceController(workspaceId)
            workspace.write(filepath, file)
        } catch (e) {
            return stdErrorResponse(String(e))
        }

        return stdResponse()
    },
}
