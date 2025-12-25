import { Navigate } from "react-router-dom"
import { connect } from "react-redux"
import type { RootState } from "src/reducer/reducer"

interface ReduxProps {
  isAuthenticated: boolean
}
interface Props extends ReduxProps {
  children: React.ReactNode
}

function AuthenticatedGuard({ isAuthenticated, children }: Props) {
  if (!isAuthenticated && !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.app.isAuthenticated
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedGuard)
