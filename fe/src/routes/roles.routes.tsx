import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Roles = lazy(() => import("src/pages/Roles/Roles"))

export const rolesRoutes = (
  <Route
    path={PATH.ROLES.url}
    element={
      <AuthenticatedGuard>
        <PermissionGuard resourceType={PATH.ROLES.resourceType}>
          <Suspense fallback={<Loading />}>
            <Roles />
          </Suspense>
        </PermissionGuard>
      </AuthenticatedGuard>
    }
  />
)

