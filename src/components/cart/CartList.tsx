import { Cart } from '../../graphql/cart';
import CartItem from './CartItem';

const CartList = ({ items }: { items: Cart[] }) => {
  return (
    <ul>
      {items.map((item) => (
        <CartItem {...item} />
      ))}
    </ul>
  );
};

export default CartList;
