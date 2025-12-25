import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Login = lazy(() => import("src/pages/Login/Login"))

export const loginRoutes = (
  <Route
    path={PATH.LOGIN.url}
    element={
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    }
  />
)

