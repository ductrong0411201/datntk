import styled from "styled-components"

export const UserSidebarWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 200px;
  background: #fff;
  z-index: 999;
  
  @media (max-width: 768px) {
    display: none;
  }
`

