import { workspaceController } from "@/abilities/workspace"
import type { Workspace } from "@/abilities/workspace/types"
import { stdErrorResponse, stdResponse, stdStatusMethodNotAllowed } from "@/server/utils/response"
import type { BunRoutes } from "../type"

export const apiWorkspaceRoutes: BunRoutes = {
    "/api/workspace/create": async () => {
        return stdResponse(workspaceController() satisfies Workspace)
    },
    "/api/workspace/upload": async (req) => {
        const form = await req.formData()

        const workspaceId = form.get("workspaceId")?.toString()
        const file = form.get("file")
        const filepath = form.get("filepath")?.toString()

        if (req.method !== "POST") return stdStatusMethodNotAllowed()
        if (!workspaceId) return stdErrorResponse("未提供工作空间 ID")
        if (!file || !filepath) return stdErrorResponse("未提供文件和路径")

        const workspace = workspaceController(workspaceId)
        workspace.write(filepath, file)

        return stdResponse()
    },
}
