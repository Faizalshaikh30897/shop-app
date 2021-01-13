import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  style?: any;
  children?: any;
}

const Card = (props: Props) => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
  },
});
