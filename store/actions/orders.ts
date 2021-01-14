import { ThunkAction } from "redux-thunk";
import { RootState } from "../../App";
import Order from "../../models/Order";
import { OrdersState } from "../reducers/orders";

export const PLACE_ORDER = "PLACE_ORDER";
export const FETCH_ORDERS = "FETCH_ORDERS";

interface PlaceOrderAction {
  type: typeof PLACE_ORDER;
  order: Order;
}
interface FetchOrdersAction {
  type: typeof FETCH_ORDERS;
  orders: Order[];
}

export type OrderActionType = PlaceOrderAction | FetchOrdersAction;

export const placeOrder = (
  order: Order
): ThunkAction<void, RootState, unknown, PlaceOrderAction> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const expoToken = getState().auth.expoToken;
      if (token && userId) {
        const dateField = new Date();
        const apiResponse = await fetch(
          `https://shops-app-58c0e-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              date: dateField.toISOString(),
              cartItems: order.cartItems,
              totalAmount: order.totalAmount,
            }),
          }
        );

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          // console.log(`Error api data, ${JSON.stringify(errorData)}`);
          throw new Error("Something went wrong");
        }

        const data = await apiResponse.json();
        console.log(`Expo token ${expoToken}`);
        if (expoToken) {
          try{

          
          const notificationResposne = await fetch(
            `https://exp.host/--/api/v2/push/send`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate",
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                to: expoToken,
                data: {
                  extraData: "Some data",
                },
                title: "Order Placed!",
                body: `You have successfully placed an order of $${order.totalAmount} , Check orders tab for details!`,
              }),
            }
          );
          const notificationData = await notificationResposne.json();
          // console.log(`Send notification response, ${JSON.stringify(notificationData)}`);
          }
          catch(err){
            console.log(`Error sending notification to user ${err.message}`);
          }

        }

        for(const item of order.cartItems){
          if(item.productOwnerToken){
            try{

          
              const notificationResposne = await fetch(
                `https://exp.host/--/api/v2/push/send`,
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Accept-Encoding": "gzip, deflate",
                    "Content-type": "application/json",
                  },
                  body: JSON.stringify({
                    to: item.productOwnerToken,
                    data: {
                      extraData: item,
                    },
                    title: "You Recieved an order!",
                    body: `You have recieved an order of ${item.quantity} ${item.productTitle}(s) worth $${item.sum}`,
                  }),
                }
              );
              const notificationData = await notificationResposne.json();
              // console.log(`Send notification response, ${JSON.stringify(notificationData)}`);
              }
              catch(err){
                console.log(`Error sending notification to seller ${err.message}`);
              }
    
          }
        }

        dispatch({
          type: PLACE_ORDER,
          order: new Order(
            data.name,
            dateField,
            order.cartItems,
            order.totalAmount
          ),
        });
      } else {
        throw new Error("Login Expired please login again");
      }
    } catch (err) {
      throw err;
    }
  };
};

export const fetchOrders = (): ThunkAction<
  void,
  RootState,
  unknown,
  FetchOrdersAction
> => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      if (userId) {
        const apiResponse = await fetch(
          `https://shops-app-58c0e-default-rtdb.firebaseio.com/orders/${userId}.json`
        );

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          // console.log(`Error api data, ${JSON.stringify(errorData)}`);
          throw new Error("Something went wrong");
        }

        const data = await apiResponse.json();

        const loadedOrders: Order[] = [];

        for (const key in data) {
          loadedOrders.push(
            new Order(
              key,
              new Date(data[key].date),
              data[key].cartItems,
              data[key].totalAmount
            )
          );
          // console.log(JSON.stringify(loadedOrders));
        }

        dispatch({
          type: FETCH_ORDERS,
          orders: loadedOrders,
        });
      } else {
        throw new Error("Login Expired please login again");
      }
    } catch (err) {
      throw err;
    }
  };
};
