/**
 * Auto generated, do not modify.
 */
import Applications from "./views/applications/index.tsx"
import Dashboard from "./views/dashboard/index.tsx"
import DashboardDetails from "./views/dashboard/details.tsx"
import Environment from "./views/environment/index.tsx"
import Home from "./views/index.tsx"

export const routes = [
    { path: "/applications", Component: Applications },
    { path: "/dashboard", Component: Dashboard },
    { path: "/dashboard/details", Component: DashboardDetails },
    { path: "/environment", Component: Environment },
    { path: "/", Component: Home },
]

export type RouteKeys = "/applications" | "/dashboard" | "/dashboard/details" | "/environment" | "/"
