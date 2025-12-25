import { logoutApi, getMeApi } from "src/apis/auth.api"
import * as actions from "./App.actions"

export const logout = () => dispatch => {
  dispatch(actions.logoutRequested())
  return logoutApi()
    .then(() => {
      localStorage.removeItem("token")
      return dispatch(actions.logoutSuccess())
    })
    .catch(err => {
      localStorage.removeItem("token")
      return dispatch(actions.logoutFailed(err))
    })
}

export const getMe = () => dispatch => {
  dispatch(actions.getMeRequested())
  return getMeApi()
    .then(user => {
      return dispatch(actions.getMeSuccess(user))
    })
    .catch(err => {
      localStorage.removeItem("token")
      return dispatch(actions.getMeFailed(err))
    })
}
