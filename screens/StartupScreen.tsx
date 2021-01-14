import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";

import { useDispatch } from "react-redux";
import COLORS from "../constants/colors";
import { authenticate, setDidTryAL } from "../store/actions/Auth";
import { setExpoToken } from "./../store/actions/Auth";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Alert } from "react-native";

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
      const expiresIn = new Date(expiryDate).getTime() - new Date().getTime();

      dispatch(authenticate(token, userId, expiresIn));

      // props.navigation.navigate({
      //   routeName: "Shop",
      // });
    };

    startupCheck();
  }, [dispatch]);

  useEffect(() => {
    const expoTokenCheck = async () => {
      const expoTokenData = await AsyncStorage.getItem("expoToken");
      if (expoTokenData && JSON.parse(expoTokenData).expoToken) {
        console.log(`expoToken exists in storage`);
        dispatch(setExpoToken(JSON.parse(expoTokenData).expoToken));
      } else {
        Permissions.getAsync(Permissions.NOTIFICATIONS)
          .then((status) => {
            if (!status.granted) {
              return Permissions.askAsync(Permissions.NOTIFICATIONS);
            }
            return status;
          })
          .then((status) => {
          
            if (
              !status.granted &&
              status.status !== Permissions.PermissionStatus.UNDETERMINED
            ) {
              throw new Error("Permission not Granted");
            } else if (status.granted) {
              return status;
            } else {
              return null;
            }
          })
          .then((status) => {
            if (status) {
              return Notifications.getExpoPushTokenAsync();
            }
            return null;
          })
          .then((response) => {
            if (response) {
              console.log(response);
              const token = response.data;
              dispatch(setExpoToken(token));
            }
          })
          .catch((err) => {
            if (err.message === "Permission not Granted") {
              Alert.alert(
                "No Notification Access!",
                "Permission for showing notification not granted, please go to Settings and grant Notification permission",
                [{ text: "OK", style: "default" }]
              );
            }
          });
      }
    };
    expoTokenCheck();
  }, [dispatch, setExpoToken]);

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
