import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Teachers = lazy(() => import("src/pages/Teachers/Teachers"))

export const teachersRoutes = (
  <Route
    path={PATH.TEACHERS.url}
    element={
      <AuthenticatedGuard>
        <PermissionGuard resourceType={PATH.TEACHERS.resourceType}>
          <Suspense fallback={<Loading />}>
            <Teachers />
          </Suspense>
        </PermissionGuard>
      </AuthenticatedGuard>
    }
  />
)

