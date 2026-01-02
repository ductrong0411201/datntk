import type { Permission } from "./permission"

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

