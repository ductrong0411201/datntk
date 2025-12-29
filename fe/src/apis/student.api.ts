import { apiClient } from "./base.api"
import type { UserListItem, UserResponse } from "./user.api"

export interface StudentListResponse {
  status: number
  data: UserListItem[]
  message: string
}

export const getStudentsApi = async (): Promise<UserListItem[]> => {
  const response = await apiClient.get<StudentListResponse>("/users/students")

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách học sinh thất bại")
}

export const getStudentByIdApi = async (id: number): Promise<UserListItem> => {
  const response = await apiClient.get<UserResponse>(`/users/students/${id}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin học sinh thất bại")
}

export const createStudentApi = async (data: {
  name: string
  userName: string
  email: string
  password: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
}): Promise<UserListItem> => {
  const response = await apiClient.post<UserResponse>("/users/students", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo học sinh thất bại")
}

export const updateStudentApi = async (id: number, data: {
  name?: string
  userName?: string
  email?: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
}): Promise<UserListItem> => {
  const response = await apiClient.put<UserResponse>(`/users/students/${id}`, data)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Cập nhật học sinh thất bại")
}

export const changeStudentPasswordApi = async (id: number, password: string): Promise<void> => {
  const response = await apiClient.put<{ status: number; message: string; data: null }>(`/users/students/${id}/password`, { password })

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Đổi mật khẩu thất bại")
}

export const deleteStudentApi = async (id: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/users/students/${id}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa học sinh thất bại")
}

