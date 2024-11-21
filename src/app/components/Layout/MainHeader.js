import CartButton from "../Cart/CartButton";

import Link from "next/link";

const MainHeader = (props) => {
  return (
    <header className="bg-blue-500 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">DotYourSpot</h1>
      <nav>
        <ul className="flex space-x-4 w-full mt-5 items-center ">
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
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;
