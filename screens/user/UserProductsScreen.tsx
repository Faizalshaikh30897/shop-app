import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  View,
  Text,
  FlatList,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../App";
import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import COLORS from "../../constants/colors";
import Product from "../../models/Product";
import { UserStackParamList } from "../../navigation/MainNavigator";
import { deleteProduct, fetchProducts } from "../../store/actions/product";

type Props = DrawerScreenProps<UserStackParamList, "UserProducts">;

const UserProductsScreen = (props: Props) => {
  const userProducts = useSelector(
    (state: RootState) => state.products.userProducts
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined | null>();

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
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
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts, setIsLoading]);

  const selectProducHandler = (product: Product) => {
    props.navigation.navigate("EditProduct", {
      productId: product.id,
    });
  };

  const deleteProductHanlder = (product: Product) => {
    Alert.alert(
      "Are you Sure?",
      "Do you really want to delete this product, This CANNOT be reverted!",
      [
        {
          text: "NO",
          style: "default",
          onPress: () => {
            console.log("Dont delete");
          },
        },
        {
          text: "YES",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await dispatch(deleteProduct(product.id));
            } catch (err) {
              Alert.alert("An error occured!", err.message, [
                { text: "OK", style: "default" },
              ]);
            }
            setIsLoading(false);
          },
        },
      ]
    );
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

  if (!isLoading && userProducts.length === 0) {
    return (
      <View style={styles.indicator}>
        <Text>You have not added any products</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={userProducts}
      renderItem={(itemData: ListRenderItemInfo<Product>) => (
        <ProductItem
          product={itemData.item}
          onSelect={() => selectProducHandler(itemData.item)}
        >
          <View style={styles.buttonsContainer}>
            <View style={styles.button}>
              <Button
                title="Edit"
                color={COLORS.primary}
                onPress={() => selectProducHandler(itemData.item)}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Delete"
                color={COLORS.primary}
                onPress={() => {
                  deleteProductHanlder(itemData.item);
                }}
              />
            </View>
          </View>
        </ProductItem>
      )}
    />
  );
};

export const UserProductsScreenNavigationOptions = (navigationData: any) => {
  return {
    headerTitle: "Your Products",
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
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
            title="Add"
            onPress={() => {
              navigationData.navigation.navigate("EditProduct",{});
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

export default UserProductsScreen;

const styles = StyleSheet.create({
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
