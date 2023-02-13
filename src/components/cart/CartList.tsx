import { createRef, SyntheticEvent, useRef } from 'react';
import { Cart } from '../../graphql/cart';
import CartItem from './CartItem';

const CartList = ({ items }: { items: Cart[] }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>());

  // 전체 선택에 대한 함수
  const handleCheckboxChanged = (e: SyntheticEvent) => {
    if (!formRef.current) return;

    // 체크가 되는 대상
    const targetInput = e.target as HTMLInputElement;

    // formRef 안에 있는 데이터들
    const data = new FormData(formRef.current);

    // name이 select-item이고, 체크된 input의 개수
    const selectedCount = data.getAll('select-item').length;

    if (targetInput.classList.contains('select-all')) {
      // change 이벤트가 일어난 input의 className에 select-all 이 포함될 때 실행
      const allChecked = targetInput.checked;

      // select-all input의 checked 상태에 따라 하위 input의 checked를 수정해준다
      checkboxRefs.forEach((inputElem) => {
        inputElem.current!.checked = allChecked;
      });
    } else {
      const allChecked = selectedCount === items.length;
      formRef.current.querySelector<HTMLInputElement>('.select-all')!.checked =
        allChecked;
    }
  };

  return (
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
  );
};

export default CartList;
