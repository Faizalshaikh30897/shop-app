
import CartItem from "../../models/CartItem";
import {
  ADD_TO_CART,
  CartActionType,
  DELETE_FROM_CART,
  EMPTY_CART,
} from "../actions/cart";
import { DELETE_PRODUCT } from "../actions/product";

export interface CartState {
  items: Map<string, CartItem>;
  totalAmount: number;
}

const initialState: CartState = {
  items: new Map<string, CartItem>(),
  totalAmount: 0,
};

export const cartReducer = (
  state: CartState = initialState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case ADD_TO_CART:
      const productToAdd = action.product;
      const oldItem = state.items.get(productToAdd.id);
      const items: Map<string, CartItem> = new Map<string, CartItem>(
        state.items
      );
      const totalAmount = state.totalAmount + productToAdd.price;
      if (oldItem) {
        items.set(
          productToAdd.id,
          new CartItem(
            oldItem.quantity + 1,
            productToAdd.title,
            productToAdd.price,
            oldItem.sum + productToAdd.price,
            productToAdd.ownerToken,
          )
        );
      } else {
        items.set(
          productToAdd.id,
          new CartItem(
            1,
            productToAdd.title,
            productToAdd.price,
            productToAdd.price,
            productToAdd.ownerToken,
          )
        );
      }
      return {
        ...state,
        items,
        totalAmount,
      };

    case DELETE_FROM_CART:
      const productToDelete = state.items.get(action.productId);
      if (productToDelete) {
        const newItems: Map<string, CartItem> = new Map<string, CartItem>(
          state.items
        );
        const newAmount = state.totalAmount - productToDelete.productPrice;

        if (productToDelete.quantity === 1) {
          newItems.delete(action.productId);
        } else {
          newItems.set(action.productId, {
            ...productToDelete,
            quantity: productToDelete.quantity - 1,
            sum: productToDelete.sum - productToDelete.productPrice,
          });
        }

        return {
          ...state,
          items: newItems,
          totalAmount: newAmount,
        };
      } else return state;
    case EMPTY_CART:
      return {
        ...state,
        items: new Map<string, CartItem>(),
        totalAmount: 0,
      };

    case DELETE_PRODUCT:
      const productToRemove = state.items.get(action.productId);
      if (productToRemove) {
        const newItems: Map<string, CartItem> = new Map<string, CartItem>(
          state.items
        );
        const newAmount =
          state.totalAmount -
          productToRemove.productPrice * productToRemove.quantity;

        newItems.delete(action.productId);

        return {
          ...state,
          items: newItems,
          totalAmount: newAmount,
        };
      } else return state;
    default:
      return state;
  }
};
