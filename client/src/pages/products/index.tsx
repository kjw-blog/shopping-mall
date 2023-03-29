import { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import ProductList from '../../components/product/list';
import GET_PRODUCTS, { Products } from '../../graphql/products';
import { graphqlFetcher, QueryKeys } from '../queryClient';

const ProductListPage = () => {
  const observerRef = useRef<IntersectionObserver>();
  const fetchMoreRef = useRef<HTMLDivElement>(null);

  // 감지되야하는 element가 화면에 보여지는지 여부
  const [intersecting, setIntersecting] = useState(false);

  // 옵저버가 계속 생성되는것을 방지
  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      // 감시하는 element가 사라지거나 나타날 때 실행
      observerRef.current = new IntersectionObserver((entries) => {
        setIntersecting(entries[0]?.isIntersecting);
      });
    }

    return observerRef.current;
  }, [observerRef.current]);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<Products>(
    QueryKeys.PRODUCTS,
    ({ pageParam = '' }) => graphqlFetcher(GET_PRODUCTS, { cursor: pageParam }),
    {
      // 이 함수의 return 값이 pageParam으로 들어가게된다.
      getNextPageParam: (lastPage) => {
        return lastPage.products.at(-1)?.id;
      },
    }
  );

  useEffect(() => {
    // fetchMoreRef.current 라는 element 를 감시하라고 시킴
    if (fetchMoreRef.current) getObserver().observe(fetchMoreRef.current);
  }, [fetchMoreRef.current]);

  useEffect(() => {
    console.log(intersecting);
  }, [intersecting]);

  return (
    <div>
      <h2>상품 목록</h2>
      <ProductList list={data?.pages || []} />
      <div ref={fetchMoreRef} />
    </div>
  );
};

export default ProductListPage;
