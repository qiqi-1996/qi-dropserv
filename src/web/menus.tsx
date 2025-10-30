import type { MenuItem } from "./components/app-layout/main"
import { LuAppWindow, LuLayoutDashboard } from "react-icons/lu"

export const menus: () => MenuItem[] = () => [
    {
        label: "仪表盘",
        route: "/",
        icon: <LuLayoutDashboard />,
    },
    {
        type: "divider",
    },
    {
        label: "应用",
        route: "/applications",
        icon: <LuAppWindow />,
    },
]
