// app/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
};
//first slice which will be used in cart page (remove,add items to cart)
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
        });
        state.totalQuantity++;
      } else {
        existingItem.quantity++;
      }
    },
    removeItemFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        state.totalQuantity--;
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
        }
      }
    },
    //add action to clear cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },
    //add action to calculate totalQuantity
    calculateTotalQuantity: (state) => {
      state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  calculateTotalQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
