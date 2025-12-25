import { connect, type ConnectedProps } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { Layout, Menu } from "antd"
import { HomeOutlined, SafetyOutlined, UserOutlined } from "@ant-design/icons"
import { PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import { hasPageAccess } from "src/utils/permission"
import hustLogo from "src/assets/images/hust-logo.jpg"
import { SideNavWrapper, LogoWrapper } from "./SideNav.styles"

const { Sider } = Layout

const mapStateToProps = (state: RootState) => ({
  closeSideNav: state.app.closeSideNav,
  user: state.app.user
})

const connector = connect(mapStateToProps)

interface Props extends ConnectedProps<typeof connector> {}

const SideNav = (props: Props) => {
  const { closeSideNav, user } = props
  const navigate = useNavigate()
  const location = useLocation()

  const allMenuItems = [
    {
      key: PATH.HOME.url,
      icon: <HomeOutlined />,
      label: PATH.HOME.name,
      pathKey: "HOME" as keyof typeof PATH
    },
    {
      key: PATH.ROLES.url,
      icon: <SafetyOutlined />,
      label: PATH.ROLES.name,
      pathKey: "ROLES" as keyof typeof PATH
    },
    {
      key: PATH.USERS.url,
      icon: <UserOutlined />,
      label: PATH.USERS.name,
      pathKey: "USERS" as keyof typeof PATH
    }
  ]

  const menuItems = allMenuItems.filter(item => {
    if (item.pathKey === "HOME") {
      return true
    }
    return hasPageAccess(user, item.pathKey)
  }).map(({ pathKey, ...item }) => item)

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <SideNavWrapper>
      <Sider
        trigger={null}
        collapsible
        collapsed={closeSideNav}
        width={250}
        collapsedWidth={80}
      >
        <LogoWrapper $collapsed={closeSideNav}>

          {closeSideNav ? "DT" : "DATNTK"}
        </LogoWrapper>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
    </SideNavWrapper>
  )
}

export default connector(SideNav)

