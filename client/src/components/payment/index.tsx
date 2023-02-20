import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { EXECUTE_PAY } from '../../graphql/payment';
import { graphqlFetcher } from '../../pages/queryClient';
import { checkedCartState } from '../../recoils/cart';
import WillPay from '../willPay';
import PaymentModal from './modal';

type PaymentInfos = string[];

const Payment = () => {
  const navigate = useNavigate();

  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);
  const [modalShown, toggleModal] = useState(false);

  const { mutate: executePay } = useMutation((payInfos: PaymentInfos) =>
    graphqlFetcher(EXECUTE_PAY, payInfos)
  );

  const showModal = () => {
    toggleModal(true);
  };

  const proceed = () => {
    // 결제진행 프로세스

    const payInfos = checkedCartData.map(({ id }) => {
      return id;
    });

    executePay(payInfos);
    setCheckedCartData([]);

    // 결제 페이지로 돌아오는것을 막기위해 replace를 true로 준다.
    // replace를 하면 history에 쌓이지 않는걸로 알고있음
    alert('결제 완료되었습니다.');
    navigate('/products', { replace: true });
  };

  const cancel = () => {
    toggleModal(false);
  };

  return (
    <div>
      <WillPay handleSubmit={showModal} submitTitle='결제하기' />
      <PaymentModal show={modalShown} proceed={proceed} cancel={cancel} />
    </div>
  );
};

export default Payment;
