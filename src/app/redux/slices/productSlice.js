// app/redux/slices/productSlice.js
import { createSlice } from "@reduxjs/toolkit";

const selectedProductInitialState = { selectedProductId: null };

const productSlice = createSlice({
  name: "product",
  initialState: selectedProductInitialState,
  reducers: {
    setSelectedProductId: (state, action) => {
      state.selectedProductId = action.payload; // Set the selected product ID
    },
  },
});

export const { setSelectedProductId } = productSlice.actions;
export default productSlice.reducer;
