import { connect, type ConnectedProps } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Layout, Input, Button, Avatar, Dropdown, Space } from "antd"
import { SearchOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons"
import { logout } from "src/App/App.thunks"
import { PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import type { MenuProps } from "antd"
import { UserHeaderWrapper } from "./UserHeader.styles"

const { Header: AntHeader } = Layout

const mapStateToProps = (state: RootState) => ({
  logoutLoading: state.app.logoutLoading,
  user: state.app.user,
  isAuthenticated: state.app.isAuthenticated
})

const mapDispatchToProps = {
  logout
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface Props extends ConnectedProps<typeof connector> {}

const UserHeader = (props: Props) => {
  const { logout, logoutLoading, user, isAuthenticated } = props
  const navigate = useNavigate()

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
    <UserHeaderWrapper>
      <AntHeader style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "18px"
          }}>
            DT
          </div>
          <span style={{ fontSize: "16px", fontWeight: 500 }}>Học Lập Trình Để Đi Làm</span>
        </div>

        <div style={{ flex: 1, maxWidth: "600px", margin: "0 24px" }}>
          <Input
            placeholder="Tìm kiếm khóa học, bài viết, video, ..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            size="large"
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isAuthenticated && user ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
              <Space style={{ cursor: "pointer", padding: "4px 8px", borderRadius: "4px" }}>
                <Avatar size="default" icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
              </Space>
            </Dropdown>
          ) : (
            <>
              <Button onClick={() => navigate(PATH.REGISTER.url)}>
                Đăng ký
              </Button>
              <Button type="primary" onClick={() => navigate(PATH.LOGIN.url)}>
                Đăng nhập
              </Button>
            </>
          )}
        </div>
      </AntHeader>
    </UserHeaderWrapper>
  )
}

export default connector(UserHeader)

