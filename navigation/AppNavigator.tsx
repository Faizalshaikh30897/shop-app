import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../App";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, ShopNavigator } from "./MainNavigator";
import StartupScreen from "../screens/StartupScreen";

interface Props {}

const AppNavigator = (props: Props) => {
  // const navRef: any = useRef();

  const isAuth = useSelector((state: RootState) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state: RootState) => state.auth.didTryAutoLogin);

  // useEffect(() => {
  //   if (!isAuth) {
  //     navRef.current.dispatch(
  //       NavigationActions.navigate({
  //         routeName: "Auth",
  //       })
  //     );
  //   }
  // }, [isAuth]);

  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin &&  <StartupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
