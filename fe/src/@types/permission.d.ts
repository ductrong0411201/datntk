import type { User } from "./user"

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

export type PathWithResource = {
  resourceType: string
  url: string
  name: string
}

export type PathWithoutResource = {
  url: string
  name: string
}

export type PathConfig = PathWithResource | PathWithoutResource

export interface CheckPermissionParams {
  user: User | null | undefined
  resourceType: string
  action: string
}

export interface HasPageAccessParams {
  user: User | null | undefined
  pathKey: string
}
