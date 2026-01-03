import type { UserListItem, UserResponse } from "./user"

export interface StudentListResponse {
  status: number
  data: {
    items: UserListItem[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message: string
}

