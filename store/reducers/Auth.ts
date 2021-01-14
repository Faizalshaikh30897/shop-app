import { AuthActionType, AUTHENTICATE, LOGIN, LOGOUT, SET_DID_TRY_AL, SIGN_UP } from "../actions/Auth";

export interface AuthState {
  token: string | null;
  userId: string | null;
  didTryAutoLogin: boolean;
}

const initialState: AuthState = {
  token: null,
  userId: null,
  didTryAutoLogin: false
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
        didTryAutoLogin: true
      };
    case LOGOUT:
      return {
        ...state,
        token:null,
        userId: null,
        didTryAutoLogin: true
      }
    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true
      }
    default:
      return state;
  }

  return state;
};
