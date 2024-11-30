"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  selectTotalQuantity,
  setCartState,
} from "../redux/slices/cartSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { setSelectedProductId } from "@/app/redux/slices/productSlice";
import Sort from "../components/sort/Sort";
import Filter from "@/app/components/filters/Filter";
import Link from "next/link";

// Function to save cart to localStorage
const saveCartToLocalStorage = (items, totalQuantity) => {
  try {
    const cartState = { items, totalQuantity };
    localStorage.setItem("cartState", JSON.stringify(cartState));
  } catch (error) {
    console.error("Could not save cart to localStorage", error);
  }
};

// LikeButton component logic
function LikeButton({ productId }) {
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const res = await fetch(`/api/favorites`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure content type is set
          },
          body: JSON.stringify({ productId, action: "check" }), // Pass productId for checking liked status
        });

        if (!res.ok) throw new Error("Failed to fetch liked status.");
        const { isLiked } = await res.json();
        setLiked(isLiked);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch liked status.");
      }
    };

    fetchLikedStatus();
  }, [productId]);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to like products.");
      return;
    }

    try {
      const action = liked ? "remove" : "add";
      const res = await fetch(`/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, action }),
      });

      if (!res.ok) throw new Error("Failed to like/unlike product.");
      setLiked(!liked); // Toggle liked status
    } catch (err) {
      console.error(err);
      setError("Failed to like/unlike product.");
    }
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

// Main ProductsPage component
export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [sortBy, setSortBy] = useState("name"); // Default sort by 'name'
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order 'asc'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages

  const categories = [
    "Monitors",
    "Audio",
    "Computer Accessories",
    "Mobile Phones",
    "Wearables",
    "Cameras",
    "Home Appliances",
    "Kitchen Appliances",
    "Personal Care",
    "Underwear",
    "Accessories",
    "T-Shirts",
    "Pants",
    "Dresses",
    "Footwear",
  ];

  const totalQuantity = useSelector(selectTotalQuantity);
  const cartItems = useSelector((state) => state.cart.items);

  // Handle product click to view product details
  const handleProductClick = (id) => {
    dispatch(setSelectedProductId(id)); // Dispatch the action with the product ID
    router.push(`/products/${id}`); // This will lead to /products/[id] route, which will call the API
  };

  let page = parseInt(searchParams.get("page"), 10) || 1;
  page = !page || page < 1 ? 1 : page;

  const perPage = 9; // Number of products per page

  // Handle filter changes (category)
  const handleFilterChange = (category) => {
    setSelectedCategory(category); // Update selected category
    router.push(
      `/products?page=1&category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
  };

  // Handle sorting changes (sort by and order)
  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    router.push(
      `/products?page=1&category=${selectedCategory}&sortBy=${newSortBy}&sortOrder=${newSortOrder}`
    );
  };

  // Handle add to cart action
  const handleAddToCart = (item) => {
    dispatch(addItemToCart({ ...item, id: item._id }));
  };

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartState");
    if (storedCart) {
      const { items, totalQuantity } = JSON.parse(storedCart);
      dispatch(setCartState({ items, totalQuantity }));
    }
  }, [dispatch]);

  // Save cart state to localStorage whenever cart items or quantity change
  useEffect(() => {
    saveCartToLocalStorage(cartItems, totalQuantity); // Automatically saves when cart changes
  }, [cartItems, totalQuantity]);

  // Fetch products from the API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const categoryQuery = selectedCategory
          ? `&category=${selectedCategory}`
          : "";
        const sortQuery = `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        const res = await fetch(
          `/api/products?page=${page}&limit=${perPage}${categoryQuery}${sortQuery}`
        );
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
  }, [page, selectedCategory, sortBy, sortOrder]); // Fetch products when any of these state variables change

  // Pagination control logic
  const goToPage = (pageNumber) => {
    router.push(
      `products/?page=${pageNumber}&category=${selectedCategory}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Products</h1>
      <Filter categories={categories} onFilterChange={handleFilterChange} />
      <Sort onSortChange={handleSortChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-lg">
            {product.image ? (
              <div onClick={() => handleProductClick(product._id)}>
                <Link href={`/products/${product._id}`}>
                  <Image
                    src={product.image}
                    alt={`Image of ${product.name}`}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </Link>
              </div>
            ) : null}

            <h3 className="text-xl font-semibold mt-2">{product.brand}</h3>
            <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
            <p className="text-lg font-bold">${product.price}</p>
            <p className="mt-2 text-sm">{product.description}</p>
            <h3 className="text-lg font-semibold mt-2"> {product.rating} ☆</h3>

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
