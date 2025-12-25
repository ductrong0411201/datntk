import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Home = lazy(() => import("src/pages/Home/Home"))

export const homeRoutes = (
  <Route
    path={PATH.HOME.url}
    element={
      <AuthenticatedGuard>
        <Suspense fallback={<Loading />}>
          <Home />
        </Suspense>
      </AuthenticatedGuard>
    }
  />
)

