import { useNavigate, useLocation } from "react-router-dom"
import { Layout, Menu } from "antd"
import { HomeOutlined, BookOutlined } from "@ant-design/icons"
import { USER_PATH } from "src/constants/paths"
import { UserSidebarWrapper } from "./UserSidebar.styles"

const { Sider } = Layout

const menuItems = [
  {
    key: USER_PATH.HOME.url,
    icon: <HomeOutlined />,
    label: USER_PATH.HOME.name
  },
  {
    key: USER_PATH.COURSES.url,
    icon: <BookOutlined />,
    label: USER_PATH.COURSES.name
  },
]

const UserSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <UserSidebarWrapper>
      <Sider
        width={200}
        style={{
          position: "fixed",
          left: 0,
          top: "64px",
          bottom: 0,
          background: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)"
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ height: "100%", borderRight: 0, paddingTop: "16px" }}
        />
      </Sider>
    </UserSidebarWrapper>
  )
}

export default UserSidebar

