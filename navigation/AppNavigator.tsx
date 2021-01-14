import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../App";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, ShopNavigator } from "./MainNavigator";
import StartupScreen from "../screens/StartupScreen";
import * as Notifications from "expo-notifications";

interface Props {}

const AppNavigator = (props: Props) => {
  // const navRef: any = useRef();

  const isAuth = useSelector((state: RootState) => !!state.auth.token);
  const didTryAutoLogin = useSelector(
    (state: RootState) => state.auth.didTryAutoLogin
  );

  // useEffect(() => {
  //   if (!isAuth) {
  //     navRef.current.dispatch(
  //       NavigationActions.navigate({
  //         routeName: "Auth",
  //       })
  //     );
  //   }
  // }, [isAuth]);

  const dispatch = useDispatch();


  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(`recieved notification, ${JSON.stringify(notification)} `);
      }
    );

    const foregroundSub = Notifications.addNotificationResponseReceivedListener(
      (notificationRes) => {
        console.log(
          `recieved notification response, ${JSON.stringify(notificationRes)} `
        );
      }
    );

    return () => {
      subscription.remove();
      foregroundSub.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
