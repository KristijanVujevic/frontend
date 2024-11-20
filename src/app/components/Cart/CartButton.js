"use client";
import { useEffect, useState } from "react";
import classes from "./CartButton.module.css";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotalQuantity } from "../../redux/slices/cartSlice";
import CartDropdown from "./CartDropdown";

const CartButton = () => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => {
    handleCalculateTotalQuantity(cartItems);
  }, [cartItems]);

  const handleCalculateTotalQuantity = (cartItems) => {
    dispatch(calculateTotalQuantity(cartItems));
  };

  return (
    <button
      className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>
        Cart
        {isHovered && <CartDropdown />}
      </span>
      <span className={classes.badge}>{totalQuantity}</span>
    </button>
  );
};

export default CartButton;
