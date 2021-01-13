import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

const CustomHeaderButton = (props: any) => {
  return (
    <HeaderButton
      IconComponent={Ionicons}
      iconSize={23}
      color={Platform.OS == "android" ? "white" : COLORS.primary}
      {...props}
    />
  );
};

export default CustomHeaderButton;

const styles = StyleSheet.create({});
