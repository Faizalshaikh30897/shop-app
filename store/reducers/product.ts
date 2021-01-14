import Product from "../../models/Product";
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  EDIT_PRODUCT,
  FETCH_PRODUCTS,
  ProductActionType,
} from "../actions/product";

export interface ProductState {
  availableProducts: Product[];
  userProducts: Product[];
}

const initialState: ProductState = {
  availableProducts: [],
  userProducts: [],
};

export const productReducer = (
  state: ProductState = initialState,
  action: ProductActionType
): ProductState => {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        ...state,
        availableProducts: action.products,
        userProducts: action.userProducts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        availableProducts: state.availableProducts.filter(
          (prod) => prod.id !== action.productId
        ),
        userProducts: state.userProducts.filter(
          (prod) => prod.id !== action.productId
        ),
      };

    case ADD_PRODUCT:
      const checkExists = state.availableProducts.find(
        (prod) => action.product.id === prod.id
      );
      if (checkExists) {
        if (state.userProducts.find((prod) => prod.id === action.product.id)) {
          return {
            ...state,
            availableProducts: state.availableProducts.map((prod) => {
              if (prod.id === action.product.id) {
                return action.product;
              } else {
                return prod;
              }
            }),
            userProducts: state.userProducts.map((prod) => {
              if (prod.id === action.product.id) {
                return action.product;
              } else {
                return prod;
              }
            }),
          };
        } else {
          return state;
        }
      } else {
        return {
          ...state,
          availableProducts: [...state.availableProducts, action.product],
          userProducts: [...state.userProducts, action.product],
        };
      }

    case EDIT_PRODUCT:
      const checkAvExists = state.availableProducts.find(
        (prod) => action.product.id === prod.id
      );

      if (checkAvExists) {
        if (state.userProducts.find((prod) => prod.id === action.product.id)) {
          return {
            ...state,
            availableProducts: state.availableProducts.map((prod) => {
              if (prod.id === action.product.id) {
                return action.product;
              } else {
                return prod;
              }
            }),
            userProducts: state.userProducts.map((prod) => {
              if (prod.id === action.product.id) {
                return action.product;
              } else {
                return prod;
              }
            }),
          };
        } else {
          return state;
        }
      } else {
        return state;
      }

    default:
      return state;
  }
};
