/**
 * 项目描述模块
 * Project description module
 * @description 对项目文件统一解析和提取信息，用于 Endpoint 判断是否可以托管。
 * @description Unify the analysis and extraction of information from the project file, which is used by Endpoint to determine whether it can be managed.
 */

import { readdir } from "node:fs/promises"

export type ProjectDescription = ReturnType<typeof createProjectDescription>

export async function createProjectDescription(dirname: string) {
    const files = await readdir(dirname, { recursive: true })
    return {
        files: [],
    }
}
