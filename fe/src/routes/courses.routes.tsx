import { lazy, Suspense, Fragment } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import AdminGuard from "src/guards/AdminGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { ADMIN_PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Courses = lazy(() => import("src/pages/Courses/Courses"))
const CourseForm = lazy(() => import("src/pages/Courses/CourseForm"))

export const coursesRoutes = (
  <Fragment>
    <Route
      path={ADMIN_PATH.COURSES.url}
      element={
        <AuthenticatedGuard>
          <AdminGuard>
            <PermissionGuard resourceType={ADMIN_PATH.COURSES.resourceType}>
              <Suspense fallback={<Loading />}>
                <Courses />
              </Suspense>
            </PermissionGuard>
          </AdminGuard>
        </AuthenticatedGuard>
      }
    />
    <Route
      path={`${ADMIN_PATH.COURSES.url}/new`}
      element={
        <AuthenticatedGuard>
          <AdminGuard>
            <PermissionGuard resourceType={ADMIN_PATH.COURSES.resourceType}>
              <Suspense fallback={<Loading />}>
                <CourseForm />
              </Suspense>
            </PermissionGuard>
          </AdminGuard>
        </AuthenticatedGuard>
      }
    />
    <Route
      path={`${ADMIN_PATH.COURSES.url}/:id/edit`}
      element={
        <AuthenticatedGuard>
          <AdminGuard>
            <PermissionGuard resourceType={ADMIN_PATH.COURSES.resourceType}>
              <Suspense fallback={<Loading />}>
                <CourseForm />
              </Suspense>
            </PermissionGuard>
          </AdminGuard>
        </AuthenticatedGuard>
      }
    />
  </Fragment>
)

