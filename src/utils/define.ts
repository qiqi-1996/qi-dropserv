import path from "path"

const devRoot = path.resolve(__dirname, "../../")
const dev = {
    root: devRoot,
    src: path.resolve(devRoot, "src"),
}

const prod = {
    workspace: path.resolve(),
}

export const define = {
    path: {
        dev,
    },
}
