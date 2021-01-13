import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Button,
} from "react-native";
import {
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Order from "../../models/Order";
import COLORS from "../../constants/colors";
import CartItem from "./CartItem";
import Card from "../UI/Card";

interface Props {
  order: Order;
}

const OrderItem = (props: Props) => {
  let TouchableComponent = TouchableOpacity;

  const [showDetails, setShowDetails] = useState(false);

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
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.amount}>${props.order.totalAmount.toFixed(2)}</Text>
        <Text style={styles.date}>
          {props.order?.date?.toLocaleDateString("en-EN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Button
        color={COLORS.primary}
        title={showDetails? "Hide Details" :"Show Details"}
        onPress={() => {
          setShowDetails((prev) => !prev);
        }}
      />
      {showDetails && (
        <View style={styles.detail}>
          {props.order.cartItems.map((item) => {
            return (
              <CartItem
                key={item.productId}
                cartItem={item}
                onDelete={() => {}}
                showDelete={false}
              />
            );
          })}
        </View>
      )}
    </Card>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  orderItem: {
    margin: 10,
    padding: 10,
    alignItems: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  amount: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888",
  },
  detail: {
    width: "100%",
  },
});
