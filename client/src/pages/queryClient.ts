import { QueryClient } from 'react-query';
import { request } from 'graphql-request';
import { RequestDocument } from 'graphql-request/dist/types';

// 프로젝트 내에서 type 과 interface 중 하나만 사용
type AnyOBJ = { [key: string]: any };

const BASE_URL = 'http://localhost:8000/graphql';

// queryClient 반복생성을 막음
export const getClient = (() => {
  let client: QueryClient | null = null;

  return () => {
    if (!client)
      client = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            // 중요 ! 최초 fetching 후 다른 페이지로 이동 시 stale Data가 되는 시간
            // default:0 이고 만약 staleTime을 60*1000 으로 하면
            // 1분간 fresh한 데이터로 인식하는 것 같음

            cacheTime: Infinity,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          },
        },
      });
    return client;
  };
})();

// 데이터 패칭 함수
// export const restFetcher = async ({
//   method,
//   path,
//   body,
//   params,
// }: {
//   method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
//   path: string;
//   body?: AnyOBJ;
//   params?: AnyOBJ;
// }) => {
//   try {
//     let url = `${BASE_URL}${path}`;
//     const fetchOptions: RequestInit = {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': BASE_URL,
//       },
//     };

//     if (params) {
//       const searchParams = new URLSearchParams(params);

//       url += '?' + searchParams.toString();
//     }

//     if (body) fetchOptions.body = JSON.stringify(body);

//     const res = await fetch(url, fetchOptions);
//     const json = await res.json();
//     return json;
//   } catch (err) {
//     console.error(err);
//   }
// };

export const graphqlFetcher = (query: RequestDocument, variables = {}) => {
  return request(BASE_URL, query, variables);
};

// QueryKey관리
export const QueryKeys = {
  PRODUCTS: 'PRODUCTS',
  CART: 'CART',
};
