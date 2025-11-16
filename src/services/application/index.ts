import { defination } from "@/utils/defination"
import type { DropservApplication, DropservApplicationState } from "./types"
import path from "path"
import { assign, isNil, negate } from "lodash"
import { listWorkspaces, workspaceController } from "../workspace"
import fs from "fs/promises"

export function applicationController(workspaceId: string): DropservApplication {
    const def = defination()
    let file = Bun.file(path.resolve(def.path.prod.workspace, workspaceId, "dropserv.json"))
    const makeFile = (workspaceId: string) => {
        file = Bun.file(path.resolve(def.path.prod.workspace, workspaceId, "dropserv.json"))
    }

    let state: DropservApplicationState = {
        id: workspaceId,
        name: "",
        endpoints: [],
    }

    const save: DropservApplication["load"] = async () => {
        await file.write(JSON.stringify(state))
    }
    const load: DropservApplication["load"] = async () => {
        apply(await file.json())
    }

    const exists: DropservApplication["exists"] = () => file.exists()
    const deletes: DropservApplication["delete"] = async () => {
        await fs.rmdir(workspaceController(workspaceId).workingDir, {
            recursive: true,
        })
    }

    const actions = {
        save,
        load,
        exists,
        delete: deletes,
    }

    function apply(newState: DropservApplicationState) {
        Object.keys(state).forEach((key) => delete state[key as keyof DropservApplicationState])
        assign(state, newState, actions, { apply })
        makeFile(state.id)
    }

    return assign(state, actions, { apply })
}

/**
 * 列出所有应用
 *
 * ---
 * List all applications
 */
export async function listApplications() {
    const workspaces = await listWorkspaces()
    const exists = await Promise.allSettled(workspaces.map((wksp) => applicationController(wksp.id).exists()))
    const result = exists
        .map((item, idx) =>
            item.status === "fulfilled"
                ? item.value
                    ? applicationController(workspaces[idx]!.id)
                    : undefined
                : undefined,
        )
        .filter(negate(isNil)) as DropservApplication[]
    return Promise.all(
        result.map(async (app) => {
            await app.load()
            return app
        }),
    )
}
