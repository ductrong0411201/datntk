import { connect, type ConnectedProps } from "react-redux"
import { logout } from "src/App/App.thunks"
import { toggleSideNav } from "src/App/App.actions"
import { useNavigate, useLocation } from "react-router-dom"
import { PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import { Button, Layout, Typography } from "antd"
import { MenuOutlined, LogoutOutlined } from "@ant-design/icons"
import { HeaderWrapper } from "./Header.styles"

const { Header: AntHeader } = Layout

const mapStateToProps = (state: RootState) => ({
  logoutLoading: state.app.logoutLoading
})

const mapDispatchToProps = {
  logout,
  toggleSideNav
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface Props extends ConnectedProps<typeof connector> { }

const Header = (props: Props) => {
  const { logout, toggleSideNav, logoutLoading } = props
  const navigate = useNavigate()
  const location = useLocation()

  const getCurrentPageName = () => {
    const currentPath = location.pathname
    const pathEntry = Object.values(PATH).find(p => p.url === currentPath)
    return pathEntry?.name || "Trang chủ"
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
        <Button
          type="default"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </AntHeader>
    </HeaderWrapper>
  )
}

export default connector(Header)
