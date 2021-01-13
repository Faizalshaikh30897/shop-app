import React, { useEffect, useReducer } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface InputState {
  value: string;
  isValid: boolean;
  touched: boolean;
}

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

interface InputChangeAction {
  type: typeof INPUT_CHANGE;
  value: string;
  isValid: boolean;
}

interface InputBlurAction {
  type: typeof INPUT_BLUR;
}

type InputActionType = InputChangeAction | InputBlurAction;

const inputReducer = (
  state: InputState,
  action: InputActionType
): InputState => {
  switch (action.type) {
    case INPUT_BLUR:
      const blurAction = action as InputBlurAction;
      return {
        ...state,
        touched: true,
      };
    case INPUT_CHANGE:
      const changeAction = action as InputChangeAction;
      return {
        ...state,
        value: changeAction.value,
        isValid: changeAction.isValid,
      };

    default:
      return state;
  }
};

interface Props extends TextInputProps {
  initialValue?: string;
  initiallyValid?: boolean;
  onChangeInput?: (value:string, isValid:boolean, id:string) => void;
  required?: boolean;
  email?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  label?: string;
  errorText?: string;
  id:string;
}

const Input = (props: Props) => {
  const [state, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid ? props.initiallyValid : false,
    touched: false,
  });

  const {onChangeInput, id} = props;

  useEffect(() => {
    if (state.touched && onChangeInput) {
      onChangeInput(state.value, state.isValid, id);
    }
  }, [state, onChangeInput]);

  const textChangeHandler = (text: string) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    dispatch({
      type: INPUT_CHANGE,
      value: text,
      isValid
    })
  };

  const focusHandler = () => {
    dispatch({
      type: INPUT_BLUR
    })
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={styles.input}
        {...props}
        value={state.value}
        onChangeText={textChangeHandler}
        onBlur={focusHandler}
      />
      {!state.isValid && state.touched && <Text style={{color: "red"}}>{props.errorText}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    margin: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
