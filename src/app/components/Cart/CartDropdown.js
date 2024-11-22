"use client";
import React from "react";
import { useSelector } from "react-redux";

const CartDropdown = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="absolute top-12 right-0 bg-white border shadow-md rounded-lg w-64">
      <h2 className="text-lg font-bold p-4 border-b">Cart</h2>
      <ul className="p-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span className="text-gray-600">{item.name || item.brand}</span>
              <span className="text-red-600">{item.quantity}x</span>
              <span className="text-gray-800 font-semibold">
                ${item.price.toFixed(2)}
              </span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </ul>
      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
