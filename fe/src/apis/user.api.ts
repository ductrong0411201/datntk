import { apiClient } from "./base.api"
import type { UserListItem, UserListResponse, UserResponse } from "../@types/user"

export const getUsersApi = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  search?: string,
  filters?: Record<string, any>
): Promise<UserListResponse["data"]> => {
  const params: any = { page, limit }
  if (sortBy) {
    params.sortBy = sortBy
    params.sortOrder = sortOrder || "ASC"
  }
  if (search && search.trim()) {
    params.search = search.trim()
  }
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
        params[key] = filters[key]
      }
    })
  }
  
  const response = await apiClient.get<UserListResponse>("/users", { params })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách người dùng thất bại")
}

export const getUserByIdApi = async (id: number): Promise<UserListItem> => {
  const response = await apiClient.get<UserResponse>(`/users/${id}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin người dùng thất bại")
}

export const createUserApi = async (data: {
  name: string
  userName: string
  email: string
  password: string
  role?: number
}): Promise<UserListItem> => {
  const response = await apiClient.post<UserResponse>("/users", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo người dùng thất bại")
}

export const updateUserApi = async (id: number, data: {
  name?: string
  userName?: string
  email?: string
  role?: number
}): Promise<UserListItem> => {
  const response = await apiClient.put<UserResponse>(`/users/${id}`, data)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Cập nhật người dùng thất bại")
}

export const changePasswordApi = async (id: number, password: string): Promise<void> => {
  const response = await apiClient.put<{ status: number; message: string; data: null }>(`/users/${id}/password`, { password })

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Đổi mật khẩu thất bại")
}

export const deleteUserApi = async (id: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/users/${id}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa người dùng thất bại")
}

export const getTeachersApi = async (page: number = 1, limit: number = 10): Promise<{ items: UserListItem[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
  const response = await apiClient.get<{ status: number; data: { items: UserListItem[]; meta: { page: number; limit: number; total: number; totalPages: number } }; message: string }>(`/users/teachers?page=${page}&limit=${limit}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách giáo viên thất bại")
}

