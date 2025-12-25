import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const NotFound = lazy(() => import("src/pages/NotFound/NotFound"))

export const notFoundRoutes = (
  <Route
    path={PATH.NOT_FOUND.url}
    element={
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    }
  />
)
