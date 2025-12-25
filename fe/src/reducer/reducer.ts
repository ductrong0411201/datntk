import { combineReducers } from "redux"
import { AppReducer } from "src/App/App.reducer"
import { loginReducer } from "src/pages/Login/Login.reducer"
import { registerReducer } from "src/pages/Register/Register.reducer"

const rootReducer = combineReducers({
  app: AppReducer,
  login: loginReducer,
  register: registerReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
