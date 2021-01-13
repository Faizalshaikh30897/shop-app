import { ThunkAction } from "redux-thunk";
import { RootState } from "../../App";
import Product from "../../models/Product";
import { ProductState } from "../reducers/product";

export const ADD_PRODUCT = "ADD_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const EDIT_PRODUCT = "EDIT_PRODUCT";
export const FETCH_PRODUCTS = "FETCH_PRODUCTS";

interface AddProductAction {
  type: typeof ADD_PRODUCT;
  product: Product;
}

interface EditProductAction {
  type: typeof EDIT_PRODUCT;
  product: Product;
}

export interface DeleteProductAction {
  type: typeof DELETE_PRODUCT;
  productId: string;
}

export interface FetchProductsAction {
  type: typeof FETCH_PRODUCTS;
  products: Product[];
  userProducts: Product[]
}

export type ProductActionType =
  | DeleteProductAction
  | AddProductAction
  | EditProductAction
  | FetchProductsAction;

export const addProduct = (
  product: Product
): ThunkAction<void, RootState, unknown, AddProductAction> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      if (userId && token) {
        const apiResponse = await fetch(
          `https://shops-app-58c0e-default-rtdb.firebaseio.com/products.json?auth=${token}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              title: product.title,
              description: product.description,
              imageUrl: product.imageUrl,
              price: product.price,
              ownerId: userId
            }),
          }
        );

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          console.log(`Error api data, ${JSON.stringify(errorData)}`);
          throw new Error("Something went wrong");
        }

        const data = await apiResponse.json();

        dispatch({
          type: ADD_PRODUCT,
          product: new Product(
            data.name,
            userId,
            product.title,
            product.imageUrl,
            product.description,
            product.price
          ),
        });
      } else {
        throw new Error("Login expired Please login again");
      }
    } catch (err) {
      throw err;
    }
  };
};

export const editProduct = (
  product: Product
): ThunkAction<void, RootState, unknown, EditProductAction> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      if (token && userId) {
        const apiResponse = await fetch(
          `https://shops-app-58c0e-default-rtdb.firebaseio.com/products/${product.id}.json?auth=${token}`,
          {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              title: product.title,
              description: product.description,
              imageUrl: product.imageUrl,
            }),
          }
        );

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          throw new Error("Something went wrong");
        }

        const data = await apiResponse.json();

        dispatch({
          type: EDIT_PRODUCT,
          product: new Product(
            product.id,
            userId,
            product.title,
            product.imageUrl,
            product.description,
            product.price
          ),
        });
      } else {
        throw new Error("Login Expired please login agian");
      }
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = (
  productId: string
): ThunkAction<void, RootState, unknown, DeleteProductAction> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      if (token) {
        const apiResponse = await fetch(
          `https://shops-app-58c0e-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
          {
            method: "DELETE",
          }
        );

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          console.log(`Error api data, ${JSON.stringify(errorData)}`);
          throw new Error("Something went wrong");
        }

        const data = await apiResponse.json();

        dispatch({
          type: DELETE_PRODUCT,
          productId,
        });
      } else {
        throw new Error("Login Expired please login again");
      }
    } catch (err) {
      throw err;
    }
  };
};

export const fetchProducts = (): ThunkAction<
  void,
  RootState,
  unknown,
  FetchProductsAction
> => {
  return async (dispatch, getState) => {
    try {

      const apiResponse = await fetch(
        "https://shops-app-58c0e-default-rtdb.firebaseio.com/products.json"
      );

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.log(`Error api data, ${JSON.stringify(errorData)}`);
        throw new Error("Something went wrong!");
      }

      const data = await apiResponse.json();

      console.log(`get response ${JSON.stringify(data)}`);

      const loadedProducts: Product[] = [];

      for (const key in data) {
        loadedProducts.push(
          new Product(
            key,
            data[key].ownerId,
            data[key].title,
            data[key].imageUrl,
            data[key].description,
            data[key].price
          )
        );
      }
      let userProducts : Product[] = [];
      const userId = getState().auth.userId;
      if(userId){
        userProducts = loadedProducts.filter(prod => prod.ownerId === userId);
      }
      dispatch({
        type: FETCH_PRODUCTS,
        products: loadedProducts,
        userProducts
      });
    } catch (err) {
      throw err;
    }
  };
};
