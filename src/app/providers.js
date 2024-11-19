// app/providers.js
"use client";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import MainHeader from "./components/Layout/MainHeader";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <MainHeader />
      {children}
    </Provider>
  );
}
