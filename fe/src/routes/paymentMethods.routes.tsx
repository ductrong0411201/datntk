import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import AdminGuard from "src/guards/AdminGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { ADMIN_PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const PaymentMethods = lazy(() => import("src/pages/PaymentMethods/PaymentMethods"))

export const paymentMethodsRoutes = (
  <Route
    path={ADMIN_PATH.PAYMENT_METHODS.url}
    element={
      <AuthenticatedGuard>
        <AdminGuard>
          <PermissionGuard resourceType={ADMIN_PATH.PAYMENT_METHODS.resourceType}>
            <Suspense fallback={<Loading />}>
              <PaymentMethods />
            </Suspense>
          </PermissionGuard>
        </AdminGuard>
      </AuthenticatedGuard>
    }
  />
)

