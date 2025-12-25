import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Users = lazy(() => import("src/pages/Users/Users"))

export const usersRoutes = (
  <Route
    path={PATH.USERS.url}
    element={
      <AuthenticatedGuard>
        <PermissionGuard resourceType={PATH.USERS.resourceType}>
          <Suspense fallback={<Loading />}>
            <Users />
          </Suspense>
        </PermissionGuard>
      </AuthenticatedGuard>
    }
  />
)

