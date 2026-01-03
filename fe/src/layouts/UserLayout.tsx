import type { ReactNode } from "react"
import { Layout } from "antd"
import UserHeader from "src/components/UserHeader/UserHeader"
import UserSidebar from "src/components/UserSidebar/UserSidebar"
import { UserLayoutWrapper, UserContentWrapper } from "./UserLayout.styles"

const { Content } = Layout

interface Props {
  children: ReactNode
}

function UserLayout(props: Props) {
  const { children } = props
  return (
    <UserLayoutWrapper>
      <UserHeader />
      <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
        <UserSidebar />
        <UserContentWrapper>
          <Content style={{ padding: "24px", background: "#f5f5f5", minHeight: "100%" }}>
            {children}
          </Content>
        </UserContentWrapper>
      </Layout>
    </UserLayoutWrapper>
  )
}

export default UserLayout

