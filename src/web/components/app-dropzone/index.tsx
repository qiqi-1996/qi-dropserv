import { Group } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import { LuHardDriveUpload } from "react-icons/lu"

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

export function AppDropzone(props: { minimize?: boolean }) {
    const { minimize } = props

    return (
        <div>
            <Dropzone
                onDrop={(files) => console.log("accepted files", files)}
                onReject={(files) => console.log("rejected files", files)}
            >
                <div className="flex items-center gap-2 p-1">
                    <div>
                        <LuHardDriveUpload className="text-headline" />
                    </div>
                    <div>
                        <p className="mb-1 text-text font-text leading-text-xs">拖入您的项目，快速部署服务。</p>
                        <p className="text-footnote font-footnote leading-footnote-xs text-color-footnote">
                            Qi Dropserv 将自动分析项目所需，准备环境，执行构建，并开始运行。
                        </p>
                    </div>
                </div>
            </Dropzone>
        </div>
    )
}
