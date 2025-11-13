import { defination } from "@/utils/defination"
import type { DropservApplication, DropservApplicationState } from "./types"
import path from "path"
import { assign } from "lodash"

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

    const actions = {
        save,
        load,
        exists,
    }

    function apply(newState: DropservApplicationState) {
        Object.keys(state).forEach((key) => delete state[key as keyof DropservApplicationState])
        assign(state, newState, actions, { apply })
        makeFile(state.id)
    }

    return assign(state, actions, { apply })
}
