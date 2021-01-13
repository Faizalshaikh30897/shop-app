import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
  Platform,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from "react-navigation-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../App";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import COLORS from "../../constants/colors";
import Product from "../../models/Product";
import { addToCart } from "../../store/actions/cart";
import { productReducer } from "../../store/reducers/product";

interface NavigationProps {
  productId: string;
  productTitle: string;
}

interface ScreenProps {}
interface Props
  extends NavigationStackScreenProps<NavigationProps, ScreenProps> {}

const ProductDetailsScreen: NavigationStackScreenComponent<
  NavigationProps,
  ScreenProps
> = (props: Props) => {
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

  const product: Product = useSelector((state: RootState) => {
    return state.products.availableProducts.find(
      (productItem) => productItem.id === props.navigation.getParam("productId")
    );
  })!;

  const dispatch = useDispatch();

  const addToCartHandler = (product: Product) => {
    dispatch(addToCart(product));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={{
            uri: product.imageUrl,
          }}
          style={{ ...styles.image, height: screenHeight * 0.5 }}
        />
        <View style={styles.actions}>
          <Button
            color={COLORS.primary}
            title="Add to Cart"
            onPress={() => addToCartHandler(product)}
          />
        </View>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
};

ProductDetailsScreen.navigationOptions = (navigationData) => {
  return {
    headerTitle: navigationData.navigation.getParam("productTitle"),
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName={Platform.OS === "android" ? "md-cart" :"ios-cart"}
            title="Go to Cart"
            onPress={() => {
              navigationData.navigation.navigate({
                routeName: "Cart",
              });
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {},

  image: {
    width: "100%",
  },

  description: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: "center",
    marginHorizontal: 10,
    fontFamily: "open-sans",
  },
  price: {
    fontSize: 18,
    marginVertical: 8,
    color: "#888",
    textAlign: "center",
    fontFamily: "open-sans-bold",
  },
  actions: {
    alignItems: "center",
    marginVertical: 10,
  },
});
