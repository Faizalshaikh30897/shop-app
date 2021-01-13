import { AuthActionType, AUTHENTICATE, LOGIN, LOGOUT, SIGN_UP } from "../actions/Auth";

export interface AuthState {
  token: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  token: null,
  userId: null,
};

export const authReducer = (
  state: AuthState = initialState,
  action: AuthActionType
): AuthState => {
  switch (action.type) {
    case LOGIN:

    case SIGN_UP:

    case AUTHENTICATE:
      return {
        ...state,
        token: action.tokenId,
        userId: action.userId,
      };
    case LOGOUT:
      return initialState
    default:
      return state;
  }

  return state;
};
