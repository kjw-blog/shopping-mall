import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

const useIntersection = (targetRef: RefObject<HTMLElement>) => {
  const observerRef = useRef<IntersectionObserver>();

  const [intersecting, setIntersecting] = useState(false);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      // 감시하는 element가 사라지거나 나타날 때 실행
      observerRef.current = new IntersectionObserver((entries) => {
        // 커스텀 훅으로 전환하면서 감시하는 element가 여러개가 될 수 있기 때문에
        // entries 배열 첫번째 값이 아닌 전체의 isIntersecting을 감시한다.
        // setIntersecting(entries[0]?.isIntersecting);
        setIntersecting(entries.some((entry) => entry.isIntersecting));
      });
    }

    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    // targetRef.current 라는 element 를 감시하라고 시킴
    if (targetRef.current) getObserver().observe(targetRef.current);
  }, [targetRef.current]);

  return intersecting;
};

export default useIntersection;
