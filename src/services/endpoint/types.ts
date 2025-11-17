import type { DropservWorkspace } from "@/services/workspace/types"

/**
 * ---
 * 终端服务初始化配置\
 * Terminal service initialization configuration
 */
export type DropservEndpointControllerInit<Options = any> = {
    /**
     * ---
     * 工作空间对象\
     * Workspace object
     */
    workspace: DropservWorkspace
    /**
     * ---
     * 终端配置\
     * Endpiont configuration\
     */
    options?: Options
}

export type DropservEndpointController = DropservEndpointControllerState & DropservEndpointControllerActions

export type DropservEndpointControllerState = {
    name: string
}

export type DropservEndpointControllerActions = {
    /**
     * ---
     * 判断托管可能性
     * Judge the possibility of hosting
     *
     * @description 例如：对于静态资源托管，在项目中找到 index.html 使得可能性为 1，但同时也找到了 package.json 表示可能是 vite 这种需要构建的项目，则降低可能性到 0.5。这里只需要给出感觉的值，不需要严谨的量化。\
     *              For example, for static resource hosting, finding index.html in the project makes the possibility 1, but at the same time finding package.json indicating that it may be a project that needs to be built such as vite, the possibility is reduced to 0.5. Here, you only need to give the value of the feeling, and there is no need for rigorous quantification.
     * @returns 可能性（0 ~ 1）\
     *          Possibility (0 ~ 1)
     */
    checkAvailable: () => number

    /**
     * ---
     * 开始部署/运行服务\
     * Start deploying/running services
     *
     * @description 需要自行确保幂等性（例如：依赖如果已安装则跳过安装，如果项目已启动则跳过启动步骤）\
     *              You need to ensure power equality by yourself (for example: skip the installation if the dependency has been installed, and skip the startup step if the project has been started)
     *
     */
    start: () => void

    /**
     * ---
     * 获取服务状态\
     * Get the service status
     */
    status: () => "running" | "stopped" | "error"

    /**
     * ---
     * 获取服务状态消息\
     * Get the service status message
     */
    statusMessage: () => string

    /**
     * ---
     * 获取终端服务提供的访问地址\
     * Get the access address provided by the endpoint service
     */
    urls: () => {
        label?: string
        description?: string
        url: string
    }[]
}
