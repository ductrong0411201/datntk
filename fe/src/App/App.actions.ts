import * as types from "./App.constants"

export const logoutRequested = () => ({
  type: types.LOGOUT_REQUESTED
})

export const logoutSuccess = () => ({
  type: types.LOGOUT_SUCCESS
})

export const logoutFailed = payload => ({
  type: types.LOGOUT_FAILED,
  payload
})

export const logout = () => ({
  type: types.LOGOUT
})

export const toggleSideNav = () => ({
  type: types.CLOSE_SIDE_NAV
})

export const getMeRequested = () => ({
  type: types.GET_ME_REQUESTED
})

export const getMeSuccess = (payload: User) => ({
  type: types.GET_ME_SUCCESS,
  payload
})

export const getMeFailed = (payload?: any) => ({
  type: types.GET_ME_FAILED,
  payload
})