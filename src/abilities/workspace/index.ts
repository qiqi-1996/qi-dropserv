import { defination } from "@/utils/defination"
import path from "path"
import type { Workspace } from "./types"

export function workspaceController(workspaceId?: string) {
    const id = workspaceId ?? Bun.randomUUIDv7()
    const def = defination()
    const basename = path.resolve(def.path.prod.workspace, id)
    const write = (filepath: string, file: any) => Bun.write(path.resolve(basename, filepath), file)

    const ctrl = {
        id,
        write,
    }

    return ctrl satisfies Workspace
}
