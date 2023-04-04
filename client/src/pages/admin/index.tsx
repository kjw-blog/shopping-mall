import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import AddForm from '../../components/admin/addForm';
import AdminItem from '../../components/admin/item';

import ProductList from '../../components/product/list';
import GET_PRODUCTS, { Products } from '../../graphql/products';
import useIntersection from '../../hooks/useIntersection';
import { graphqlFetcher, QueryKeys } from '../queryClient';

const AdminPage = () => {
  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useIntersection(fetchMoreRef);

  const { data, isSuccess, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<Products>(
      [QueryKeys.PRODUCTS, 'admin'],
      ({ pageParam = '' }) =>
        graphqlFetcher(GET_PRODUCTS, { cursor: pageParam, showDeleted: true }),
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
      <h2>어드민</h2>
      <AddForm />
      <ProductList list={data?.pages || []} Item={AdminItem} />
      <div ref={fetchMoreRef} />
    </div>
  );
};

export default AdminPage;
