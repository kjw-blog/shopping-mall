import { Cart } from '../../graphql/cart';
import CartItem from './CartItem';

const CartList = ({ items }: { items: Cart[] }) => {
  return (
    <>
      <label>
        <input type='checkbox' />
        전체선택
      </label>
      <ul className='cart'>
        {items.map((item) => (
          <CartItem {...item} key={item.id} />
        ))}
      </ul>
    </>
  );
};

export default CartList;
