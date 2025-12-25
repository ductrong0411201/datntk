import { registerApi } from "src/apis/auth.api"
import * as actions from "./Register.actions"

export const register = (payload: ReqRegister) => dispatch => {
  dispatch(actions.registerRequested())
  return registerApi(payload)
    .then(res => {
      return dispatch(actions.registerSuccess(res))
    })
    .catch(err => {
      const errorPayload = {
        message: err?.message || err?.payload?.message || "Đăng ký thất bại"
      }
      return Promise.reject(dispatch(actions.registerFailed(errorPayload)))
    })
}

