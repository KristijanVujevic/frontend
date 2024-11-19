import CartButton from "../Cart/CartButton";

import Link from "next/link";

const MainHeader = (props) => {
  return (
    <header className="bg-blue-500 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">DotYourSpot</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
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
