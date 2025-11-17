import type {
    DropservEndpointController,
    DropservEndpointControllerActions,
    DropservEndpointControllerState,
} from "../endpoint"
import type { DropservWorkspace, DropservWorkspaceActions, DropservWorkspaceState } from "../workspace/types"

export type DropservApplication = DropservApplicationState & DropservApplicationActions

export type DropservApplicationState = {
    /**
     * 应用ID
     * @description 应与 'Workspace' 的 ID 相同
     *
     * ---
     * Application ID
     * @description It should be the same as the ID of "Workspace"
     */
    id: string

    /**
     * 应用名称
     *
     * ---
     * Application name
     */
    name: string

    /**
     * 应用使用的终端服务和配置列表
     *
     * ---
     * List of Endpoint services and configurations used by the application
     */
    endpoints: { id: string; options: any }[]

    workspace: DropservWorkspaceState
}

export type DropservApplicationActions = {
    apply: (state: DropservApplicationState) => void
    /**
     * 保存配置修改
     *
     * ---
     * Save configuration modification
     */
    save: () => Promise<void>
    /**
     * 重新加载配置
     *
     * ---
     * Reload the configuration
     */
    load: () => Promise<void>
    /**
     * 应用配置是否存在
     * @description 有可能用户上传文件后，未配置应用，导致工作空间目录存在，但是没有应用配置。
     *
     * ---
     * Whether the application configuration exist.
     * @description It is possible that after the user uploads the file, the application is not configured, resulting in the existence of the workspace directory, but there is no application configuration.
     */
    exists: () => Promise<boolean>
    /**
     * 删除应用目录
     *
     * ---
     * Delete the application directory
     */
    delete: () => Promise<void>

    workspace: DropservWorkspaceActions
}
