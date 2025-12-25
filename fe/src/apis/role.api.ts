import { apiClient } from "./base.api"
import type { Permission } from "./permission.api"

export interface Role {
  id: number
  name: string
  code: string
  description?: string
  permissions?: Permission[]
}

export interface RoleListResponse {
  status: number
  data: {
    items: Role[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message: string
}

export interface RoleResponse {
  status: number
  data: Role
  message: string
}

export const getRolesApi = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  search?: string,
  filters?: Record<string, any>
): Promise<RoleListResponse["data"]> => {
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
  
  const response = await apiClient.get<RoleListResponse>("/roles", { params })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách vai trò thất bại")
}

export const getRoleByIdApi = async (id: number): Promise<Role> => {
  const response = await apiClient.get<RoleResponse>(`/roles/${id}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin vai trò thất bại")
}

export const createRoleApi = async (data: Omit<Role, "id">): Promise<Role> => {
  const response = await apiClient.post<RoleResponse>("/roles", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo vai trò thất bại")
}

export const updateRoleApi = async (id: number, data: Partial<Omit<Role, "id">>): Promise<Role> => {
  const response = await apiClient.put<RoleResponse>(`/roles/${id}`, data)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Cập nhật vai trò thất bại")
}

export const deleteRoleApi = async (id: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/roles/${id}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa vai trò thất bại")
}

