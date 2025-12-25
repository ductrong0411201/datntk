import styled from "styled-components"
import { Layout } from "antd"

interface MainContentWrapperProps {
  $collapsed: boolean
}

export const MainLayoutWrapper = styled(Layout)`
  min-height: 100vh;
  margin: 0 !important;
  padding: 0 !important;
`

export const MainContentWrapper = styled(Layout)<MainContentWrapperProps>`
  margin-left: ${props => props.$collapsed ? "80px" : "250px"};
  transition: margin-left 0.2s;
`

export const ContentWrapper = styled(Layout.Content)`
  padding: 24px;
  background: #f0f2f5;
  height: calc(100vh - 64px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

