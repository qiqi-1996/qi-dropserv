import type { DropservApplicationState } from "@/services/application/types"
import { api } from "@/web/utils/request"
import { ActionIcon, Button, Menu, Paper } from "@mantine/core"
import { modals } from "@mantine/modals"
import { LuEllipsis, LuTrash2 } from "react-icons/lu"

export function AppEntry(props: { application: DropservApplicationState; handleDeleted?: () => void }) {
    const { application: app } = props

    const handleDeleted = () => {
        const modalId = modals.openConfirmModal({
            title: "确认删除？",
            content: "你将无法恢复数据",
            async onConfirm() {
                modals.updateModal({
                    modalId,
                    cancelProps: {
                        disabled: true,
                    },
                    confirmProps: {
                        loading: true,
                    },
                })
                await api.post("/api/application/delete", { id: app.id }).then(props.handleDeleted)
            },
        })
    }

    return (
        <Paper className="p-2" withBorder>
            <p className="text-subtitle font-subtitle">{app.name}</p>
            <p className="text-footnote font-footnote text-color-footnote">{app.id}</p>
            <Menu>
                <div className="flex justify-between">
                    <div></div>
                    <Menu.Target>
                        <ActionIcon variant="light">
                            <LuEllipsis />
                        </ActionIcon>
                    </Menu.Target>
                </div>

                <Menu.Dropdown>
                    <Menu.Item leftSection={<LuTrash2 />} color="red" onClick={handleDeleted}>
                        删除
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Paper>
    )
}
