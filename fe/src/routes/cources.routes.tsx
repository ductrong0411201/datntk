import { lazy, Suspense, Fragment } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Cources = lazy(() => import("src/pages/Cources/Cources"))
const CourceForm = lazy(() => import("src/pages/Cources/CourceForm"))

export const courcesRoutes = (
  <Fragment>
    <Route
      path={PATH.COURSES.url}
      element={
        <AuthenticatedGuard>
          <PermissionGuard resourceType={PATH.COURSES.resourceType}>
            <Suspense fallback={<Loading />}>
              <Cources />
            </Suspense>
          </PermissionGuard>
        </AuthenticatedGuard>
      }
    />
    <Route
      path={`${PATH.COURSES.url}/new`}
      element={
        <AuthenticatedGuard>
          <PermissionGuard resourceType={PATH.COURSES.resourceType}>
            <Suspense fallback={<Loading />}>
              <CourceForm />
            </Suspense>
          </PermissionGuard>
        </AuthenticatedGuard>
      }
    />
    <Route
      path={`${PATH.COURSES.url}/:id/edit`}
      element={
        <AuthenticatedGuard>
          <PermissionGuard resourceType={PATH.COURSES.resourceType}>
            <Suspense fallback={<Loading />}>
              <CourceForm />
            </Suspense>
          </PermissionGuard>
        </AuthenticatedGuard>
      }
    />
  </Fragment>
)

