import styled from "styled-components"
import { Input, Button, Avatar, Space, Typography } from "antd"
import { SearchOutlined } from "@ant-design/icons"

const { Text } = Typography

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
  cursor: pointer;
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

export const SearchResultHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #8c8c8c;
`

export const SearchResultHeaderIcon = styled(SearchOutlined)`
  margin-right: 8px;
  color: #8c8c8c;
`

export const SearchResultSection = styled.div`
  max-height: 300px;
  overflow-y: auto;
`

export const SearchResultTitle = styled.span`
  font-weight: 500;
  font-size: 14px;
`

export const SearchResultMore = styled.span`
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`

export const SearchResultItem = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`

export const HeaderStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 1000;
`

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #bfbfbf;
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
`

export const SearchInput = styled(Input)`
  padding-left: 40px;
  border-radius: 8px;
`

export const ClearIconWrapper = styled.div`
  color: #bfbfbf;
  cursor: pointer;
  display: flex;
  align-items: center;
`

export const SearchDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
`

export const SearchLoading = styled.div`
  padding: 16px;
  text-align: center;
`

export const SearchEmpty = styled.div`
  padding: 16px;
  text-align: center;
  color: #8c8c8c;
`

export const SearchSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
`

export const ThumbnailImage = styled.div<{ imageUrl: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  margin-right: 12px;
  flex-shrink: 0;
`

export const CourseName = styled(Text)`
  font-size: 14px;
  font-weight: 500;
`

export const AvatarWrapper = styled(Space)`
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
`

export const AvatarStyled = styled(Avatar)`
  background-color: #1890ff;
`

export const LogoutButton = styled(Button)`
  width: 100%;
  text-align: left;
  padding: 0;
  height: auto;
`

export const MenuItemWrapper = styled.div`
  cursor: default;
`