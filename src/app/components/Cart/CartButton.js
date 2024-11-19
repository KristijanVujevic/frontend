"use client";
import { useEffect } from "react";
import classes from "./CartButton.module.css";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotalQuantity } from "../../redux/slices/cartSlice";

const CartButton = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => {
    handleCalculateTotalQuantity(cartItems);
  }, [cartItems]);

  const handleCalculateTotalQuantity = (cartItems) => {
    dispatch(calculateTotalQuantity(cartItems));
  };

  return (
    <button className={classes.button}>
      <span>My Cart</span>
      <span className={classes.badge}>{totalQuantity}</span>
    </button>
  );
};

export default CartButton;
