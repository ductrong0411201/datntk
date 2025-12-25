import { apiClient } from "./base.api"

export interface Permission {
  id: number
  resourceType: string
  action: string
}

export interface PermissionListResponse {
  status: number
  data: {
    items: Permission[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message: string
}

export const getPermissionsApi = async (): Promise<Permission[]> => {
  const response = await apiClient.get<PermissionListResponse>("/permissions", {
    params: { limit: 1000 }
  })

  if (response?.status === 200 && response?.data) {
    return response.data.items
  }

  throw new Error(response?.message || "Lấy danh sách permissions thất bại")
}
