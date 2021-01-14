import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { LogBox, StyleSheet, Text, View } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { productReducer, ProductState } from "./store/reducers/product";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { cartReducer, CartState } from "./store/reducers/cart";
import { ordersReducer, OrdersState } from "./store/reducers/orders";
import ReduxThunk  from "redux-thunk";
import { authReducer, AuthState } from "./store/reducers/Auth";
import AppNavigator from "./navigation/AppNavigator";

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export interface RootState {
  products: ProductState;
  cart: CartState,
  orders: OrdersState,
  auth: AuthState
}

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={(err: any) => {
          console.log("error while loading fonts", err);
        }}
      />
    );
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({});
