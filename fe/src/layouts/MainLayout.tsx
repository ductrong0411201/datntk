import type { ReactNode } from "react"
import { connect, type ConnectedProps } from "react-redux"
import Header from "src/components/Header/Header"
import SideNav from "src/components/SideNav/SideNav"
import type { RootState } from "src/reducer/reducer"
import { MainLayoutWrapper, MainContentWrapper, ContentWrapper } from "./MainLayout.styles"

const mapStateToProps = (state: RootState) => ({
  closeSideNav: state.app.closeSideNav
})

const connector = connect(mapStateToProps)

interface Props extends ConnectedProps<typeof connector> {
  children: ReactNode
}

function MainLayout(props: Props) {
  const { children, closeSideNav } = props
  return (
    <MainLayoutWrapper>
      <SideNav />
      <MainContentWrapper $collapsed={closeSideNav}>
        <Header />
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContentWrapper>
    </MainLayoutWrapper>
  )
}

export default connector(MainLayout)
