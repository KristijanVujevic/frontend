// app/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice"; // Only cartReducer should come from cartSlice
import productReducer from "./slices/productSlice"; // Import the correct productReducer
import authReducer from "./slices/authSlice"; // Import the authReducer
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer, // Ensure the product reducer is correctly referenced
    auth: authReducer,
  },
});

export default store;
