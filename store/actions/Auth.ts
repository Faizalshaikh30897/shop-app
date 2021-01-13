import { ThunkAction } from "redux-thunk";
import { RootState } from "../../App";
import { AuthState } from "../reducers/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SIGN_UP = "SIGN_UP";
export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer: NodeJS.Timeout;

interface SignUpAction {
  type: typeof SIGN_UP;
  tokenId: string;
  userId: string;
}

interface LoginAction {
  type: typeof LOGIN;
  tokenId: string;
  userId: string;
}

interface AuthenticateAction {
  type: typeof AUTHENTICATE;
  tokenId: string;
  userId: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionType =
  | SignUpAction
  | LoginAction
  | AuthenticateAction
  | LogoutAction;

const APIKey = "AIzaSyDOcJto57RzDgLbCpX1cS0OWm_pBnYbzLc";

export const signup = (
  email: string,
  password: string
): ThunkAction<void, RootState, unknown, SignUpAction> => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKey}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );
      console.log(`responose, ${JSON.stringify(response)}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Error data api, ${JSON.stringify(errorData)}`);
        const errorCode = errorData.error.message;
        let errorMessage = "Something went wrong!";
        if (errorCode === "EMAIL_EXISTS") {
          errorMessage = "Email already exists, Login instead";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(JSON.stringify(data));

      dispatch({ type: SIGN_UP, tokenId: data.idToken, userId: data.localId });
      const expirationDate = new Date(
        new Date().getTime() + Number(data.expiresIn) * 1000
      );
      dispatch(setLogoutTimer( Number(data.expiresIn) * 1000));
      saveDataToStorage(data.idToken, data.localId, expirationDate);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  };
};

export const login = (
  email: string,
  password: string
): ThunkAction<void, RootState, unknown, LoginAction> => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKey}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );
      console.log(`responose, ${JSON.stringify(response)}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Error data api, ${JSON.stringify(errorData)}`);
        const errorCode = errorData.error.message;
        let errorMessage = "Something went wrong!";
        if (errorCode === "EMAIL_NOT_FOUND") {
          errorMessage = "Email not found Sign up instead";
        } else if (errorCode === "INVALID_PASSWORD") {
          errorMessage = "Incorrect Password";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(JSON.stringify(data));
      
      dispatch({ type: LOGIN, tokenId: data.idToken, userId: data.localId });
      const expirationDate = new Date(
        new Date().getTime() + Number(data.expiresIn) * 1000
      );
      dispatch(setLogoutTimer( Number(data.expiresIn) * 1000));
      saveDataToStorage(data.idToken, data.localId, expirationDate);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  };
};

export const authenticate = (
  token: string,
  userId: string,
  expiryTime: number
): ThunkAction <void,RootState,unknown,AuthenticateAction> => {
  return (dispatch: any) =>{
    dispatch({
      type: AUTHENTICATE,
      tokenId: token,
      userId,
    });
    dispatch(setLogoutTimer(expiryTime));
  }
};

export const logout = (): LogoutAction => {
  AsyncStorage.removeItem("userData");
  clearLogoutTimer();
  return { type: LOGOUT };
};

const setLogoutTimer = (expiryTime: number) => {
  return (dispatch: any) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expiryTime);
  };
};

const clearLogoutTimer = () => {
  clearTimeout(timer);
};

const saveDataToStorage = (token: string, userId: string, expiryDate: Date) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    })
  );
};
