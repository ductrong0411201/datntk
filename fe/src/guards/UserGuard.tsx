import { Navigate, useLocation } from "react-router-dom"
import { connect } from "react-redux"
import type { RootState } from "src/reducer/reducer"
import type { User } from "src/@types/user"
import { ADMIN_PATH, USER_PATH } from "src/constants/paths"

interface ReduxProps {
  user: User | null
}

interface Props extends ReduxProps {
  children: React.ReactNode
}

function UserGuard({ user, children }: Props) {
  const location = useLocation()
  const userRole = user?.roleDetail?.code

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (userRole === "hocsinh" || userRole === "giaovien") {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to={USER_PATH.HOME.url} replace />
    }
    return <>{children}</>
  }

  if (userRole === "admin" || userRole === "quanly") {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to={ADMIN_PATH.HOME.url} replace />
    }
    return <>{children}</>
  }

  return <>{children}</>
}

const mapStateToProps = (state: RootState) => ({
  user: state.app.user
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserGuard)

