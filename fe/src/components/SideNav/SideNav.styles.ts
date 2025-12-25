import styled from "styled-components"

export const SideNavWrapper = styled.div`
  .ant-layout-sider {
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    overflow: auto;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    transition: all 0.2s;
  }
`

interface LogoWrapperProps {
  $collapsed: boolean
}

export const LogoWrapper = styled.div<LogoWrapperProps>`
  height: 64px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: ${props => props.$collapsed ? "14px" : "18px"};
  font-weight: bold;
`

