import React, { useEffect, useRef } from "react";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import { RootState } from "../App";
import ShopNavigator from "./shopNavigator";

interface Props {}

const NavigationContainer = (props: Props) => {
  const navRef: any = useRef();

  const isAuth = useSelector((state: RootState) => {
    return !!state.auth.token;
  });

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({
          routeName: "Auth",
        })
      );
    }
  }, [isAuth]);

  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;
