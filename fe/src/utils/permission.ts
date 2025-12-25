import type { User, Permission } from "../@types/user"
import { PATH } from "../constants/paths"

export const checkPermission = (
  user: User | null | undefined,
  resourceType: string,
  action: string
): boolean => {
  if (!user || !user.roleDetail || !user.roleDetail.permissions) {
    return false
  }

  return user.roleDetail.permissions.some(
    (permission: Permission) =>
      permission.resourceType === resourceType && permission.action === action
  )
}

export const hasPageAccess = (
  user: User | null | undefined,
  pathKey: keyof typeof PATH
): boolean => {
  const path = PATH[pathKey]
  
  if (!("resourceType" in path)) {
    return true
  }

  return checkPermission(user, path.resourceType, "READ")
}
