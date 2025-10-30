import { AppShell, Divider, NavLink } from "@mantine/core"
import type { ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import cs from "classnames"
import type { RouteKeys } from "@/web/routes"
import { LuDroplet, LuDroplets, LuServer, LuServerCog, LuServerCrash, LuServerOff } from "react-icons/lu"

export function AppMainLayout(props: { menus?: MenuItem[]; children: ReactNode }) {
    const location = useLocation()

    return (
        <AppShell
            header={{ height: 80 }}
            // footer={{ height: 60 }}
            navbar={{ width: 300, breakpoint: "xs" }}
        >
            <AppShell.Header className="border-none!">
                <div className="w-full h-full flex items-center px-2">
                    <div className="flex items-center gap-1">
                        <LuServer className="text-primary text-title" />
                        <div className="text-title font-title leading-title-xs">Dropserv</div>
                    </div>
                </div>
            </AppShell.Header>
            <AppShell.Navbar className="border-none! px-2">
                <AppMenu currentPathname={location.pathname} menus={props.menus ?? []} />
            </AppShell.Navbar>
            <AppShell.Main>{props.children}</AppShell.Main>
            {/* <AppShell.Footer>Footer</AppShell.Footer> */}
        </AppShell>
    )
}

function AppMenu(props: { currentPathname: string; menus: MenuItem[] }) {
    const navigate = useNavigate()
    const isActive = (menu: MenuItem) => (!menu.type ? menu.route === props.currentPathname : false)

    return props.menus.map((menu, index) =>
        menu.type === "divider" ? (
            <Divider key={index} className="my-1" label={menu.label} />
        ) : (
            <NavLink
                className={cs("rounded-xl", isActive(menu) && "shadow-primary/10 shadow-lg")}
                variant="filled"
                key={menu.route || index}
                label={menu.label}
                leftSection={menu.icon}
                active={isActive(menu)}
                onClick={() => {
                    menu.route && navigate(menu.route)
                }}
                children={
                    menu.children ? (
                        <AppMenu menus={menu.children} currentPathname={props.currentPathname} />
                    ) : undefined
                }
            />
        ),
    )
}

export type MenuItem =
    | {
          type?: undefined
          label: ReactNode
          icon?: ReactNode
          route?: RouteKeys
          children?: MenuItem[]
      }
    | {
          type: "divider"
          label?: ReactNode
      }
