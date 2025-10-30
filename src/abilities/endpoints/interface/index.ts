import type { ProjectDescription } from "@/abilities/helper/project-description"

export type DropservEndpoint = {
    name: string
    /**
     * 判断托管可能性
     * Judge the possibility of hosting
     * @description 例如：对于静态资源托管，在项目中找到 index.html 使得可能性为 1，但同时也找到了 package.json 表示可能是 vite 这种需要构建的项目，则降低可能性到 0.5。这里只需要给出感觉的值，不需要严谨的量化。
     * @description For example, for static resource hosting, finding index.html in the project makes the possibility 1, but at the same time finding package.json indicating that it may be a project that needs to be built such as vite, the possibility is reduced to 0.5. Here, you only need to give the value of the feeling, and there is no need for rigorous quantification.
     * @returns 可能性（0 ~ 1）
     * @returns Possibility (0 ~ 1)
     */
    checkAvailable: (projDesc: ProjectDescription) => number
}
