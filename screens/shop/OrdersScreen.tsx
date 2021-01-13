import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList
} from "react-native";

import {
  NavigationDrawerOptions,
  NavigationDrawerScreenComponent,
  NavigationDrawerScreenProps,
} from "react-navigation-drawer";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../App";
import OrderItem from "../../components/shop/OrderItem";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import COLORS from "../../constants/colors";

import Order from "../../models/Order";
import { fetchOrders } from "../../store/actions/orders";

interface NavigationProps {}

interface ScreenProps {}

interface Props
  extends NavigationDrawerScreenProps<NavigationProps, ScreenProps> {}

const OrdersScreen: NavigationDrawerScreenComponent<
  NavigationProps,
  ScreenProps
> = (props: Props) => {
  const orders: Order[] = useSelector(
    (state: RootState) => state.orders.orders
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null | undefined>();

  const dispatch = useDispatch();

  const loadOrders = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await dispatch(fetchOrders());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadOrders);
    return () => {
      willFocusSub.remove();
    };
  }, [loadOrders]);

  useEffect(() => {
    setIsLoading(true);
    loadOrders().then(()=>{
      setIsLoading(false);
    });
  }, [loadOrders,setIsLoading]);

  if (isLoading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.indicator}>
        <Text>Something went wrong!</Text>
        <Button color={COLORS.primary} title="TRY AGAIN" onPress={loadOrders} />
      </View>
    );
  }

  if (!isLoading && orders.length === 0) {
    return (
      <View style={styles.indicator}>
        <Text>No Orders Placed yet!</Text>
      </View>
    );
  }
  return (
    <FlatList
    onRefresh={loadOrders}
    refreshing={isRefreshing}
      data={orders}
      renderItem={(itemData: ListRenderItemInfo<Order>) => {
        return <OrderItem order={itemData.item} />;
      }}
      style={styles.list}
    />
  );
};

OrdersScreen.navigationOptions = (navigationData) => {
  return {
    headerTitle: "Orders",
    headerLeft: () => {
      return (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
            title="Menu"
            onPress={() => {
              navigationData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      );
    },
  } as NavigationDrawerOptions;
};

export default OrdersScreen;

const styles = StyleSheet.create({
  list: {},
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
