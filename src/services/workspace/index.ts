import { defination } from "@/utils/defination"
import fs from "fs/promises"
import { debounce } from "lodash"
import path from "path"
import type { DropservWorkspace } from "./types"

export function workspaceController(workspaceId?: string): DropservWorkspace {
    const id = workspaceId ?? Bun.randomUUIDv7()
    const def = defination()
    const basedir = path.resolve(def.path.prod.workspace, id)

    let files: string[] = []

    const filesSnapshot: DropservWorkspace["filesSnapshot"] = async () => {
        const result = (await fs.readdir(basedir, { recursive: true })).map((filename) =>
            path.resolve(basedir, filename),
        )
        files.splice(0, files.length, ...result)
        return result
    }

    const debouncedUpdateFiles = debounce(filesSnapshot, 0)

    const write: DropservWorkspace["write"] = async (filepath, file) => {
        filepath =
            filepath[0] === "/"
                ? filepath.slice(1)
                : filepath.startsWith("../")
                  ? filepath.replace("../", "")
                  : filepath
        filepath = filepath.slice(filepath.indexOf("/") + 1)
        await Bun.write(path.resolve(basedir, filepath), file)
        debouncedUpdateFiles()
        return
    }

    return {
        id,
        files,

        filesSnapshot,
        write,
    }
}
