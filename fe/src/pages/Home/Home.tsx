import UserLayout from "src/layouts/UserLayout"
import MainLayout from "src/layouts/MainLayout"
import UserHome from "./UserHome"
import AdminHome from "./AdminHome"
import { useUser } from "src/hooks/useUser"

export default function Home() {
  const { hasAnyRole } = useUser()
  const isAdminOrManager = hasAnyRole(["admin", "quanly"])

  if (isAdminOrManager) {
    return (
      <MainLayout>
        <AdminHome />
      </MainLayout>
    )
  }

  return (
    <UserLayout>
      <UserHome />
    </UserLayout>
  )
}
