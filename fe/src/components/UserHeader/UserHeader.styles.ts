import styled from "styled-components"

export const UserHeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
`

export const UserInfoWrapper = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
`

export const UserName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`

export const UserUsername = styled.div`
  font-size: 12px;
  color: #8c8c8c;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const LogoContainer = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
`

export const LogoText = styled.span`
  font-size: 16px;
  font-weight: 500;
`

export const SearchContainer = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 24px;
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`
