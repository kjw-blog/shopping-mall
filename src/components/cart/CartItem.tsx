import { SyntheticEvent } from 'react';
import { useMutation } from 'react-query';
import { Cart, UPDATE_CART } from '../../graphql/cart';
import { getClient, graphqlFetcher, QueryKeys } from '../../pages/queryClient';

const CartItem = ({ id, imageUrl, price, title, amount }: Cart) => {
  const queryClient = getClient();

  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      onMutate: async ({ id, amount }) => {
        const prevCart = queryClient.getQueryData<{ [key: string]: Cart }>(
          QueryKeys.CART
        );

        if (!prevCart?.[id]) return prevCart;

        const newData = {
          ...(prevCart || {}),
          [id]: {
            ...prevCart[id],
            amount,
          },
        };

        queryClient.setQueryData(QueryKeys.CART, newData);

        return prevCart;
      },
      onSuccess: (newValue) => {
        const prevCart = queryClient.getQueryData<{ [key: string]: Cart }>(
          QueryKeys.CART
        );
        const newCart = {
          ...(prevCart || {}),
          [id]: newValue,
        };

        queryClient.setQueryData(QueryKeys.CART, newCart);
      },
    }
  );

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = Number((e.target as HTMLInputElement).value);
    updateCart({ id, amount });
  };

  return (
    <li className='cart-item'>
      <img className='cart-item__image' src={imageUrl} />
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
