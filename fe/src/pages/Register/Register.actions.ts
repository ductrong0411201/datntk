import * as types from "./Register.constants"

export const registerRequested = () => ({
  type: types.REGISTER_REQUESTED
})

export const registerSuccess = payload => ({
  type: types.REGISTER_SUCCESS,
  payload
})

export const registerFailed = payload => ({
  type: types.REGISTER_FAILED,
  payload
})

