import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import AdminGuard from "src/guards/AdminGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { ADMIN_PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Subjects = lazy(() => import("src/pages/Subjects/Subjects"))

export const subjectsRoutes = (
  <Route
    path={ADMIN_PATH.SUBJECTS.url}
    element={
      <AuthenticatedGuard>
        <AdminGuard>
          <PermissionGuard resourceType={ADMIN_PATH.SUBJECTS.resourceType}>
            <Suspense fallback={<Loading />}>
              <Subjects />
            </Suspense>
          </PermissionGuard>
        </AdminGuard>
      </AuthenticatedGuard>
    }
  />
)

