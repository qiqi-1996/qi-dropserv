import type { Workspace } from "@/abilities/workspace/types"
import { api } from "@/web/utils/request"
import { Button, Loader, Progress } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import { useAsyncEffect } from "ahooks"
import cs from "classnames"
import { isNil, negate } from "lodash"
import { useEffect, useState } from "react"
import { LuCircleCheck, LuHardDriveUpload, LuTriangleAlert } from "react-icons/lu"

/**
 * 常用文件过滤器
 * Commonly used file filters
 * @description 过滤掉项目中的可再生的大文件（比如 node_modules）
 * @description Filter out large renewable files in the project (such as node_modules)
 */
function commonFileFilter(file: File) {
    // @ts-ignore Compatibility
    const filePath = (file.relativePath || file.webkitRelativePath || file.path) as string
    if (filePath.includes("node_modules/")) return false
    if (file) return true
}

export function AppDropzone(props: { workspaceId?: string; minimize?: boolean }) {
    const { minimize } = props
    const [workspaceId, setWorkspaceId] = useState<string | undefined>(props.workspaceId)
    useAsyncEffect(async () => {
        if (!props.workspaceId) {
            const workspace = await api.get<Workspace>("/api/workspace/create")
            setWorkspaceId(workspace.data.id)
        }
    }, [props.workspaceId])

    const [uploadQueue, setUploadQueue] = useState<
        {
            file: File
            status: "pending" | "processing" | "done" | "failed"
            reason?: string
        }[]
    >([])
    const uploadQueueStatus = () =>
        false ||
        (!uploadQueue.length
            ? "pending"
            : uploadQueue.some((item) => item.status === "pending" || item.status === "processing")
              ? "uploading"
              : uploadQueue.some((item) => item.status === "failed")
                ? "failed"
                : "done")
    const currentUploading = () => uploadQueue.find((item) => item.status === "processing")
    const uploadProgress = () => ({
        sucess: uploadQueue.filter((item) => item.status === "done").length / uploadQueue.length,
        failed: uploadQueue.filter((item) => item.status === "failed").length / uploadQueue.length,
    })

    const uploadFormData = (file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        // @ts-ignore
        formData.append("filepath", file.path || file.relativePath || file.webkitRelativePath)
        formData.append("workspaceId", workspaceId!)
        return formData
    }

    const uploadNext = async () => {
        if (!!currentUploading()) return
        const index = uploadQueue.findIndex((item) => item.status === "pending")
        const task = uploadQueue[index]
        if (!task) return
        setUploadQueue((queue) => {
            const newQueue = [...queue]
            newQueue[index]!.status = "processing"
            return newQueue
        })
        const response = await api.post("/api/workspace/upload", uploadFormData(task.file)).catch((reason) => {
            console.error(`Upload failed: ${reason}`)
            setUploadQueue((queue) => {
                const newQueue = [...queue]
                newQueue[index]!.status = "failed"
                newQueue[index]!.reason = reason
                return newQueue
            })
        })
        if (response) {
            setUploadQueue((queue) => {
                const newQueue = [...queue]
                newQueue[index]!.status = "done"
                return newQueue
            })
        }
        uploadNext()
    }
    useEffect(() => {
        uploadNext()
    }, [uploadQueue])

    return (
        <div>
            <Dropzone
                className="!p-0 overflow-hidden"
                onDrop={(files) => {
                    setUploadQueue((uploadQueue) => {
                        return [
                            ...uploadQueue,
                            ...files.filter(commonFileFilter).map((file) => ({
                                file,
                                status: "pending",
                            })),
                        ] as any
                    })
                }}
                onReject={(files) => {
                    console.log("rejected files", files)
                }}
            >
                {uploadQueueStatus() === "pending" || uploadQueueStatus() === "done" ? (
                    <div className="flex justify-between items-center p-3">
                        <div className="flex items-center gap-2">
                            <div>
                                <LuHardDriveUpload className="text-headline" />
                            </div>
                            <div>
                                <p className="mb-1 text-text font-text leading-text-xs">
                                    {uploadQueueStatus() === "pending"
                                        ? "拖入您的项目，快速部署服务。"
                                        : "继续拖入，添加其他文件"}
                                </p>
                                <p className="text-footnote font-footnote leading-footnote-md text-color-footnote">
                                    Qi Dropserv 将自动分析项目所需，准备环境，执行构建，并开始运行。
                                </p>
                            </div>
                        </div>
                        {uploadQueueStatus() === "done" && (
                            <div className="flex items-center gap-1">
                                <div>已上传文件 {uploadQueue.filter((item) => item.status === "done").length}</div>
                                <LuCircleCheck className="text-[40px] text-green-600" />
                            </div>
                        )}
                    </div>
                ) : uploadQueueStatus() === "uploading" || uploadQueueStatus() === "failed" ? (
                    <div>
                        <div className="flex justify-between items-center p-2 pb-1">
                            {uploadQueueStatus() === "uploading" ? (
                                <div className="flex items-center gap-2">
                                    <Loader size={40} />
                                    <div>正在上传: {currentUploading()?.file.name}</div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <LuTriangleAlert className="text-[40px] text-amber-600" />
                                    <div>存在上传失败文件</div>
                                    <Button
                                        className="pointer-events-auto"
                                        color="orange"
                                        variant="light"
                                        onClick={(evt) => {
                                            evt.stopPropagation()
                                            setUploadQueue((queue) =>
                                                [...queue].map((item) => {
                                                    item.status === "failed" && (item.status = "pending")
                                                    return item
                                                }),
                                            )
                                        }}
                                    >
                                        重试
                                    </Button>
                                    <Button
                                        className="pointer-events-auto"
                                        variant="default"
                                        onClick={(evt) => {
                                            evt.stopPropagation()
                                            setUploadQueue(
                                                (queue) =>
                                                    [...queue]
                                                        .map((item) => (item.status === "failed" ? undefined : item))
                                                        .filter(negate(isNil)) as any,
                                            )
                                        }}
                                    >
                                        忽略
                                    </Button>
                                </div>
                            )}
                            <div className="text-headline font-headline">
                                {((uploadProgress().sucess + uploadProgress().failed) * 100).toFixed(1)}%
                            </div>
                        </div>
                        <Progress.Root className="rounded-none!">
                            <Progress.Section
                                className="rounded-none!"
                                value={uploadProgress().sucess * 100}
                                color="green"
                            >
                                {/* <Progress.Label>Success</Progress.Label> */}
                            </Progress.Section>
                            <Progress.Section
                                className="rounded-none!"
                                value={uploadProgress().failed * 100}
                                color="red"
                            >
                                {/* <Progress.Label>Failed</Progress.Label> */}
                            </Progress.Section>
                        </Progress.Root>
                    </div>
                ) : (
                    <></>
                )}
            </Dropzone>
        </div>
    )
}
