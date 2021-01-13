import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import {
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CartItemDetail from "../../models/_CartItemDetail";

interface Props {
  onDelete: () => void;
  cartItem: CartItemDetail;
  showDelete: boolean;
}

const CartItem = (props: Props) => {
  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const updateDimensions = () => {
      setScreenHeight(Dimensions.get("window").height);
      setScreenWidth(Dimensions.get("window").width);
    };

    Dimensions.addEventListener("change", updateDimensions);
    return () => {
      Dimensions.removeEventListener("change", updateDimensions);
    };
  });

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.cartItem.quantity} </Text>
        <Text style={styles.title}>
          {props.cartItem.productTitle.length > 15
            ? props.cartItem.productTitle.substring(0, 15) + ".."
            : props.cartItem.productTitle}
        </Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.amount}>${props.cartItem.sum.toFixed(2)}</Text>
        {props.showDelete && (
          <TouchableComponent onPress={props.onDelete} style={styles.delete}>
            <Ionicons
              name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              size={23}
              color="red"
            />
          </TouchableComponent>
        )}
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "open-sans",
    color: "#888",
    fontSize: 16,
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  amount: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  delete: {
    marginLeft: 20,
  },
});
