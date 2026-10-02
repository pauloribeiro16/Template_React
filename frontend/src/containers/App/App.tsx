import Lazy, { lazyWithRetry as withRetry } from "@/components/lazy-component"
import { RouteEnum } from "@/config/constants"
import { SidebarLayout } from "@/containers/Layout/sidebar-layout"
import NotFound from "@/pages/NotFound"
import { Navigate, Route, Routes } from "react-router"

// As páginas são lazy SEMPRE fora do render — `Lazy(withRetry(...))` evita o
// ChunkLoadError quando um deploy novo invalida os chunks em cache.
const HomePage = Lazy(withRetry(() => import("@/pages/Home")))

function App() {
  return (
    <Routes>
      <Route element={<SidebarLayout />}>
        <Route path={RouteEnum.HOME + "/*"} element={<HomePage />} />
      </Route>
      <Route path="/" element={<Navigate to={RouteEnum.HOME} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
