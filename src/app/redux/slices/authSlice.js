import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Initial state
const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  token: null, // You can store the token here if needed
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token } = action.payload;
      const decodedToken = jwtDecode(token);

      // Store the token in localStorage if needed
      localStorage.setItem("token", token);

      state.isLoggedIn = true;
      state.isAdmin = decodedToken.role === "admin";
      state.token = token;
    },
    logout: (state) => {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("cartState");

      state.isLoggedIn = false;
      state.isAdmin = false;
      state.token = null;
    },
    checkAuthStatus: (state) => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        state.isLoggedIn = true;
        state.isAdmin = decodedToken.role === "admin";
        state.token = token;
      } else {
        state.isLoggedIn = false;
        state.isAdmin = false;
        state.token = null;
      }
    },
  },
});

export const { login, logout, checkAuthStatus } = authSlice.actions;
export default authSlice.reducer;
