import { ForwardedRef, forwardRef, SyntheticEvent } from 'react';
import { useMutation } from 'react-query';
import { CartType, DELETE_CART, UPDATE_CART } from '../../graphql/cart';
import { getClient, graphqlFetcher, QueryKeys } from '../../pages/queryClient';
import CartItemData from './CartItemData';

const CartItem = (
  { id, amount, product: { imageUrl, price, title, createdAt } }: CartType,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const queryClient = getClient();
  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      onMutate: async ({ id, amount }) => {
        const { cart: prevCart } = queryClient.getQueryData<{
          cart: CartType[];
        }>(QueryKeys.CART) || { cart: [] };
        if (!prevCart) return;
        const targetIndex = prevCart.findIndex((item) => item.id === id);

        if (targetIndex === undefined || targetIndex < 0) return;
        const newCart = [...prevCart];
        newCart.splice(targetIndex, 1, { ...newCart[targetIndex], amount });

        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });

        return prevCart;
      },
      onSuccess: ({ updateCart }) => {
        const { cart: prevCart } = queryClient.getQueryData<{
          cart: CartType[];
        }>(QueryKeys.CART) || { cart: [] };
        if (!prevCart) return;
        const targetIndex = prevCart.findIndex(
          (item) => item.id === updateCart.id
        );

        if (targetIndex === undefined || targetIndex < 0) return;

        const newCart = [...prevCart];
        newCart.splice(targetIndex, 1, updateCart);
        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });
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

    if (amount < 1) return;

    updateCart({ id, amount });
  };

  const handleDeleteItem = () => {
    deleteCart({ id });
  };

  return (
    <li className='cart-item'>
      <input
        className='cart-item__checkbox'
        type='checkbox'
        name='select-item'
        ref={ref}
        data-id={id}
        disabled={!createdAt}
      />
      <CartItemData imageUrl={imageUrl} price={price} title={title} />
      {!createdAt ? (
        <div>삭제된 상품입니다.</div>
      ) : (
        <input
          className='cart-item__amount'
          type='number'
          onChange={handleUpdateAmount}
          min={1}
          value={amount}
        />
      )}
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

export default forwardRef(CartItem);
