import * as types from "./App.constants"
import { LOGIN_SUCCESS } from "src/pages/Login/Login.constants"
import { produce } from "immer"

const initialState = {
  isAuthenticated: false,
  closeSideNav: false,
  logoutLoading: false,
  user: null as User | null,
  getUserLoading: false
}

export const AppReducer = (state = initialState, action: { type: string; payload?: any }) =>
  produce(state, draft => {
    switch (action.type) {
      case types.LOGOUT_REQUESTED:
        draft.logoutLoading = true
        break
      case types.LOGOUT_SUCCESS:
      case types.LOGOUT:
        localStorage.removeItem("token")
        draft.isAuthenticated = false
        draft.user = null
        draft.logoutLoading = false
        break
      case types.LOGOUT_FAILED:
        localStorage.removeItem("token")
        draft.isAuthenticated = false
        draft.user = null
        draft.logoutLoading = false
        break
      case LOGIN_SUCCESS:
        draft.isAuthenticated = true
        break
      case types.CLOSE_SIDE_NAV:
        draft.closeSideNav = !state.closeSideNav
        break
      case types.GET_ME_REQUESTED:
        draft.getUserLoading = true
        break
      case types.GET_ME_SUCCESS:
        draft.user = action.payload
        draft.isAuthenticated = true
        draft.getUserLoading = false
        break
      case types.GET_ME_FAILED:
        draft.user = null
        draft.isAuthenticated = false
        draft.getUserLoading = false
        break
      default:
        return state
    }
  })
