import { StrictMode, Suspense, useMemo } from "react"
import { createRoot } from "react-dom/client"

import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/dropzone/styles.css"
import { BrowserRouter, createBrowserRouter, useRoutes } from "react-router-dom"
import { AppMainLayout } from "./components/app-layout/main"
import "./index.css"
import { menus } from "./menus"
import { routes } from "./routes"

const theme = createTheme({
    colors: {
        brand: [
            "#ebf0ff",
            "#d2ddfa",
            "#a0b8f7",
            "#6c90f6",
            "#446ff5",
            "#2f5af6",
            "#254ff7",
            "#1b41dc",
            "#1339c5",
            "#002fa7",
        ],
    },
    primaryColor: "brand",
    respectReducedMotion: true,
    defaultRadius: "lg",
})

let router = createBrowserRouter(routes)

const Page = () => <Suspense fallback={"Loading..."}>{useRoutes(routes)}</Suspense>

function App() {
    const m = useMemo(menus, [])

    return (
        <StrictMode>
            <ColorSchemeScript defaultColorScheme="auto" />
            <MantineProvider theme={theme} defaultColorScheme="auto">
                <BrowserRouter>
                    <AppMainLayout menus={m}>
                        <Page />
                    </AppMainLayout>
                </BrowserRouter>
            </MantineProvider>
        </StrictMode>
    )
}

const elem = document.getElementById("root")!
if (import.meta.hot) {
    // With hot module reloading, `import.meta.hot.data` is persisted.
    const root = (import.meta.hot.data.root ??= createRoot(elem))
    root.render(<App />)
} else {
    // The hot module reloading API is not available in production.
    createRoot(elem).render(<App />)
}
