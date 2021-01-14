import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
  FlatList
} from "react-native";
import { ScreenProps } from "react-native-screens";


import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../App";
import CartItem from "../../components/shop/CartItem";
import COLORS from "../../constants/colors";

import CartItemDetail from "../../models/_CartItemDetail";
import { ProductStackParamList } from "../../navigation/MainNavigator";
import { deleteFromCart, emptyCart } from "../../store/actions/cart";
import { placeOrder } from "../../store/actions/orders";


type Props = DrawerScreenProps<ProductStackParamList, 'Cart'>;

const CartScreen = (props: Props) => {
  const { items, totalAmount } = useSelector((state: RootState) => {
    const itemsAsArray: CartItemDetail[] = [];
    state.cart.items.forEach((value, key) => {
      itemsAsArray.push({
        productId: key,
        productPrice: value.productPrice,
        quantity: value.quantity,
        productTitle: value.productTitle,
        sum: value.sum,
      });
    });

    return {
      items: itemsAsArray.sort((a, b) => (a.productId > b.productId ? 1 : -1)),
      totalAmount: state.cart.totalAmount,
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null | undefined>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [
        { text: "OK", style: "default" },
      ]);
    }
  }, [error]);

  const placeOrderHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        placeOrder({
          id: "",
          date: new Date(),
          cartItems: items,
          totalAmount,
        })
      );
      await dispatch(emptyCart());
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };
  if (isLoading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${String(Math.round(Number(totalAmount.toFixed(2)) * 100) / 100)}
          </Text>
        </Text>
        <Button
          color={COLORS.accent}
          title="Order Now"
          onPress={placeOrderHandler}
          disabled={items.length === 0}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData: ListRenderItemInfo<CartItemDetail>) => {
          return (
            <CartItem
              cartItem={itemData.item}
              onDelete={() => {
                dispatch(deleteFromCart(itemData.item.productId));
              }}
              showDelete={true}
            />
          );
        }}
      />
    </View>
  );
};

export const CartScreenNavigationOptions =  (navigationData:any) => {
  return {
    headerTitle: "Your Cart",
  };
};

export default CartScreen;

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    color: COLORS.primary,
  },
  amount: {},
});
