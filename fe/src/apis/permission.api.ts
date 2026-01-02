import { apiClient } from "./base.api"
import type { Permission, PermissionListResponse } from "../@types/permission"

export const getPermissionsApi = async (): Promise<Permission[]> => {
  const response = await apiClient.get<PermissionListResponse>("/permissions", {
    params: { limit: 1000 }
  })

  if (response?.status === 200 && response?.data) {
    return response.data.items
  }

  throw new Error(response?.message || "Lấy danh sách permissions thất bại")
}
