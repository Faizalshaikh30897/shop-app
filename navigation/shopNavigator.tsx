import React from "react";
import { Button, Platform, SafeAreaView, View } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import COLORS from "../constants/colors";
import ProductDetailsScreen from "../screens/shop/ProductDetailsScreen";
import { createDrawerNavigator, DrawerNavigatorItems } from "react-navigation-drawer";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import { Ionicons } from "@expo/vector-icons";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import StartupScreen from "../screens/StartupScreen";
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

const productNavigator = createStackNavigator(
  {
    ProductsOverView: {
      screen: ProductsOverviewScreen as any,
    },
    Product: {
      screen: ProductDetailsScreen as any,
    },
    Cart: {
      screen: CartScreen as any,
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const ordersNavigator = createStackNavigator(
  {
    Orders: {
      screen: OrdersScreen as any,
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const userNavigator = createStackNavigator(
  {
    UserProducts: {
      screen: UserProductsScreen as any,
    },
    EditProduct: {
      screen: EditProductScreen as any,
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const mainDrawerNavigator = createDrawerNavigator(
  {
    Products: {
      screen: productNavigator,
      navigationOptions: {
        drawerIcon: (drawerConfig: any) => {
          return (
            <Ionicons
              iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              color={drawerConfig.tintColor}
              iconSize={23}
            />
          );
        },
      },
    },
    Orders: {
      screen: ordersNavigator,
      navigationOptions: {
        drawerIcon: (drawerConfig: any) => {
          return (
            <Ionicons
              iconName={Platform.OS === "android" ? "md-list" : "ios-list"}
              color={drawerConfig.tintColor}
              iconSize={23}
            />
          );
        },
      },
    },
    UserProducts: {
      screen: userNavigator,
      navigationOptions: {
        drawerLabel: "Your Products",
        drawerIcon: (drawerConfig: any) => {
          return (
            <Ionicons
              iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
              color={drawerConfig.tintColor}
              iconSize={20}
            />
          );
        },
      },
    },
  },
  {
    contentOptions:{
      activeTintColor: COLORS.primary
    },
    contentComponent: (props)=>{
      const dispatch = useDispatch();
      return (
        <View style={{flex: 1, paddingVertical: 20}}>
          {/* forceInset={{top:'always', horizontal: "never"}} */}
          <SafeAreaView >
            <DrawerNavigatorItems {...props} />
            <Button title="Logout" onPress={()=>{
                dispatch(logout());
            }}/>
          </SafeAreaView>
        </View>
      );
    }
  }
);

const authNavigator = createStackNavigator({
  Auth: AuthScreen as any

},{
  defaultNavigationOptions: defaultNavOptions
})

const mainNavigator = createSwitchNavigator({
  Startup: {
    screen: StartupScreen
  },
  Auth:{
    screen : authNavigator
  },
  Shop:{
    screen: mainDrawerNavigator
  }
})

export default createAppContainer(mainNavigator);
