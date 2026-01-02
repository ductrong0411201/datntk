import type { UserListItem, UserResponse } from "./user"

export interface StudentListResponse {
  status: number
  data: UserListItem[]
  message: string
}

