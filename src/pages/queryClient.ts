import { QueryClient } from 'react-query';

// 프로젝트 내에서 type 과 interface 중 하나만 사용
type AnyOBJ = { [key: string]: any };

const BASE_URL = 'https://fakestoreapi.com';

// queryClient 반복생성을 막음
export const getClient = (() => {
  let client: QueryClient | null = null;

  return () => {
    if (!client) client = new QueryClient();
    return client;
  };
})();

// 데이터 패칭 함수
export const fetcher = async ({
  method,
  path,
  body,
  params,
}: {
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
  path: string;
  body?: AnyOBJ;
  params?: AnyOBJ;
}) => {
  try {
    const url = `${BASE_URL}${path}`;
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': BASE_URL,
      },
    };

    const res = await fetch(url, fetchOptions);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
  }
};

// QueryKey관리
export const QueryKeys = {
  PRODUCTS: 'PRODUCTS',
};
