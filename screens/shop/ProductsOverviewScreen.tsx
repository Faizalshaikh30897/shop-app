import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import {
  DrawerScreenProps,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../App";
import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import COLORS from "../../constants/colors";
import Product from "../../models/product";
import { addToCart } from "../../store/actions/cart";
import { fetchProducts } from "../../store/actions/product";
import { ProductStackParamList } from "../../navigation/MainNavigator";

type Props = DrawerScreenProps<ProductStackParamList, "ProductsOverView">;

const ProductsOverviewScreen = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setIsRefreshing(true);
    setError(undefined);
    try {
      await dispatch(fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [setIsRefreshing, dispatch]);

  useEffect(() => {
    props.navigation.addListener("focus", loadProducts);
    return () => {
      props.navigation.removeListener("focus", loadProducts);
      // willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts, setIsLoading]);

  const availableProducts = useSelector(
    (state: RootState) => state.products.availableProducts
  );

  const addToCartHandler = (product: Product) => {
    dispatch(addToCart(product));
  };

  const selectProductHandler = (product: Product) => {
    props.navigation.navigate({
      name: "Product",
      params: {
        productId: product.id,
        productTitle: product.title,
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.indicator}>
        <Text>Something went wrong!</Text>
        <Button
          color={COLORS.primary}
          title="TRY AGAIN"
          onPress={loadProducts}
        />
      </View>
    );
  }

  if (!isLoading && availableProducts.length === 0) {
    return (
      <View style={styles.indicator}>
        <Text>No Products Found</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={availableProducts}
      renderItem={(itemData: ListRenderItemInfo<Product>) => {
        return (
          <ProductItem
            product={itemData.item}
            onSelect={() => selectProductHandler(itemData.item)}
          >
            <View style={styles.buttonsContainer}>
              <View style={styles.button}>
                <Button
                  title="Details"
                  color={COLORS.primary}
                  onPress={() => selectProductHandler(itemData.item)}
                />
              </View>
              <View style={styles.button}>
                <Button
                  title="To Cart"
                  color={COLORS.primary}
                  onPress={() => addToCartHandler(itemData.item)}
                />
              </View>
            </View>
          </ProductItem>
        );
      }}
      style={styles.list}
    />
  );
};
// DrawerNavigationOptions
export const ProductOverviewScreenNavigationOptions = (navigationData: any) => {
  return {
    headerTitle: "Products",
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
            title="Go to Cart"
            onPress={() => {
              navigationData.navigation.navigate("Cart",{});
            }}
          />
        </HeaderButtons>
      );
    },
    headerLeft: () => {
      return (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
            title="Menu"
            onPress={() => {
              navigationData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

export default ProductsOverviewScreen;

const styles = StyleSheet.create({
  list: {},
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    paddingBottom: 10,
    paddingTop: 5,
    height: "18%",
  },
  button: {},
});
