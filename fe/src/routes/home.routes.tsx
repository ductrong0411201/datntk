import { lazy, Suspense, Fragment } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import AdminGuard from "src/guards/AdminGuard"
import UserGuard from "src/guards/UserGuard"
import { ADMIN_PATH, USER_PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Home = lazy(() => import("src/pages/Home/Home"))
const CourseDetail = lazy(() => import("src/pages/Courses/CourseDetail"))
const MyCourses = lazy(() => import("src/pages/Courses/MyCourses"))
const MyCourseDetail = lazy(() => import("src/pages/Courses/MyCourseDetail"))

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
    <Route
      path={USER_PATH.COURSES.url}
      element={
        <AuthenticatedGuard>
          <UserGuard>
            <Suspense fallback={<Loading />}>
              <MyCourses />
            </Suspense>
          </UserGuard>
        </AuthenticatedGuard>
      }
    />
    <Route
      path={USER_PATH.MY_COURSE_DETAIL.url}
      element={
        <AuthenticatedGuard>
          <UserGuard>
            <Suspense fallback={<Loading />}>
              <MyCourseDetail />
            </Suspense>
          </UserGuard>
        </AuthenticatedGuard>
      }
    />
  </Fragment>
)

