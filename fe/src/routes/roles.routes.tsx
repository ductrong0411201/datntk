import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import AdminGuard from "src/guards/AdminGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { ADMIN_PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Roles = lazy(() => import("src/pages/Roles/Roles"))

export const rolesRoutes = (
  <Route
    path={ADMIN_PATH.ROLES.url}
    element={
      <AuthenticatedGuard>
        <AdminGuard>
          <PermissionGuard resourceType={ADMIN_PATH.ROLES.resourceType}>
            <Suspense fallback={<Loading />}>
              <Roles />
            </Suspense>
          </PermissionGuard>
        </AdminGuard>
      </AuthenticatedGuard>
    }
  />
)

