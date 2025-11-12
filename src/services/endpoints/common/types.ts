import type { StdResponse } from "@/server/utils/response"
import type { DropservWorkspace } from "@/services/workspace/types"

/**
 * DropservEndpointInit
 * ---
 * 终端服务初始化配置
 * 
 * ---
 * Terminal service initialization configuration
 */
export type DropservEndpointInit = {
    /**
     * workspace
     * ---
     * 工作空间对象
     * 
     * ---
     * Workspace object
     */
    workspace: DropservWorkspace
}

export type DropservEndpoint = DropservEndpointState & DropservEndpointActions

export type DropservEndpointState = {
    name: string
}

export type DropservEndpointActions = {
    /**
     * checkAvailable
     * ---
     * 判断托管可能性
     * @description 例如：对于静态资源托管，在项目中找到 index.html 使得可能性为 1，但同时也找到了 package.json 表示可能是 vite 这种需要构建的项目，则降低可能性到 0.5。这里只需要给出感觉的值，不需要严谨的量化。
     * @returns 可能性（0 ~ 1）
     *
     * ---
     * Judge the possibility of hosting
     * @description For example, for static resource hosting, finding index.html in the project makes the possibility 1, but at the same time finding package.json indicating that it may be a project that needs to be built such as vite, the possibility is reduced to 0.5. Here, you only need to give the value of the feeling, and there is no need for rigorous quantification.
     * @returns Possibility (0 ~ 1)
     */
    checkAvailable: () => number

    /**
     * status
     * ---
     * 获取服务
     */
    status: () => "running" | "stopped" | "error"

    /**
     * start
     * ---
     * 开始部署/运行服务
     * @description 需要自行确保幂等性（例如：依赖如果已安装则跳过安装，如果项目已启动则跳过启动步骤）
     *
     * ---
     * Start deploying/running services
     * @description You need to ensure power equality by yourself (for example: skip the installation if the dependency has been installed, and skip the startup step if the project has been started)
     */
    start: () => StdResponse
}
