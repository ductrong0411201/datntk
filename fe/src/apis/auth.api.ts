import { apiClient } from "./base.api"

export const loginApi = async ({
  userNameOrEmail,
  password
}: ReqLogin): Promise<ResLoginApi> => {
  const response = await apiClient.post<{
    status: number
    data: {
      token: string
    }
    message: string
  }>("/login", {
    userNameOrEmail,
    password
  })

  if (response?.status === 200 && response?.data?.token) {
    return {
      status: 200,
      data: {
        token: response.data.token
      },
      message: response.message || "Đăng nhập thành công"
    }
  }

  throw new Error(response?.message || "Đăng nhập thất bại")
}

export const registerApi = async ({
  name,
  userName,
  email,
  password
}: ReqRegister): Promise<ResRegisterApi> => {
  const response = await apiClient.post<{
    status: number
    data: {
      id: string
      name: string
      userName: string
      email: string
    }
    message: string
  }>("/register", {
    name,
    userName,
    email,
    password
  })

  if (response?.status === 201 && response?.data) {
    return {
      status: 201,
      data: response.data,
      message: response.message || "Đăng ký thành công"
    }
  }

  throw new Error(response?.message || "Đăng ký thất bại")
}

export const getMeApi = async (): Promise<User> => {
  const response = await apiClient.get<ResGetMeApi>("/me")

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin người dùng thất bại")
}

export const logoutApi = async (): Promise<ResLogoutApi> => {
  const response = await apiClient.post<{
    status: number
    data: null
    message: string
  }>("/logout")

  if (response?.status === 200) {
    return response
  }
  throw new Error(response?.message || "Đăng xuất thất bại")
}