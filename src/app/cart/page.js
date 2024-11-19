"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromCart } from "../redux/slices/cartSlice";
const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  //redux action to remove item from cart
  const handleRemoveFromCart = (id) => {
    dispatch(removeItemFromCart(id));
  };
  //redux action to empty the cart
  const handleClearCart = () => {
    cartItems.forEach((item) => dispatch(removeItemFromCart(item.id)));
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-600">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="w-40 bg-red-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-right ">
                  <p className="text-lg font-semibold text-gray-600">
                    ${item.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <h2 className="text-xl font-bold text-gray-600">Total</h2>
              <p className="text-xl font-bold text-gray-600">
                ${total.toFixed(2)}
              </p>

              <button
                onClick={handleClearCart}
                className="w-40 bg-red-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Clear cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;