import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Students = lazy(() => import("src/pages/Students/Students"))

export const studentsRoutes = (
  <Route
    path={PATH.STUDENTS.url}
    element={
      <AuthenticatedGuard>
        <PermissionGuard resourceType={PATH.STUDENTS.resourceType}>
          <Suspense fallback={<Loading />}>
            <Students />
          </Suspense>
        </PermissionGuard>
      </AuthenticatedGuard>
    }
  />
)

