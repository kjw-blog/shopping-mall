import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import ProductItem from '../../components/product/item';

import ProductList from '../../components/product/list';
import GET_PRODUCTS, { Products } from '../../graphql/products';
import useIntersection from '../../hooks/useIntersection';
import { graphqlFetcher, QueryKeys } from '../queryClient';

const ProductListPage = () => {
  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useIntersection(fetchMoreRef);

  // 감지되야하는 element가 화면에 보여지는지 여부

  // 옵저버가 계속 생성되는것을 방지

  const { data, isSuccess, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<Products>(
      [QueryKeys.PRODUCTS, 'products'],
      ({ pageParam = '' }) =>
        graphqlFetcher(GET_PRODUCTS, { cursor: pageParam }),
      {
        // 이 함수의 return 값이 pageParam으로 들어가게된다.
        getNextPageParam: (lastPage) => {
          return lastPage.products.at(-1)?.id;
        },
      }
    );

  useEffect(() => {
    if (!intersecting || !isSuccess || !hasNextPage || isFetchingNextPage)
      return;

    fetchNextPage();
  }, [intersecting]);

  return (
    <div>
      <h2>상품 목록</h2>
      <ProductList list={data?.pages || []} Item={ProductItem} />
      <div ref={fetchMoreRef} />
    </div>
  );
};

export default ProductListPage;
