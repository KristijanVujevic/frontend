"use client";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addItemToCart } from "@/app/redux/slices/cartSlice";

export default function ProductPage() {
  const selectedProductId = useSelector(
    (state) => state.product.selectedProductId
  ); // Access selected product ID from Redux state
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleAddToCart = (item) => {
    dispatch(addItemToCart({ ...item, id: item._id }));
  };

  useEffect(() => {
    console.log("selectedProductId:", selectedProductId); // Check the product ID
    if (!selectedProductId) {
      setLoading(false);
      return;
    }

    // Update the API URL to include the product ID
    fetch(`/api/singleProduct/${selectedProductId}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch product.");
        setLoading(false);
      });
  }, [selectedProductId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      {product ? (
        <>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover mb-4 rounded-t-lg"
          />
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-gray-900">
              Price: ${product.price}
            </p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No product found.</p>
      )}
    </div>
  );
}
