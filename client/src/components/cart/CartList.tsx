import {
  createRef,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef, 
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { CartType } from '../../graphql/cart';
import { checkedCartState } from '../../recoils/cart';
import CartItem from './CartItem';
import WillPay from '../willPay';
import { useNavigate } from 'react-router-dom';

const CartList = ({ items }: { items: CartType[] }) => {
  const navigate = useNavigate();

  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);

  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>());

  const [formData, setFormData] = useState<FormData>();

  const enabledItems = items.filter((item) => item.product.createdAt);

  const setAllCheckedFromItems = () => {
    if (!formRef.current) return;

    const data = new FormData(formRef.current);

    // name이 select-item이고, 체크된 input의 개수
    const selectedCount = data.getAll('select-item').length;

    const allChecked = selectedCount === enabledItems.length;
    formRef.current.querySelector<HTMLInputElement>('.select-all')!.checked =
      allChecked;
  };

  const setItemsCheckedFromAll = (target: HTMLInputElement) => {
    // change 이벤트가 일어난 input의 className에 select-all 이 포함될 때 실행
    const allChecked = target.checked;

    // select-all input의 checked 상태에 따라 하위 input의 checked를 수정해준다
    checkboxRefs
      .filter((inputElem) => !inputElem.current!.disabled)
      .forEach((inputElem) => {
        inputElem.current!.checked = allChecked;
      });
  };

  // 전체 선택에 대한 함수
  const handleCheckboxChanged = (e?: SyntheticEvent) => {
    if (!formRef.current) return;

    // 체크가 되는 대상
    const targetInput = e?.target as HTMLInputElement;

    // formRef 안에 있는 데이터들
    const data = new FormData(formRef.current);

    if (targetInput && targetInput.classList.contains('select-all')) {
      // 전체선택 클릭 시 실행
      setItemsCheckedFromAll(targetInput);
    } else {
      setAllCheckedFromItems();
    }

    setFormData(data);
  };

  const handleSubmit = () => {
    if (checkedCartData.length) {
      navigate('/payment');
    } else {
      alert('결제할 대상이 없어요. ');
    }
  };

  useEffect(() => {
    checkedCartData.forEach((item) => {
      const itemRef = checkboxRefs.find(
        (ref) => ref.current!.dataset.id === item.id
      );

      if (itemRef) itemRef.current!.checked = true;
    });
    setAllCheckedFromItems();
  }, [checkedCartData]);

  useEffect(() => {
    const checkedItems = checkboxRefs.reduce<CartType[]>((res, ref, i) => {
      if (ref.current!.checked) res.push(items[i]);
      return res;
    }, []);

    setCheckedCartData(checkedItems);
  }, [items, formData]);

  return (
    <div>
      <form ref={formRef} onChange={handleCheckboxChanged}>
        <label>
          <input className='select-all' name='select-all' type='checkbox' />
          전체선택
        </label>
        <ul className='cart'>
          {items.map((item, i) => (
            <CartItem {...item} key={item.id} ref={checkboxRefs[i]} />
          ))}
        </ul>
      </form>
      <WillPay handleSubmit={handleSubmit} submitTitle='결제창으로' />
    </div>
  );
};

export default CartList;
