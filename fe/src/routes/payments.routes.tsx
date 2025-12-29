import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const Payments = lazy(() => import("src/pages/Payments/Payments"))

export const paymentsRoutes = (
  <Route
    path={PATH.PAYMENTS.url}
    element={
      <AuthenticatedGuard>
        <PermissionGuard resourceType={PATH.PAYMENTS.resourceType}>
          <Suspense fallback={<Loading />}>
            <Payments />
          </Suspense>
        </PermissionGuard>
      </AuthenticatedGuard>
    }
  />
)

