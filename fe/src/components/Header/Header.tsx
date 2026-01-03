import { connect, type ConnectedProps } from "react-redux"
import { logout } from "src/App/App.thunks"
import { toggleSideNav } from "src/App/App.actions"
import { useNavigate, useLocation } from "react-router-dom"
import { ADMIN_PATH, PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import { Button, Layout, Typography, Dropdown, Avatar, Space } from "antd"
import { MenuOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import { HeaderWrapper } from "./Header.styles"

const { Header: AntHeader } = Layout

const mapStateToProps = (state: RootState) => ({
  logoutLoading: state.app.logoutLoading,
  user: state.app.user
})

const mapDispatchToProps = {
  logout,
  toggleSideNav
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface Props extends ConnectedProps<typeof connector> { }

const Header = (props: Props) => {
  const { logout, toggleSideNav, logoutLoading, user } = props
  const navigate = useNavigate()
  const location = useLocation()

  const getCurrentPageName = () => {
    const currentPath = location.pathname
    
    const adminMatch = Object.values(ADMIN_PATH).find(p => p.url === currentPath)
    if (adminMatch) {
      return adminMatch.name
    }
    
    if (currentPath.startsWith(ADMIN_PATH.COURSES.url)) {
      return ADMIN_PATH.COURSES.name
    }
    
    return ADMIN_PATH.HOME.name
  }

  const handleLogout = () => {
    if (logoutLoading) return
    logout()
      .then(() => {
        navigate(PATH.LOGIN.url, { replace: true })
      })
      .catch(() => {
        navigate(PATH.LOGIN.url, { replace: true })
      })
  }

  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0", marginBottom: "8px" }}>
          <div style={{ fontWeight: 500, marginBottom: "4px" }}>{user?.name || "Người dùng"}</div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>@{user?.userName || ""}</div>
        </div>
      ),
      disabled: true,
      style: { cursor: "default" }
    },
    {
      key: "logout",
      label: (
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          loading={logoutLoading}
          style={{ width: "100%", textAlign: "left", padding: 0, height: "auto" }}
        >
          Đăng xuất
        </Button>
      )
    }
  ]

  return (
    <HeaderWrapper>
      <AntHeader style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleSideNav}
            style={{ fontSize: "18px" }}
          />
          <Typography.Title level={4} style={{ margin: 0 }}>
            {getCurrentPageName()}
          </Typography.Title>
        </div>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
          <Space style={{ cursor: "pointer", padding: "4px 8px", borderRadius: "4px", transition: "background 0.2s" }} className="profile-dropdown-trigger">
            <Avatar size="default" icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
          </Space>
        </Dropdown>
      </AntHeader>
    </HeaderWrapper>
  )
}

export default connector(Header)
