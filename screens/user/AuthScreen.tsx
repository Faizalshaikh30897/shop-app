import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from "react-navigation-stack";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import COLORS from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { login, signup } from "../../store/actions/Auth";

interface NavigationProps {}

interface ScreenProps {}
interface Props
  extends NavigationStackScreenProps<NavigationProps, ScreenProps> {}

interface InputValues {
  email: string;
  password: string;
}

interface InputValidities {
  email: boolean;
  password: boolean;
}

type AuthFormState = {
  inputValues: InputValues;
  inputValidities: InputValidities;
  isFormValid: boolean;
};

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

type AuthFormAction = {
  type: typeof FORM_INPUT_UPDATE;
  value: string;
  isValid: boolean;
  input: string;
};

const formReducer = (
  state: AuthFormState,
  action: AuthFormAction
): AuthFormState => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedStateValidity = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      const isFormNowValid =
        updatedStateValidity.email && updatedStateValidity.password;
      return {
        ...state,
        inputValues: {
          ...state.inputValues,
          [action.input]: action.value,
        },
        inputValidities: updatedStateValidity,
        isFormValid: isFormNowValid,
      };
    default:
      return state;
  }
};

const AuthScreen: NavigationStackScreenComponent<
  NavigationProps,
  ScreenProps
> = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined | null>();

  const [state, formStateDispatch] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    isFormValid: false,
  });

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(()=>{
    if (error) {
      Alert.alert("An error occured!", error, [
        { text: "OK", style: "default" },
      ]);
    }
  },[error]);

  const dispatch = useDispatch();

  const inputChangeHandler = useCallback(
    (value: string, isValid: boolean, input: string) => {
      console.log(`updating form for ${input} validity is ${isValid}`);
      formStateDispatch({
        type: FORM_INPUT_UPDATE,
        input,
        isValid,
        value,
      });
    },
    [formStateDispatch]
  );

  const authHandler = async () => {
    // console.log(`auth handler ${JSON.stringify(state)}`);

    if (!state.isFormValid) {
      Alert.alert(
        "Wrong Input!",
        "Please Check all the fields and Fill them properly.",
        [
          {
            text: "OK",
            style: "default",
          },
        ]
      );
      return;
    }
    setIsLoading(true);
    setError(null);
    let action;
    if (isSignUp) {
      action = signup(state.inputValues.email, state.inputValues.password);
    } else {
      action = login(state.inputValues.email, state.inputValues.password);
    }

    try {
      await dispatch(action);
      props.navigation.navigate({
        routeName: "Shop"
      })
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
    
  };

  const switchModeHandler = () => {
    setIsSignUp((prev) => !prev);
  };

  if (isLoading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior="height"
      keyboardVerticalOffset={1}
    >
      <LinearGradient colors={["#ffedff", "#fffaff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              email
              autoCapitalize="none"
              label="E-mail"
              errorText="Please enter a valid email"
              required
              keyboardType="email-address"
              initialValue=""
              initiallyValid={false}
              onChangeInput={inputChangeHandler}
            />
            <Input
              id="password"
              autoCapitalize="none"
              label="Password"
              errorText="Please enter a valid password"
              required
              secureTextEntry
              keyboardType="default"
              initialValue=""
              onChangeInput={inputChangeHandler}
              minLength={5}
            />
            <View style={styles.button}>
              <Button
                title={isSignUp ? "SIGN UP" : "LOGIN"}
                color={COLORS.primary}
                onPress={authHandler}
              />
            </View>
            <View style={styles.button}>
              <Button
                title={isSignUp ? "LOGIN IN INSTEAD" : "SIGN UP INSTEAD"}
                color={COLORS.accent}
                onPress={switchModeHandler}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = (navigationData) => {
  return {
    headerTitle: "Login",
  };
};

export default AuthScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    maxWidth: 400,
    width: "80%",
    maxHeight: 400,
    padding: 10,
  },
  button: {
    marginVertical: 10,
  },
});
