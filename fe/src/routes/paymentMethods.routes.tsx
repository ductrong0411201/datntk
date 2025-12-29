import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"
import AuthenticatedGuard from "src/guards/AuthenticatedGuard"
import PermissionGuard from "src/guards/PermissionGuard"
import { PATH } from "src/constants/paths"
import Loading from "src/components/Loading/Loading"

const PaymentMethods = lazy(() => import("src/pages/PaymentMethods/PaymentMethods"))

export const paymentMethodsRoutes = (
  <Route
    path={PATH.PAYMENT_METHODS.url}
    element={
      <AuthenticatedGuard>
        <PermissionGuard resourceType={PATH.PAYMENT_METHODS.resourceType}>
          <Suspense fallback={<Loading />}>
            <PaymentMethods />
          </Suspense>
        </PermissionGuard>
      </AuthenticatedGuard>
    }
  />
)

