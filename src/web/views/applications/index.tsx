import type { DropservApplicationState } from "@/services/application/types"
import { AppPage } from "@/web/components/app-layout"
import { CreateAppEntry } from "@/web/components/create-app"
import { api } from "@/web/utils/request"
import { Paper } from "@mantine/core"
import useSWR from "swr"
import { AppEntry } from "./component/app-entry"

export default function () {
    const { data: appList, mutate: appListMutate } = useSWR(
        "/api/application/list",
        api.get<DropservApplicationState[]>,
    )

    return (
        <AppPage>
            <div className="flex flex-col gap-2">
                <h1 className="text-title font-title">创建应用</h1>
                <CreateAppEntry handleApplicationCreated={() => appListMutate()} />

                <h1 className="text-title font-title">应用列表</h1>

                <div className="grid grid-cols-4 gap-2">
                    {appList?.data.map((app) => {
                        return <AppEntry application={app} handleDeleted={() => appListMutate()} />
                    })}
                </div>
            </div>
        </AppPage>
    )
}
