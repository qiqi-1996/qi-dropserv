import type { DropservApplicationState } from "@/services/application/types"
import type { DropservWorkspaceState } from "@/services/workspace/types"
import { api } from "@/web/utils/request"
import { Button, Modal, TextInput } from "@mantine/core"
import { useDisclosure, type UseDisclosureReturnValue } from "@mantine/hooks"
import { useAsyncEffect } from "ahooks"
import { useState, type ReactNode } from "react"

export function CreateAppModal(props: { ctrl?: UseDisclosureReturnValue; workspaceId?: string; children?: ReactNode }) {
    const innerCtrl = useDisclosure()
    const [opened, { open, close }] = props.ctrl ?? innerCtrl

    const [workspaceId, setWorkspaceId] = useState(props.workspaceId)
    useAsyncEffect(async () => {
        if (!props.workspaceId) {
            const workspace = await api.post<DropservWorkspaceState>("/api/workspace/create")
            setWorkspaceId(workspace.data.id)
        } else {
            setWorkspaceId(props.workspaceId)
        }
    }, [opened])
    const [name, setName] = useState("")

    const payload: DropservApplicationState = {
        id: workspaceId!,
        name,
        endpoints: [],
    }

    const handleDeploy = async () => {
        api.post("/api/application/create", payload).then(() => {
            close()
        })
    }

    return (
        <>
            {props.children && <div onClick={open}>{props.children}</div>}
            <Modal
                title="新建应用"
                opened={opened}
                onClose={close}
                styles={{
                    body: { padding: 0 },
                }}
            >
                <div className="flex flex-col gap-2 p-3">
                    <TextInput
                        label="应用名称"
                        value={name}
                        onChange={(evt) => setName(evt.currentTarget.value)}
                    ></TextInput>
                    <div>
                        <Button fullWidth onClick={handleDeploy}>
                            部署
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
