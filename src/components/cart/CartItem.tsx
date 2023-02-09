import { SyntheticEvent } from 'react';
import { useMutation } from 'react-query';
import { Cart, UPDATE_CART } from '../../graphql/cart';
import { graphqlFetcher } from '../../pages/queryClient';

const CartItem = ({ id, imageUrl, price, title, amount }: Cart) => {
  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher(UPDATE_CART, { id, amount })
  );

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = Number((e.target as HTMLInputElement).value);
    updateCart({ id, amount });
  };

  return (
    <li className='cart-item'>
      {/* {imageUrl} {price} {title} {amount} */}
      <img src={imageUrl} />
      <p className='cart-item__price'>{price}</p>
      <p className='cart-item__title'>{title}</p>
      <input
        type='number'
        onChange={handleUpdateAmount}
        className='cart-item__amount'
        value={amount}
      />
    </li>
  );
};

export default CartItem;
