import { useState, useEffect, useRef } from "react"
import { connect, type ConnectedProps } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button, Dropdown, Typography } from "antd"
import { SearchOutlined, UserOutlined, LogoutOutlined, CloseOutlined } from "@ant-design/icons"
import { logout } from "src/App/App.thunks"
import { PATH, USER_PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import type { MenuProps } from "antd"
import type { Course } from "src/@types/course"
import { getCoursesApi } from "src/apis/course.api"
import { getRandomSubjectImage } from "src/utils/subjectImages"
import {
  UserHeaderWrapper,
  UserInfoWrapper,
  UserName,
  UserUsername,
  HeaderLeft,
  LogoContainer,
  LogoText,
  SearchContainer,
  HeaderRight,
  SearchResultItem,
  SearchResultHeader,
  SearchResultHeaderIcon,
  SearchResultSection,
  SearchResultTitle,
  HeaderStyled,
  SearchWrapper,
  SearchIconWrapper,
  SearchInput,
  ClearIconWrapper,
  SearchDropdown,
  SearchLoading,
  SearchEmpty,
  SearchSectionHeader,
  ThumbnailImage,
  CourseName,
  AvatarWrapper,
  AvatarStyled,
  LogoutButton,
  MenuItemWrapper
} from "./UserHeader.styles"

const { Text } = Typography

const mapStateToProps = (state: RootState) => ({
  logoutLoading: state.app.logoutLoading,
  user: state.app.user,
  isAuthenticated: state.app.isAuthenticated
})

const mapDispatchToProps = {
  logout
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface Props extends ConnectedProps<typeof connector> {}

const UserHeader = (props: Props) => {
  const { logout, logoutLoading, user, isAuthenticated } = props
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")
  const [searchResults, setSearchResults] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchValue.trim().length === 0) {
      setSearchResults([])
      setOpen(false)
      return
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true)
        const response = await getCoursesApi(1, 3, undefined, undefined, searchValue.trim())
        setSearchResults(response.items || [])
        setOpen(true)
      } catch (error) {
        console.error("Lỗi khi tìm kiếm khóa học:", error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchValue])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handleClear = () => {
    setSearchValue("")
    setSearchResults([])
    setOpen(false)
  }

  const handleSelect = (courseId: string) => {
    navigate(`/courses/${courseId}`)
    setSearchValue("")
    setSearchResults([])
    setOpen(false)
  }

  const handleLogout = () => {
    if (logoutLoading) return
    logout()
      .then(() => {
        navigate(PATH.LOGIN.url, { replace: true })
      })
      .catch(() => {
        navigate(PATH.LOGIN.url, { replace: true })
      })
  }

  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <MenuItemWrapper>
          <UserInfoWrapper>
            <UserName>{user?.name || "Người dùng"}</UserName>
            <UserUsername>@{user?.userName || ""}</UserUsername>
          </UserInfoWrapper>
        </MenuItemWrapper>
      ),
      disabled: true
    },
    {
      key: "logout",
      label: (
        <LogoutButton
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          loading={logoutLoading}
        >
          Đăng xuất
        </LogoutButton>
      )
    }
  ]

  return (
    <UserHeaderWrapper>
      <HeaderStyled>
        <HeaderLeft>
          <LogoContainer onClick={() => navigate(USER_PATH.HOME.url)}>TK</LogoContainer>
          <LogoText>Trung tâm dạy thêm Thế Kiên</LogoText>
        </HeaderLeft>

        <SearchContainer>
          <SearchWrapper ref={searchContainerRef}>
            <SearchIconWrapper>
              <SearchOutlined />
            </SearchIconWrapper>
            <SearchInput
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm kiếm khóa học"
              size="large"
              prefix={null}
              suffix={searchValue ? (
                <ClearIconWrapper
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                >
                  <CloseOutlined />
                </ClearIconWrapper>
              ) : null}
              onFocus={() => {
                if (searchResults.length > 0 || searchValue.trim().length > 0) {
                  setOpen(true)
                }
              }}
            />
            {open && (searchResults.length > 0 || loading || (searchValue.trim().length > 0 && !loading)) && (
              <SearchDropdown
                onMouseDown={(e) => {
                  e.preventDefault()
                }}
              >
                {loading ? (
                  <SearchLoading>Đang tìm kiếm...</SearchLoading>
                ) : searchResults.length > 0 ? (
                  <>
                    <SearchResultHeader>
                      <SearchResultHeaderIcon />
                      <Text type="secondary">Kết quả cho '{searchValue}'</Text>
                    </SearchResultHeader>
                    <SearchResultSection>
                      <SearchSectionHeader>
                        <SearchResultTitle>KHÓA HỌC</SearchResultTitle>
                      </SearchSectionHeader>
                      {searchResults.map((course) => {
                        const thumbnailImage = getRandomSubjectImage(course.subject?.name, course.id)
                        return (
                          <SearchResultItem
                            key={course.id}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              handleSelect(course.id.toString())
                            }}
                          >
                            <ThumbnailImage imageUrl={thumbnailImage} />
                            <CourseName strong>{course.name}</CourseName>
                          </SearchResultItem>
                        )
                      })}
                    </SearchResultSection>
                  </>
                ) : searchValue.trim().length > 0 ? (
                  <SearchEmpty>
                    Không tìm thấy kết quả
                  </SearchEmpty>
                ) : null}
              </SearchDropdown>
            )}
          </SearchWrapper>
        </SearchContainer>

        <HeaderRight>
          {isAuthenticated && user ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
              <AvatarWrapper>
                <AvatarStyled size="default" icon={<UserOutlined />} />
              </AvatarWrapper>
            </Dropdown>
          ) : (
            <>
              <Button onClick={() => navigate(PATH.REGISTER.url)}>
                Đăng ký
              </Button>
              <Button type="primary" onClick={() => navigate(PATH.LOGIN.url)}>
                Đăng nhập
              </Button>
            </>
          )}
        </HeaderRight>
      </HeaderStyled>
    </UserHeaderWrapper>
  )
}

export default connector(UserHeader)

