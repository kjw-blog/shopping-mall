import { SyntheticEvent } from 'react';
import { useMutation } from 'react-query';
import { Cart, DELETE_CART, UPDATE_CART } from '../../graphql/cart';
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

  const { mutate: deleteCart } = useMutation(
    ({ id }: { id: string }) => graphqlFetcher(DELETE_CART, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.CART);
      },
    }
  );

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = Number((e.target as HTMLInputElement).value);
    updateCart({ id, amount });
  };

  const handleDeleteItem = () => {
    deleteCart({ id });
  };

  return (
    <li className='cart-item'>
      <input className='cart-item__checkbox' type='checkbox' />
      <img className='cart-item__image' src={imageUrl} />
      <p className='cart-item__price'>{price}</p>
      <p className='cart-item__title'>{title}</p>
      <input
        className='cart-item__amount'
        type='number'
        onChange={handleUpdateAmount}
        value={amount}
      />
      <button
        className='cart-item__button'
        type='button'
        onClick={handleDeleteItem}
      >
        삭제
      </button>
    </li>
  );
};

export default CartItem;
