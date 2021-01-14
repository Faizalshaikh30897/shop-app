import React from "react";
import { Button, Platform, SafeAreaView, View } from "react-native";
import COLORS from "../constants/colors";
import { createStackNavigator } from "@react-navigation/stack";
import ProductsOverviewScreen, {
  ProductOverviewScreenNavigationOptions,
} from "./../screens/shop/ProductsOverviewScreen";
import CartScreen, {
  CartScreenNavigationOptions,
} from "../screens/shop/CartScreen";
import OrdersScreen, {
  OrdersScreenNavigationOptions,
} from "../screens/shop/OrdersScreen";
import ProductDetailsScreen, {
  ProductDetailsScreenNavigationOptions,
} from "../screens/shop/ProductDetailsScreen";
import UserProductsScreen, { UserProductsScreenNavigationOptions } from "../screens/user/UserProductsScreen";
import EditProductScreen, { EditProductScreenNavigationOptions } from "../screens/user/EditProductScreen";
import AuthScreen, {
  AuthScreenNavigationOptions,
} from "../screens/user/AuthScreen";
import { createDrawerNavigator, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { logout } from "../store/actions/Auth";

const defaultNavOptions = {
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? COLORS.primary : "",
  },
  headerTintColor: Platform.OS === "android" ? "white" : COLORS.primary,
};

const ProductStackNavigator = createStackNavigator();

export type ProductStackParamList = {
  ProductsOverView: {};
  Product: {
    productId: string;
    productTitle: string;
  };
  Cart: {};
};

const ProductsNavigator = () => {
  return (
    <ProductStackNavigator.Navigator
      initialRouteName="ProuctsOverView"
      screenOptions={defaultNavOptions}
    >
      <ProductStackNavigator.Screen
        name="ProductsOverView"
        component={ProductsOverviewScreen}
        options={ProductOverviewScreenNavigationOptions}
      />
      <ProductStackNavigator.Screen
        name="Product"
        component={ProductDetailsScreen}
        options={ProductDetailsScreenNavigationOptions}
      />
      <ProductStackNavigator.Screen
        name="Cart"
        component={CartScreen}
        options={CartScreenNavigationOptions}
      />
    </ProductStackNavigator.Navigator>
  );
};

const OrderStackNavigator = createStackNavigator();
export type OrderStackParamList = {
  Orders: {};
};

const OrdersNavigator = () => {
  return (
    <OrderStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <OrderStackNavigator.Screen
        name="Orders"
        component={OrdersScreen}
        options={OrdersScreenNavigationOptions}
      />
    </OrderStackNavigator.Navigator>
  );
};

const UserStackNavigator = createStackNavigator();
export type UserStackParamList = {
  UserProducts: {};
  EditProduct: { productId?: string; saveProduct?: () => void };
};

const UserNavigator = () => {
  return (
    <UserStackNavigator.Navigator
      screenOptions={defaultNavOptions}
      initialRouteName="UserProducts"
    >
      <UserStackNavigator.Screen
        name="UserProducts"
        component={UserProductsScreen}
        options={UserProductsScreenNavigationOptions}
      />
      <UserStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={EditProductScreenNavigationOptions}
      />
    </UserStackNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();

export type AuthStackParamList = {
  Auth: {};
};

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={defaultNavOptions}
      initialRouteName="Auth"
    >
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={AuthScreenNavigationOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
    const dispatch = useDispatch();
  return (
    <ShopDrawerNavigator.Navigator
      drawerContent={(props) => {
        
        return (
          <View style={{ flex: 1, paddingVertical: 25 }}>
            {/* forceInset={{top:'always', horizontal: "never"}} */}
            <SafeAreaView>
              <DrawerItemList {...props} />
              <Button
                color={COLORS.accent}
                title="Logout"
                onPress={() => {
                  dispatch(logout());
                }}
              />
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: COLORS.primary,
      }}
    >
      <ShopDrawerNavigator.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: (props: any) => {
            return (
              <Ionicons
                iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
                color={props.color}
                iconSize={23}
              />
            );
          },
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          drawerIcon: (props: any) => {
            return (
              <Ionicons
                iconName={Platform.OS === "android" ? "md-list" : "ios-list"}
                color={props.color}
                iconSize={23}
              />
            );
          },
        }}
      />
      <ShopDrawerNavigator.Screen
        name="UserProducts"
        component={UserNavigator}
        options={{
          drawerLabel: "Your Products",
          drawerIcon: (props: any) => {
            return (
              <Ionicons
                iconName={
                  Platform.OS === "android" ? "md-create" : "ios-create"
                }
                color={props.color}
                iconSize={20}
              />
            );
          },
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};

