import styled from "styled-components"
import { Layout } from "antd"

export const UserLayoutWrapper = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`

export const UserContentWrapper = styled(Layout)`
  margin-left: 200px;
  transition: margin-left 0.2s;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`

