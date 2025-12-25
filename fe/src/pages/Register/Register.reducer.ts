import * as types from "./Register.constants"
import { produce } from "immer"

const initialState = {
  loading: false
}

export const registerReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case types.REGISTER_REQUESTED:
        draft.loading = true
        break
      case types.REGISTER_SUCCESS:
        draft.loading = false
        break
      case types.REGISTER_FAILED:
        draft.loading = false
        break
      default:
        return state
    }
  })

