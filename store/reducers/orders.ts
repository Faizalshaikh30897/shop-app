import Order from "../../models/Order";
import { FETCH_ORDERS, OrderActionType, PLACE_ORDER } from "../actions/orders";
import { CartState } from "./cart";

export interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

export const ordersReducer = (
  state: OrdersState = initialState,
  action: OrderActionType
): OrdersState => {
  
  switch(action.type){
    case PLACE_ORDER:
      return{
        ...state,
        orders: [action.order, ...state.orders]
      }
    case FETCH_ORDERS:
      return {
        ...state,
        orders: action.orders
      }
    default:
      return state;
  }

};
