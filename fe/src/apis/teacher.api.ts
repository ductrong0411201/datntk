import { apiClient } from "./base.api"
import type { UserListItem, UserResponse } from "../@types/user"
import type { TeacherListResponse } from "../@types/teacher"

export const getTeachersApi = async (page: number = 1, limit: number = 10): Promise<{ items: UserListItem[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
  const response = await apiClient.get<TeacherListResponse>(`/users/teachers?page=${page}&limit=${limit}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách giáo viên thất bại")
}

export const getTeacherByIdApi = async (id: number): Promise<UserListItem> => {
  const response = await apiClient.get<UserResponse>(`/users/teachers/${id}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin giáo viên thất bại")
}

export const createTeacherApi = async (data: {
  name: string
  userName: string
  email: string
  password: string
  subject_id?: number
  degree?: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
}): Promise<UserListItem> => {
  const response = await apiClient.post<UserResponse>("/users/teachers", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo giáo viên thất bại")
}

export const updateTeacherApi = async (id: number, data: {
  name?: string
  userName?: string
  email?: string
  subject_id?: number
  degree?: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
}): Promise<UserListItem> => {
  const response = await apiClient.put<UserResponse>(`/users/teachers/${id}`, data)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Cập nhật giáo viên thất bại")
}

export const changeTeacherPasswordApi = async (id: number, password: string): Promise<void> => {
  const response = await apiClient.put<{ status: number; message: string; data: null }>(`/users/teachers/${id}/password`, { password })

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Đổi mật khẩu thất bại")
}

export const deleteTeacherApi = async (id: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/users/teachers/${id}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa giáo viên thất bại")
}

