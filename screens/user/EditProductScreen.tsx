import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  LogBox,
  ActivityIndicator,
  TouchableWithoutFeedback
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../App";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import Input from "../../components/UI/Input";
import COLORS from "../../constants/colors";

import Product from "../../models/Product";
import { UserStackParamList } from "../../navigation/MainNavigator";
import { addProduct, editProduct } from "../../store/actions/product";

type ProfileScreenRouteProp = RouteProp<UserStackParamList, "EditProduct">;

type ProfileScreenNavigationProp = StackNavigationProp<
  UserStackParamList,
  "EditProduct"
>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

interface InputValues {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
}

interface InputValidities {
  title: boolean;
  description: boolean;
  imageUrl: boolean;
  price: boolean;
}

type ProductFormState = {
  inputValues: InputValues;
  inputValidities: InputValidities;
  isFormValid: boolean;
};

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

type ProductFormAction = {
  type: typeof FORM_INPUT_UPDATE;
  value: string;
  isValid: boolean;
  input: string;
};

const formReducer = (
  state: ProductFormState,
  action: ProductFormAction
): ProductFormState => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedStateValidity = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      const isFormNowValid =
        updatedStateValidity.title &&
        updatedStateValidity.description &&
        updatedStateValidity.imageUrl &&
        updatedStateValidity.price;
      return {
        ...state,
        inputValues: {
          ...state.inputValues,
          [action.input]: action.value,
        },
        inputValidities:updatedStateValidity,
        isFormValid:isFormNowValid
      };
    default:
      return state;
  }
};

const EditProductScreen = (props: Props) => {
  const prodId = props.route.params?.productId;

  const editedProduct: Product = useSelector((state: RootState) => {
    return state.products.userProducts.find((prod) => prod.id === prodId);
  })!;

  const [state, formStateDispatch] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      description: editedProduct ? editedProduct.description : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      description: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    isFormValid: editedProduct ? true : false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null | undefined>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [
        { text: "OK", style: "default" },
      ]);
    }
  }, [error]);

  const addUpdateProductHandler = useCallback(async () => {
    if (!state.isFormValid) {
      console.log("state invalid ", JSON.stringify(state));
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
    try {
      if (editedProduct) {
        await dispatch(
          editProduct(
            new Product(
              editedProduct.id,
              editedProduct.ownerId,
              state.inputValues.title,
              state.inputValues.imageUrl,
              state.inputValues.description,
              editedProduct.price
            )
          )
        );
      } else {
        await dispatch(
          addProduct(
            new Product(
              "",
              "",
              state.inputValues.title,
              state.inputValues.imageUrl,
              state.inputValues.description,
              Number(state.inputValues.price)
            )
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
      
    }

    setIsLoading(false);
  }, [dispatch, editedProduct, state]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              iconName={
                Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
              }
              title="Save"
              onPress={addUpdateProductHandler}
            />
          </HeaderButtons>
        );
      },
    })
    // props.navigation.setParams({
    //   saveProduct: addUpdateProductHandler,
    // });
    return () => {
      return;
    };
  }, [addUpdateProductHandler]);

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

  if (isLoading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <ScrollView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.form}>
            <Input
              id="title"
              autoCapitalize="sentences"
              autoCorrect
              returnKeyType="next"
              label="Title"
              errorText="Please enter a title"
              initialValue={state.inputValues.title}
              onChangeInput={inputChangeHandler}
              initiallyValid={state.inputValidities.title}
              required
            />
            <Input
              id="description"
              label="Description"
              errorText="Please enter a Description"
              initialValue={state.inputValues.description}
              onChangeInput={inputChangeHandler}
              initiallyValid={state.inputValidities.description}
              multiline
              numberOfLines={3}
              required
            />
            <Input
              id="imageUrl"
              label="Image URL"
              errorText="Please enter an Image URL"
              initialValue={state.inputValues.imageUrl}
              onChangeInput={inputChangeHandler}
              initiallyValid={state.inputValidities.imageUrl}
              required
            />

            {editedProduct ? null : (
              <Input
                id="price"
                keyboardType="decimal-pad"
                label="Price"
                errorText="Please enter a valid Price"
                initialValue={state.inputValues.price}
                onChangeInput={inputChangeHandler}
                initiallyValid={state.inputValidities.price}
                required
                min={0}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const EditProductScreenNavigationOptions = (navigationData: any) => {
  return {
    headerTitle: navigationData.route.params?.productId
      ? "Edit Product"
      : "Add Product",
   
  };
};

export default EditProductScreen;

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
