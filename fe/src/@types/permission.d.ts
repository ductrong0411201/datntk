import type { User, Permission } from "./user"

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
