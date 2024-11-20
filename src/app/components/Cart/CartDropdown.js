import CartItem from "./CartItem";

const CartDropdown = (props) => {
  return (
    <>
      <h2>Cart</h2>
      <ul>
        <CartItem />
      </ul>
    </>
  );
};

export default CartDropdown;
