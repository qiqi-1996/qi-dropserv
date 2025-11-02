import path from "path"

const cwd = process.cwd()
const devRoot = path.resolve(__dirname, "../../")
const dev = {
    root: devRoot,
    src: path.resolve(devRoot, "src"),
}

const prod = () => ({
    workspace: path.resolve(cwd, "workspace"),
})

export const defination = () => ({
    path: {
        dev,
        prod: prod(),
    },
})
