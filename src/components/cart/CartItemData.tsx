import { Cart } from '../../graphql/cart';

const CartItemData = ({
  imageUrl,
  price,
  title,
}: Pick<Cart, 'imageUrl' | 'price' | 'title'>) => {
  return (
    <>
      <img className='cart-item__image' src={imageUrl} />
      <p className='cart-item__price'>{price}</p>
      <p className='cart-item__title'>{title}</p>
    </>
  );
};

export default CartItemData;
