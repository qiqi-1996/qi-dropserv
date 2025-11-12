import type { DropservEndpoint, DropservEndpointInit } from "./types"
export * from "./types"

/**
 * 创建终端提供者
 */
export function createDropservEndpoint(fn: (init: DropservEndpointInit) => DropservEndpoint) {
    return fn
}
