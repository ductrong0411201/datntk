import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Register = lazy(() => import("src/pages/Register/Register"))

export const registerRoutes = (
  <Route
    path={PATH.REGISTER.url}
    element={
      <Suspense fallback={<Loading />}>
        <Register />
      </Suspense>
    }
  />
)

