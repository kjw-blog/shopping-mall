import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { checkedCartState } from '../../recoils/cart';
import CartItemData from '../cart/CartItemData';

const WillPay = ({
  handleSubmit,
  submitTitle,
}: {
  handleSubmit: (e: SyntheticEvent) => void;
  submitTitle: string;
}) => {
  const checkedItems = useRecoilValue(checkedCartState);

  const totalPrice = checkedItems.reduce(
    (res, { product: { price }, amount }) => {
      res += price * amount;
      return res;
    },
    0
  );

  return (
    <div className='cart-willpay'>
      <ul>
        {checkedItems.map(
          ({ product: { price, imageUrl, title }, id, amount }) => (
            <li key={id}>
              <CartItemData imageUrl={imageUrl} price={price} title={title} />
              <p>수량 : {amount}</p>
              <p>금액 : {price * amount}</p>
            </li>
          )
        )}
      </ul>
      <p>총예상결제액 : {totalPrice}</p>
      <button onClick={handleSubmit}>{submitTitle}</button>
    </div>
  );
};

export default WillPay;
