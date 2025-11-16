import { useDisclosure } from "@mantine/hooks"
import { CreateAppDropzone, type CreateAppDropzoneProps } from "./dropzone"
import { CreateAppModal } from "./modal"
import { useState } from "react"
import type { DropservApplicationState } from "@/services/application/types"

export function CreateAppEntry(props: {
    dropzone?: CreateAppDropzoneProps
    handleApplicationCreated?: (app: DropservApplicationState) => void
}) {
    const [workspaceId, setWorkspaceId] = useState<string | undefined>()
    const modalCtrl = useDisclosure()
    const [_, modelApi] = modalCtrl

    return (
        <div>
            <CreateAppDropzone
                {...props.dropzone}
                handleDone={(workspaceId) => {
                    props.dropzone?.handleDone?.(workspaceId)
                    setWorkspaceId(workspaceId)
                    modelApi.open()
                }}
            />
            <CreateAppModal ctrl={modalCtrl} workspaceId={workspaceId} handleCreated={props.handleApplicationCreated} />
        </div>
    )
}
