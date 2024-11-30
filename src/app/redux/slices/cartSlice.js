import { createSlice } from "@reduxjs/toolkit";

// Initial state with safe default values (won't cause hydration warnings)
const initialState = {
  items: [],
  totalQuantity: 0,
};

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
          brand: newItem.brand,
          price: newItem.price,
          description: newItem.description,
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
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },
    calculateTotalQuantity: (state) => {
      state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    },
    setCartState: (state, action) => {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  calculateTotalQuantity,
  clearCart,
  setCartState,
} = cartSlice.actions;
export const selectTotalQuantity = (state) => state.cart.totalQuantity;

export default cartSlice.reducer;
