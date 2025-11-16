/** 工作空间 */
export type DropservWorkspace = DropservWorkspaceState & DropservWorkspaceActions

/** 工作空间-状态 */
export type DropservWorkspaceState = {
    id: string
    /**
     * 工作目录
     *
     * ---
     * Working Dir
     */
    workingDir: string
    /**
     * 文件列表（快照）\
     * File list (snapshot)
     */
    files: string[]
}

/** 工作空间-功能 */
export type DropservWorkspaceActions = {
    /**
     * filesSnapshot
     * ---
     * 获取最新文件列表快照
     *
     * ---
     * Get the latest file list snapshot
     */
    filesSnapshot(): Promise<string[]>
    /**
     * write
     * ---
     * 向工作空间写入文件
     * @param path 文件路径（相对于工作空间）
     * @param file 文件内容
     *
     * ---
     * Write files to the workspace
     * @param path File path (relative to the workspace)
     * @param file The content of the file
     */
    write(path: string, file: any): void
}
