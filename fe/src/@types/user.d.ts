interface ReqLogin {
  userNameOrEmail: string
  password: string
}
interface ResLoginApi extends Res {
  status: number
  data: {
    token: string
  }
}

interface ReqRegister {
  name: string
  userName: string
  email: string
  password: string
}

interface ResRegisterApi extends Res {
  status: number
  data: {
    id: number
    name: string
    userName: string
    email: string
  }
}

interface ResLogoutApi extends Res {
  status: number
  data: any
  message: string
}

export interface Permission {
  id: number
  resourceType: string
  action: string
}

export interface User {
  id: number
  name: string
  userName: string
  email: string
  role: number
  roleDetail?: {
    id: number
    name: string
    code: string
    description?: string
    permissions?: Permission[]
  }
  createdAt?: string
  updatedAt?: string
}

export interface UserListItem {
  id: number
  name: string
  userName: string
  email: string
  role: number
  roleDetail?: {
    id: number
    name: string
    code: string
    description?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface UserListResponse {
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

export interface UserResponse {
  status: number
  data: UserListItem
  message: string
}

interface ResGetMeApi extends Res {
  status: number
  data: User
}

interface ResLogin extends ActionRedux { }
interface ResRegister extends ActionRedux { }
