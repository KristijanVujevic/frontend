"use client";
import { useEffect } from "react";
import classes from "./CartButton.module.css";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotalQuantity } from "../../redux/slices/cartSlice";
import CartDropdown from "./CartDropdown";

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
    <button>
      <span>
        <CartDropdown />
      </span>
      <span className={classes.badge}>{totalQuantity}</span>
    </button>
  );
};

export default CartButton;
