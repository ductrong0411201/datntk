import { lazy, Suspense, Fragment } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import AdminGuard from "src/guards/AdminGuard"
import UserGuard from "src/guards/UserGuard"
import { ADMIN_PATH, USER_PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Home = lazy(() => import("src/pages/Home/Home"))
const CourseDetail = lazy(() => import("src/pages/Courses/CourseDetail"))

export const homeRoutes = (
  <Fragment>
    <Route
      path={ADMIN_PATH.HOME.url}
      element={
        <AuthenticatedGuard>
          <AdminGuard>
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          </AdminGuard>
        </AuthenticatedGuard>
      }
    />
    <Route
      path={USER_PATH.HOME.url}
      element={
        <AuthenticatedGuard>
          <UserGuard>
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          </UserGuard>
        </AuthenticatedGuard>
      }
    />
    <Route
      path="/courses/:id"
      element={
        <AuthenticatedGuard>
          <UserGuard>
            <Suspense fallback={<Loading />}>
              <CourseDetail />
            </Suspense>
          </UserGuard>
        </AuthenticatedGuard>
      }
    />
  </Fragment>
)

