import path from "path"
import fs from "fs"
import { defination } from "./defination"
import { camelCase, toPairs, upperFirst } from "lodash"
import { formatTs } from "./format"

const def = defination()
const dir = path.resolve(def.path.dev.src, "web/views")
const relate = path.resolve(def.path.dev.src, "web")

/**
 * 生成 Web 路径
 */
export async function generateWebRoutes() {
    const router = new Bun.FileSystemRouter({
        style: "nextjs",
        dir,
    })

    const info = toPairs(router.routes).map(([route, filePath]) => ({
        name: upperFirst(camelCase(route.slice(1) || "Home")),
        filePath: "./" + path.relative(relate, filePath),
        routePath: route,
    }))

    const imports = info.map((item) => `import ${item.name} from "${item.filePath}"`)
    const routes = info.map((item) => `{ path: "${item.routePath}", Component: ${item.name} }`)
    const types = info.map((item) => `"${item.routePath}"`)

    const routesFile = Bun.file(path.resolve(relate, "routes.tsx"))
    routesFile.write(
        await formatTs(
            [
                "/**",
                " * Auto generated, do not modify.",
                " */",
                imports.join("\n"),
                "",
                `export const routes = [${routes.join(",\n")}]`,
                "",
                `export type RouteKeys = ${types.join(" | ")}`,
            ].join("\n"),
        ),
    )
}

export function watchWebRoutes(callback: () => any) {
    callback()
    fs.watch(dir, { recursive: true }, (evt) => (evt === "rename" ? callback() : undefined))
}
