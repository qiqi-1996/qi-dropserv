import { AppPage } from "@/web/components/app-layout"
import { CreateAppEntry } from "@/web/components/create-app"

export default function () {
    return (
        <AppPage>
            <div className="flex flex-col gap-2">
                <p>Minimize</p>
                <CreateAppEntry
                    dropzone={{
                        minimize: true,
                    }}
                />
                <p>Normal</p>
                <CreateAppEntry />
            </div>
        </AppPage>
    )
}
