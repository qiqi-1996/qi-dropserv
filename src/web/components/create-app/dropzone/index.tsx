import type { DropservWorkspaceState } from "@/services/workspace/types"
import { api } from "@/web/utils/request"
import { Button, Loader, Progress, RingProgress } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import { useAsyncEffect } from "ahooks"
import cs from "classnames"
import { isNil, negate } from "lodash"
import { useEffect, useState } from "react"
import { LuCircleCheck, LuHardDriveUpload, LuPlus, LuTriangleAlert } from "react-icons/lu"

/**
 * 常用文件过滤器 Commonly used file filters
 *
 * 过滤掉项目中的可再生的大文件（比如 node_modules）
 *
 * Filter out large renewable files in the project (such as node_modules)
 */
function commonFileFilter(file: File) {
    // @ts-ignore Compatibility
    const filePath = (file.relativePath || file.webkitRelativePath || file.path) as string
    if (filePath.includes("node_modules/")) return false
    if (file) return true
}

export type CreateAppDropzoneProps = {
    workspaceId?: string
    minimize?: boolean
    /**
     * 如果提供了此属性，将只调用函数，不会继续执行 Dropzone 本身的上传逻辑。\
     * If this attribute is provided, only the function will be called and the upload logic of Dropzone itself will not
     * continue.
     */
    handleFiles?: (files: File[]) => void
    /**
     * 完成上传\
     * Complete the upload
     */
    handleDone?: (workspaceId: string) => void
}
export function CreateAppDropzone(props: CreateAppDropzoneProps) {
    const { minimize = false } = props
    const [workspaceId, setWorkspaceId] = useState<string | undefined>(props.workspaceId)
    useAsyncEffect(async () => {
        if (!props.workspaceId) {
            const workspace = await api.get<DropservWorkspaceState>("/api/workspace/create")
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

        formData.append(
            "filepath",
            // @ts-ignore
            file.path || file.relativePath || file.webkitRelativePath,
        )
        formData.append("workspaceId", workspaceId!)
        return formData
    }

    const uploadNext = async () => {
        if (workspaceId && uploadQueueStatus() === "done") props.handleDone?.(workspaceId)
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

    const handleRetry = (evt: any) => {
        evt.stopPropagation()
        setUploadQueue((queue) =>
            [...queue].map((item) => {
                item.status === "failed" && (item.status = "pending")
                return item
            }),
        )
    }
    const handleIgnore = (evt: any) => {
        evt.stopPropagation()
        setUploadQueue(
            (queue) =>
                [...queue].map((item) => (item.status === "failed" ? undefined : item)).filter(negate(isNil)) as any,
        )
    }

    return (
        <div>
            <Dropzone
                className={cs("overflow-hidden !p-0", minimize && "inline-block shadow-xs")}
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
            >
                {minimize ? (
                    <div className="flex items-center gap-1 p-1.5 text-text">
                        {uploadQueueStatus() === "pending" ? (
                            <>
                                <LuPlus className="text-subtitle" />
                                <span>拖入项目至此，快速新建应用</span>
                            </>
                        ) : uploadQueueStatus() === "uploading" ? (
                            <>
                                <RingProgress
                                    className="mt-[2px]"
                                    size={20}
                                    thickness={4}
                                    sections={[
                                        { value: uploadProgress().sucess * 100, color: "green" },
                                        { value: uploadProgress().failed * 100, color: "red" },
                                    ]}
                                />
                                <span>上传中</span>
                            </>
                        ) : uploadQueueStatus() === "done" ? (
                            <>
                                <LuCircleCheck className="text-subtitle text-green-600" />
                                <span>上传完成</span>
                            </>
                        ) : (
                            <>
                                <LuTriangleAlert className="text-subtitle text-amber-600" />
                                <span>存在失败</span>
                                <Button
                                    className="pointer-events-auto"
                                    color="orange"
                                    variant="light"
                                    size="xs"
                                    onClick={handleRetry}
                                >
                                    重试
                                </Button>
                                <Button
                                    className="pointer-events-auto"
                                    variant="default"
                                    size="xs"
                                    onClick={handleIgnore}
                                >
                                    忽略
                                </Button>
                            </>
                        )}
                    </div>
                ) : uploadQueueStatus() === "pending" || uploadQueueStatus() === "done" ? (
                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <LuHardDriveUpload className="text-headline" />
                            <div>
                                <p className="text-text leading-text-xs font-text">
                                    {uploadQueueStatus() === "pending"
                                        ? "拖入您的项目，快速部署服务。"
                                        : "继续拖入，添加其他文件"}
                                </p>
                                <p className="mt-1 text-footnote leading-footnote-md font-footnote text-color-footnote">
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
                        <div className="flex items-center justify-between p-2 pb-1">
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
                                        onClick={handleRetry}
                                    >
                                        重试
                                    </Button>
                                    <Button className="pointer-events-auto" variant="default" onClick={handleIgnore}>
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
