import { connect, type ConnectedProps } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Layout, Input, Button, Avatar, Dropdown, Space } from "antd"
import { SearchOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons"
import { logout } from "src/App/App.thunks"
import { PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import type { MenuProps } from "antd"
import {
  UserHeaderWrapper,
  UserInfoWrapper,
  UserName,
  UserUsername,
  HeaderLeft,
  LogoContainer,
  LogoText,
  SearchContainer,
  HeaderRight
} from "./UserHeader.styles"

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
        <UserInfoWrapper>
          <UserName>{user?.name || "Người dùng"}</UserName>
          <UserUsername>@{user?.userName || ""}</UserUsername>
        </UserInfoWrapper>
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
        <HeaderLeft>
          <LogoContainer>TK</LogoContainer>
          <LogoText>Trung tâm dạy thêm Thế Kiên</LogoText>
        </HeaderLeft>

        <SearchContainer>
          <Input
            placeholder="Tìm kiếm khóa học, bài viết, video, ..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            size="large"
            style={{ borderRadius: "8px" }}
          />
        </SearchContainer>

        <HeaderRight>
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
        </HeaderRight>
      </AntHeader>
    </UserHeaderWrapper>
  )
}

export default connector(UserHeader)

