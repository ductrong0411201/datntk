import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Subjects = lazy(() => import("src/pages/Subjects/Subjects"))

export const subjectsRoutes = (
  <Route
    path={PATH.SUBJECTS.url}
    element={
      <AuthenticatedGuard>
        <PermissionGuard resourceType={PATH.SUBJECTS.resourceType}>
          <Suspense fallback={<Loading />}>
            <Subjects />
          </Suspense>
        </PermissionGuard>
      </AuthenticatedGuard>
    }
  />
)

