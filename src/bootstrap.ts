import { parseArgs } from "util"
import { generateWebRoutes, watchWebRoutes } from "./utils/generate-web-routes"
import { startServer } from "./server"

// const { values, positionals } = parseArgs({
//     args: Bun.argv,
//     options: {},
//     strict: true,
//     allowPositionals: true,
// })

// console.log(values)

console.log(`📌 ${process.cwd()}`)

watchWebRoutes(generateWebRoutes)
startServer()
