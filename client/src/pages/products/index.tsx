import { useInfiniteQuery, useQuery } from 'react-query';
import ProductItem from '../../components/product/item';
import ProductList from '../../components/product/list';
import GET_PRODUCTS, { Products } from '../../graphql/products';
import { graphqlFetcher, QueryKeys } from '../queryClient';

const ProductListPage = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<Products>(
    QueryKeys.PRODUCTS,
    ({ pageParam = '' }) => graphqlFetcher(GET_PRODUCTS, { cursor: pageParam }),
    {
      // 이 함수의 return 값이 pageParam으로 들어가게된다.
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.products.at(-1)?.id;
      },
    }
  );

  /**
   * infiniteQuery가 내려주는 data 형식
   *
   * data : {
   *  pages: [
   *    { products: [ ... ] },
   *    { products: [ ... ] } ,
   *    { products: [ ... ] }
   *  ],
   *  pageParams: [undefined, ... ]
   * }
   *
   * 데이터 표출 방법
   * 1. map 안에서 map 을 한번 더 돌린다.
   *   (강사님 권장방법, 페이지 별 데이터 식별이 쉬움)
   * 2. data.pages.flatMap(page => page.products)를 사용해서 page안에 products을
   *    추출해서 새로운 배열을 만든다.
   */

  return (
    <div>
      <h2>상품 목록</h2>
      <ProductList list={data?.pages || []} />
    </div>
  );
};

export default ProductListPage;
