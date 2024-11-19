"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../redux/slices/cartSlice";
function LikeButton({ productId }) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    // Add logic to send a request to the server to like/unlike the product
  };

  return (
    <button
      onClick={handleLike}
      className={`mt-2 py-2 px-4 rounded ${
        liked ? "bg-red-500" : "bg-gray-300"
      } text-white`}
    >
      {liked ? "Unlike" : "Like"}
    </button>
  );
}

export default function ProductsPage() {
  const dispatch = useDispatch();
  const handleAddToCart = (item) => {
    dispatch(addItemToCart({ ...item, id: item._id }));
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products.");
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-lg">
            {product.image ? (
              <Image
                src={product.image}
                alt={`Image of ${product.name}`}
                width={600}
                height={400}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            ) : null}
            <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
            <h3 className="text-xl font-semibold mt-2">{product.brand}</h3>
            <p className="text-lg font-bold">${product.price}</p>
            <p className="mt-2 text-sm">{product.description}</p>

            <button
              onClick={() => handleAddToCart(product)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
            <LikeButton productId={product._id} />
          </div>
        ))}
      </div>
    </main>
  );
}
