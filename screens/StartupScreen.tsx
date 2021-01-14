import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";

import { useDispatch } from "react-redux";
import COLORS from "../constants/colors";
import { authenticate, setDidTryAL } from "../store/actions/Auth";

type Props = {};

const StartupScreen = (props: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const startupCheck = async () => {
      const data = await AsyncStorage.getItem("userData");
      if (!data) {
        // props.navigation.navigate({
        //   routeName: "Auth",
        // });
        dispatch(setDidTryAL());
        return;
      }
      const { userId, token, expiryDate } = JSON.parse(data);
      if (new Date(expiryDate) <= new Date() || !token || !userId) {
        // props.navigation.navigate({
        //   routeName: "Auth",
        // });
        dispatch(setDidTryAL());
        return;
      }
      const expiresIn = new Date(expiryDate).getTime() - new Date().getTime()

      dispatch(authenticate(token,userId,expiresIn));
      // props.navigation.navigate({
      //   routeName: "Shop",
      // });
    };

    startupCheck();
  }, [dispatch]);

  return (
    <View style={styles.indicator}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default StartupScreen;

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
