import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { homeRoutes } from "./home.routes"
import { loginRoutes } from "./login.routes"
import { registerRoutes } from "./register.routes"
import { rolesRoutes } from "./roles.routes"
import { usersRoutes } from "./users.routes"
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
        {notFoundRoutes}
        <Route path="*" element={<Navigate to={PATH.NOT_FOUND.url} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
