import type { User } from "./user"

export interface ReqLogin {
  userNameOrEmail: string
  password: string
}

export interface ResLoginApi {
  status: number
  data: {
    token: string
  }
  message: string
}

export interface ReqRegister {
  name: string
  userName: string
  email: string
  password: string
}

export interface ResRegisterApi {
  status: number
  data: {
    id: number
    name: string
    userName: string
    email: string
  }
  message: string
}

export interface ResLogoutApi {
  status: number
  data: null
  message: string
}

export interface ResGetMeApi {
  status: number
  data: User
  message: string
}

