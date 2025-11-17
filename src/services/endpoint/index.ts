import z from "zod"
import { builtInBunStaticEndpoint } from "./built-ins"
import type { DropservEndpointController, DropservEndpointControllerInit } from "./types"
export * from "./types"

export async function allEndpoints() {
    return [builtInBunStaticEndpoint]
}

/**
 * ---
 * 创建终端服务提供者的辅助函数\
 * auxiliary functions for endpoint service providers
 *
 * @param endpointController 终端服务控制器\
 *                           Endpiont service controller
 * @param optionsSchema 终端服务的配置模式\
 *                      Configuration mode of endpoint service
 */
export function createDropservEndpoint<Schema = z.ZodObject>(
    id: string,
    endpointController: (init: DropservEndpointControllerInit<z.infer<Schema>>) => DropservEndpointController,
    optionsSchema?: () => Schema,
) {
    return { id, endpoint: endpointController, schema: optionsSchema }
}

export type DropservEndpoint<Schema = z.ZodObject> = ReturnType<typeof createDropservEndpoint<Schema>>
