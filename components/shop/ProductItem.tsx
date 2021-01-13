import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
  Platform,
} from "react-native";
import {
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native-gesture-handler";
import COLORS from "../../constants/colors";
import Product from "../../models/Product";
import Card from "../UI/Card";

interface Props {
  product: Product;
  onSelect: () => void;
  children?: any;
}

const ProductItem = (props: Props) => {
  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

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

  return (
    <Card
      style={{
        ...styles.product,
        height: screenHeight * 0.4,
        marginVertical: screenHeight / 50,
        marginHorizontal: screenWidth / 30,
      }}
    >
      <View
        style={{
          height: "82%",
          width: "100%",
        }}
      >
        <TouchableComponent
          onPress={props.onSelect}
          style={styles.touchableContainer}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: props.product.imageUrl,
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{props.product.title}</Text>
            <Text style={styles.price}>${props.product.price.toFixed(2)}</Text>
          </View>
        </TouchableComponent>
      </View>
     
        {props.children}
      
    </Card>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  product: {
   
  },
  touchableContainer: {
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    height: "78%",
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  details: {
    alignItems: "center",
    height: "22%",
    padding: 2,
  },
  title: {
    fontSize: 16,
    marginVertical: 4,
    fontFamily: "open-sans-bold"
  },
  price: {
    fontSize: 14,
    color: "#888",
    fontFamily: "open-sans"
  },

});
