import { Button, Input, Modal, TextInput } from "@mantine/core"
import { useDisclosure, type UseDisclosureReturnValue } from "@mantine/hooks"
import type { ReactNode } from "react"

export function CreateAppModal(props: { ctrl?: UseDisclosureReturnValue; workspaceId?: string; children?: ReactNode }) {
    const innerCtrl = useDisclosure()
    const [opened, { open, close }] = props.ctrl ?? innerCtrl

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
                    <TextInput label="应用名称"></TextInput>
                    <TextInput label="应用名称"></TextInput>
                    <div>
                        <Button fullWidth>部署</Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
