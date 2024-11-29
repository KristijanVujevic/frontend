import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CartButton from "../Cart/CartButton";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus, logout } from "@/app/redux/slices/authSlice";

const MainHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Get authentication state from Redux store
  const { isLoggedIn, isAdmin } = useSelector((state) => state.auth);

  // Dispatch checkAuthStatus when component mounts
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Logout function
  const handleLogout = () => {
    // Remove tokens from localStorage
    dispatch(logout());

    // Redirect to the sign-in page
    router.push("/auth/signin");
  };

  // Show nothing until the login status is determined
  if (isLoggedIn === null) {
    return null; // Return nothing while checking
  }

  // Conditionally render the header only if the user is logged in
  return (
    isLoggedIn && (
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
            {isAdmin && (
              <li>
                <Link
                  className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  href="/admin"
                >
                  Admin
                </Link>
              </li>
            )}
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
    )
  );
};

export default MainHeader;
