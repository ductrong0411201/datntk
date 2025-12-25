import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getMe } from "src/App/App.thunks"

interface AppInitializerProps {
  children: React.ReactNode
}

function AppInitializer({ children }: AppInitializerProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      dispatch(getMe())
    }
  }, [dispatch])

  return <>{children}</>
}

export default AppInitializer

