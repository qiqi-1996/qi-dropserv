import type { RouteKeys } from "@/web/routes"
import { AppShell, Divider, NavLink } from "@mantine/core"
import cs from "classnames"
import type { ReactNode } from "react"
import { HiMiniServerStack } from "react-icons/hi2"
import { useLocation, useNavigate } from "react-router-dom"

export function AppMainLayout(props: { menus?: MenuItem[]; children: ReactNode }) {
    const location = useLocation()

    return (
        <AppShell
            header={{ height: 80 }}
            // footer={{ height: 60 }}
            navbar={{ width: 300, breakpoint: "xs" }}
        >
            <AppShell.Header className="border-none!">
                <div className="flex h-full w-full items-center px-2">
                    <div className="flex items-center gap-1">
                        <HiMiniServerStack className="text-title text-primary" />
                        <div className="text-title leading-title-xs font-title">Qi Dropserv</div>
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
                className={cs("rounded-xl", isActive(menu) && "shadow-lg shadow-primary/10")}
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
