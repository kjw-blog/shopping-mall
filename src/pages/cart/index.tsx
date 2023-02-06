import { useQuery } from 'react-query';
import CartList from '../../components/cart/CartList';
import { Cart as CartType, GET_CART } from '../../graphql/cart';
import { graphqlFetcher, QueryKeys } from '../queryClient';

const Cart = () => {
  const { data } = useQuery<{ [key: string]: CartType }>(
    [QueryKeys.CART],
    () => graphqlFetcher(GET_CART),
    {
      staleTime: 0,
      cacheTime: 1000,
    }
  );

  console.log('test');

  const cartItems = Object.values(data || {});
  if (cartItems.length === 0) return <div>장바구니가 비었어요</div>;

  return <CartList items={cartItems} />;
};

export default Cart;
