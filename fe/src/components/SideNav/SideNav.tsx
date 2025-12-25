import { connect, type ConnectedProps } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { Layout, Menu } from "antd"
import { HomeOutlined, SafetyOutlined, UserOutlined } from "@ant-design/icons"
import { PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import { SideNavWrapper, LogoWrapper } from "./SideNav.styles"

const { Sider } = Layout

const mapStateToProps = (state: RootState) => ({
  closeSideNav: state.app.closeSideNav
})

const connector = connect(mapStateToProps)

interface Props extends ConnectedProps<typeof connector> {}

const SideNav = (props: Props) => {
  const { closeSideNav } = props
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: PATH.HOME.url,
      icon: <HomeOutlined />,
      label: PATH.HOME.name
    },
    {
      key: PATH.ROLES.url,
      icon: <SafetyOutlined />,
      label: PATH.ROLES.name
    },
    {
      key: PATH.USERS.url,
      icon: <UserOutlined />,
      label: PATH.USERS.name
    }
  ]

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

