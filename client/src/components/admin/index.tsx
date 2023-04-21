import AddForm from './addForm';

import GET_PRODUCTS, { Products } from '../../graphql/products';
import useIntersection from '../../hooks/useIntersection';

import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { QueryKeys, graphqlFetcher } from '../../pages/queryClient';
import AdminList from './list';

const Admin = () => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const startEdit = (index: number) => () => setEditingIndex(index);

  const doneEdit = () => setEditingIndex(null);

  useEffect(() => {
    if (!intersecting || !isSuccess || !hasNextPage || isFetchingNextPage)
      return;

    fetchNextPage();
  }, [intersecting]);

  return (
    <>
      <AddForm />
      <AdminList
        list={data?.pages || []}
        editingIndex={editingIndex}
        startEdit={startEdit}
        doneEdit={doneEdit}
      />
      <div ref={fetchMoreRef} />
    </>
  );
};

export default Admin;
