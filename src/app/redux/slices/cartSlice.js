// app/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Save cart to localStorage
const saveCartToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cartState", serializedState);
  } catch (e) {
    console.error("Could not save cart to localStorage", e);
  }
};

// Load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    return serializedState
      ? JSON.parse(serializedState)
      : { items: [], totalQuantity: 0 };
  } catch (e) {
    console.error("Could not load cart from localStorage", e);
    return { items: [], totalQuantity: 0 };
  }
};

// Initial state, loaded from localStorage
const initialState = loadCartFromLocalStorage();

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
      saveCartToLocalStorage(state); // Save to localStorage after each modification
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
      saveCartToLocalStorage(state); // Save to localStorage after each modification
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      saveCartToLocalStorage(state); // Save to localStorage after clearing the cart
    },
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
