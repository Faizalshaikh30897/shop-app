import Product from "../../models/Product";
import { DeleteProductAction } from "./product";

export const ADD_TO_CART = "ADD_TO_CART";
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const EMPTY_CART = "EMPTY_CART";

interface AddToCartAction  {
  type: typeof ADD_TO_CART,
  product: Product
}

interface DeleteFromCartAction  {
  type: typeof DELETE_FROM_CART,
  productId: string
}

interface EmptyCartAction  {
  type: typeof EMPTY_CART
}

export type CartActionType = AddToCartAction | DeleteFromCartAction | EmptyCartAction | DeleteProductAction;

export const addToCart = (product: Product): AddToCartAction => {
  return {
    type: ADD_TO_CART,
    product
  }
}

export const deleteFromCart = (productId: string): DeleteFromCartAction => {
  return {
    type: DELETE_FROM_CART,
    productId
  }
}

export const emptyCart = (): EmptyCartAction => {
  return {
    type: EMPTY_CART
  }
}