import UserLayout from "src/layouts/UserLayout"
import MainLayout from "src/layouts/MainLayout"
import UserHome from "./UserHome"
import { useUser } from "src/hooks/useUser"

export default function Home() {
  const { hasAnyRole } = useUser()
  const isAdminOrManager = hasAnyRole(["admin", "quanly"])

  if (isAdminOrManager) {
    return (
      <MainLayout>
        <h2 className="mb-4">Trang chủ quản trị</h2>
      </MainLayout>
    )
  }

  return (
    <UserLayout>
      <UserHome />
    </UserLayout>
  )
}
