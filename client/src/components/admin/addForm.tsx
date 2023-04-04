import { SyntheticEvent } from 'react';
import { QueryClient, useMutation } from 'react-query';
import { ADD_PRODUCT, Product, Products } from '../../graphql/products';
import { QueryKeys, getClient, graphqlFetcher } from '../../pages/queryClient';
import arrToObj from '../../util/arrToObj';

type OmittedProduct = Omit<Product, 'id' | 'createdAt'>;

const AddForm = () => {
  const queryClient = getClient();

  const { mutate: addProduct } = useMutation(
    ({ title, imageUrl, price, description }: OmittedProduct) =>
      graphqlFetcher(ADD_PRODUCT, { title, imageUrl, price, description }),
    {
      onSuccess: () => {
        // 방법 1 : 데이터를 stale처리해서 재요청 함
        // 장 : 코드가 간단하다.
        // 단 : 서버요청을 또 한다.
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          // exact : 하위키가 없는 쿼리만 무효화한다 (하위키로 true,false가 있기때문에 false로 설정)
          // 하위키는 설정해준 QueryKeys.PRODUCTS를 제외한 키인듯?
          exact: false,

          // refetchInactive : 전역 설정한 refetchOnMount 가 false로 돼있어서
          // 해당 쿼리로 불러올 데이터의 상태가 inactive이기 때문에 true로 줘서
          // inactive상태인 쿼리도 refetching 함
          refetchInactive: true,
        });

        // 방법 2 : 응답결과만으로 캐시 업데이트.
        // 장 : 코드가 복잡하다.
        // 단 : 서버요청을 따로 하지 않는다.
        /**
         * const adminData = queryClient.getQueriesData<{
         *  pageParams: (string | undefined)[]
         *  pages: Products[]
         * }>([QueryKeys.PRODUCTS, true])
         *
         * const [adminKey,{ pageParams: adminParams, pages: adminPages }] = adminData[0];
         * const newAdminPages = [...adminPages];
         *
         * newAdminPages[0].products = [addProduct, ...newAdminPages[0].products];
         * queryClient.setQueriesData(adminKey, { pageParams: adminParams, pages: newAdminPages })
         */
      },
    }
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = arrToObj([...new FormData(e.target as HTMLFormElement)]);
    formData.price = Number(formData.price);
    addProduct(formData as OmittedProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        상품명: <input name='title' type='text' required />
      </label>
      <label>
        이미지URL: <input name='imageUrl' type='text' required />
      </label>
      <label>
        상품가격: <input name='price' type='number' required min='1000' />
      </label>
      <label>
        상세: <textarea name='description' />
      </label>
      <button type='submit'>등록</button>
    </form>
  );
};

export default AddForm;
