import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import AdminGuard from "src/guards/AdminGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { ADMIN_PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Teachers = lazy(() => import("src/pages/Teachers/Teachers"))

export const teachersRoutes = (
  <Route
    path={ADMIN_PATH.TEACHERS.url}
    element={
      <AuthenticatedGuard>
        <AdminGuard>
          <PermissionGuard resourceType={ADMIN_PATH.TEACHERS.resourceType}>
            <Suspense fallback={<Loading />}>
              <Teachers />
            </Suspense>
          </PermissionGuard>
        </AdminGuard>
      </AuthenticatedGuard>
    }
  />
)

