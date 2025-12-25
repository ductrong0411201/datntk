import { useSelector } from "react-redux"
import type { RootState } from "src/reducer/reducer"

export const useUser = () => {
  const user = useSelector((state: RootState) => state.app.user)
  const isAuthenticated = useSelector((state: RootState) => state.app.isAuthenticated)
  const getUserLoading = useSelector((state: RootState) => state.app.getUserLoading)

  return {
    user,
    isAuthenticated,
    getUserLoading,
    hasRole: (roleCode: string) => {
      return user?.roleDetail?.code === roleCode
    },
    hasAnyRole: (roleCodes: string[]) => {
      return roleCodes.includes(user?.roleDetail?.code || "")
    }
  }
}

