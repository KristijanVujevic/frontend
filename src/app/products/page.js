"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../redux/slices/cartSlice";
import { useSearchParams, useRouter } from "next/navigation";

function LikeButton({ productId }) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    // Add logic to send a request to the server to like/unlike the product
  };

  return (
    <button
      onClick={handleLike}
      className={`mt-2 py-2 px-4 rounded ml-5 ${
        liked ? "bg-red-500" : "bg-gray-300"
      } text-white`}
    >
      {liked ? "Unlike" : "Like"}
    </button>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract the page number from the URL
  let page = parseInt(searchParams.get("page"), 10) || 1;
  page = !page || page < 1 ? 1 : page;

  const perPage = 9; // Number of products per page
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addItemToCart({ ...item, id: item._id }));
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch products based on the current page
        const res = await fetch(`/api/products?page=${page}&limit=${perPage}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const { products, totalCount } = await res.json();
        setProducts(products);
        setTotalPages(Math.ceil(totalCount / perPage)); // Calculate total pages based on product count
        setLoading(false);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products.");
        setLoading(false);
      }
    }

    fetchProducts();
  }, [page]);

  // Handle pagination navigation
  const goToPage = (pageNumber) => {
    router.push(`products/?page=${pageNumber}`);
  };

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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="mx-2 py-2 px-4 rounded bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={`mx-1 py-2 px-4 rounded ${
                pageNumber === page ? "bg-blue-500 text-white" : "bg-gray-300"
              } hover:bg-blue-700`}
            >
              {pageNumber}
            </button>
          )
        )}
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="mx-2 py-2 px-4 rounded bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    </main>
  );
}
