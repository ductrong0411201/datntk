import { connect, type ConnectedProps } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { Layout, Menu } from "antd"
import { HomeOutlined, SafetyOutlined, UserOutlined, BookOutlined, CreditCardOutlined, DollarOutlined, FileTextOutlined, TeamOutlined } from "@ant-design/icons"
import { ADMIN_PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import { hasPageAccess } from "src/utils/permission"
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
      key: ADMIN_PATH.HOME.url,
      icon: <HomeOutlined />,
      label: ADMIN_PATH.HOME.name,
      pathKey: "HOME" as keyof typeof ADMIN_PATH
    },
    {
      key: ADMIN_PATH.ROLES.url,
      icon: <SafetyOutlined />,
      label: ADMIN_PATH.ROLES.name,
      pathKey: "ROLES" as keyof typeof ADMIN_PATH
    },
    {
      key: ADMIN_PATH.TEACHERS.url,
      icon: <TeamOutlined />,
      label: ADMIN_PATH.TEACHERS.name,
      pathKey: "TEACHERS" as keyof typeof ADMIN_PATH
    },
    {
      key: ADMIN_PATH.STUDENTS.url,
      icon: <UserOutlined />,
      label: ADMIN_PATH.STUDENTS.name,
      pathKey: "STUDENTS" as keyof typeof ADMIN_PATH
    },
    {
      key: ADMIN_PATH.SUBJECTS.url,
      icon: <BookOutlined />,
      label: ADMIN_PATH.SUBJECTS.name,
      pathKey: "SUBJECTS" as keyof typeof ADMIN_PATH
    },
    {
      key: ADMIN_PATH.COURSES.url,
      icon: <FileTextOutlined />,
      label: ADMIN_PATH.COURSES.name,
      pathKey: "COURSES" as keyof typeof ADMIN_PATH
    },
    {
      key: ADMIN_PATH.PAYMENT_METHODS.url,
      icon: <CreditCardOutlined />,
      label: ADMIN_PATH.PAYMENT_METHODS.name,
      pathKey: "PAYMENT_METHODS" as keyof typeof ADMIN_PATH
    },
    {
      key: ADMIN_PATH.PAYMENTS.url,
      icon: <DollarOutlined />,
      label: ADMIN_PATH.PAYMENTS.name,
      pathKey: "PAYMENTS" as keyof typeof ADMIN_PATH
    }
  ]

  const menuItems = allMenuItems.filter(item => {
    if (item.pathKey === "HOME") {
      return true
    }
    return hasPageAccess(user, item.pathKey, "ADMIN")
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

