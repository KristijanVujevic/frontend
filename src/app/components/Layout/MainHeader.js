import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartButton from "../Cart/CartButton";
import Link from "next/link";

const MainHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially set to `null` to show loading state
  const router = useRouter();

  // Check if the user is logged in
  useEffect(() => {
    // This function will run asynchronously on component mount
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token"); // Check if the token exists
      if (token) {
        setIsLoggedIn(true); // Set logged-in state to true if token exists
      } else {
        setIsLoggedIn(false); // Set logged-in state to false if token doesn't exist
      }
    };

    // Run the login check
    checkLoginStatus();
  }, []); // Empty dependency array to run only once after initial mount

  // Logout function
  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("cartState");

    // Redirect to the sign-in page
    router.push("/auth/signin");

    // Set logged-in state to false
    setIsLoggedIn(false);
  };

  // Show nothing until the login status is determined
  if (isLoggedIn === null) {
    return null; // Return nothing while checking
  }

  // Conditionally render the header only if the user is logged in
  if (!isLoggedIn) {
    return null; // Don't render the header if the user is not logged in
  }

  return (
    <header className="bg-blue-500 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">DotYourSpot</h1>
      <nav>
        <ul className="flex space-x-4 w-full mt-5 items-center">
          <li>
            <Link
              className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              href="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              href="/profile"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200  hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              href="/products"
            >
              Products
            </Link>
          </li>
          <li>
            <Link href="/cart">
              <CartButton />
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;
