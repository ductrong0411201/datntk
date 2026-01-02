import type { UserListItem, UserResponse } from "./user"

export interface TeacherListResponse {
  status: number
  data: UserListItem[]
  message: string
}

