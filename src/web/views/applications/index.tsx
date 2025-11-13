import { AppPage } from "@/web/components/app-layout"
import { CreateAppEntry } from "@/web/components/create-app"

export default function () {
    return (
        <AppPage>
            <div className="flex flex-col gap-2">
                <CreateAppEntry />
            </div>
        </AppPage>
    )
}
