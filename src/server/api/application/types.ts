import type { DropservApplicationState } from "@/services/application/types"
import type { DropservEndpointControllerActions } from "@/services/endpoint/types"

export type ApiApplicationListResult = (DropservApplicationState & {
    endpointControllers: {
        id: string
        status: ReturnType<DropservEndpointControllerActions["status"]>
        statusMessage: ReturnType<DropservEndpointControllerActions["statusMessage"]>
        urls: ReturnType<DropservEndpointControllerActions["urls"]>
    }[]
})[]
