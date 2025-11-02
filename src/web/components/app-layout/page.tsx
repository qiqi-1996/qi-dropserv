import type { ComponentProps } from "react"
import cs from "classnames"

export function AppPage(props: ComponentProps<"div">) {
    return <div className={cs("p-5", props.className)}>{props.children}</div>
}
