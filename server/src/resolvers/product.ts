/**
 *  schema에 정의한 Query, Mutation에 맞게 작성
 *
 *  resolver는 4개의 arguments 를 받는다.
 *
 *  1. parent : resolve내의 상위에 있는 값 (top level resolve에는 parent가 없음)
 *  2. args : request가 객체 형태로 들어온다? ex) product(id : 'abc') 일 때
 *            { "id" : "abc" } 처럼 객체로 들어온다.
 *  3. contextValue : 모든 resolver에 공유되는 객체이다?
 *  4. info : 필드의 이름, root에서 필드까지의 경로이다?
 *
 * */

import { Resolver } from './types';

const productResolver: Pick<Resolver, 'Query'> = {
  Query: {
    products: (parent, args, { db }) => {
      return db.products;
    },
    product: (parent, { id }, { db }) => {
      const found = db.products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },
};

export default productResolver;
