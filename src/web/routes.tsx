/**
 * Auto generated, do not modify.
 */
import Applications from "./views/applications/index.tsx"
import ApplicationsComponentAppEntry from "./views/applications/component/app-entry.tsx"
import Dashboard from "./views/dashboard/index.tsx"
import DashboardDetails from "./views/dashboard/details.tsx"
import Environment from "./views/environment/index.tsx"
import Home from "./views/index.tsx"

export const routes = [
    { path: "/applications", Component: Applications },
    { path: "/applications/component/app-entry", Component: ApplicationsComponentAppEntry },
    { path: "/dashboard", Component: Dashboard },
    { path: "/dashboard/details", Component: DashboardDetails },
    { path: "/environment", Component: Environment },
    { path: "/", Component: Home },
]

export type RouteKeys =
    | "/applications"
    | "/applications/component/app-entry"
    | "/dashboard"
    | "/dashboard/details"
    | "/environment"
    | "/"
