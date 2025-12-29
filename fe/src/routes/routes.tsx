import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { homeRoutes } from "./home.routes"
import { loginRoutes } from "./login.routes"
import { registerRoutes } from "./register.routes"
import { rolesRoutes } from "./roles.routes"
import { usersRoutes } from "./users.routes"
import { subjectsRoutes } from "./subjects.routes"
import { paymentMethodsRoutes } from "./paymentMethods.routes"
import { paymentsRoutes } from "./payments.routes"
import { courcesRoutes } from "./cources.routes"
import { teachersRoutes } from "./teachers.routes"
import { studentsRoutes } from "./students.routes"
import { notFoundRoutes } from "./notFound.routes"
import { PATH } from "src/constants/paths"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {homeRoutes}
        {loginRoutes}
        {registerRoutes}
        {rolesRoutes}
        {usersRoutes}
        {subjectsRoutes}
        {paymentMethodsRoutes}
        {paymentsRoutes}
        {courcesRoutes}
        {teachersRoutes}
        {studentsRoutes}
        {notFoundRoutes}
        <Route path="*" element={<Navigate to={PATH.NOT_FOUND.url} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
