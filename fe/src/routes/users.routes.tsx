import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import AdminGuard from "src/guards/AdminGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { ADMIN_PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Users = lazy(() => import("src/pages/Users/Users"))

export const usersRoutes = (
  <Route
    path={ADMIN_PATH.USERS.url}
    element={
      <AuthenticatedGuard>
        <AdminGuard>
          <PermissionGuard resourceType={ADMIN_PATH.USERS.resourceType}>
            <Suspense fallback={<Loading />}>
              <Users />
            </Suspense>
          </PermissionGuard>
        </AdminGuard>
      </AuthenticatedGuard>
    }
  />
)

