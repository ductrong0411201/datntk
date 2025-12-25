import { Navigate } from "react-router-dom"
import { connect } from "react-redux"
import type { RootState } from "src/reducer/reducer"
import type { User } from "src/@types/user"
import { checkPermission } from "src/utils/permission"
import { PATH } from "src/constants/paths"

interface ReduxProps {
  user: User | null
}

interface Props extends ReduxProps {
  children: React.ReactNode
  resourceType: string
}

function PermissionGuard({ user, children, resourceType }: Props) {
  if (!checkPermission(user, resourceType, "READ")) {
    return <Navigate to={PATH.NOT_FOUND.url} replace />
  }

  return <>{children}</>
}

const mapStateToProps = (state: RootState) => ({
  user: state.app.user
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PermissionGuard)
