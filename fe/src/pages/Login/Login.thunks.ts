import { loginApi } from "src/apis/auth.api"
import * as actions from "./Login.actions"
import { getMe } from "src/App/App.thunks"

export const login = (payload: ReqLogin) => dispatch => {
  dispatch(actions.loginRequested())
  return loginApi(payload)
    .then(res => {
      localStorage.setItem("token", res.data.token)
      dispatch(actions.loginSuccess(res))
      return dispatch(getMe())
    })
    .catch(err => Promise.reject(dispatch(actions.loginFailed(err))))
}
