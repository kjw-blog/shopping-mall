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

import { Products, Resolver } from './types';
import { v4 as uuid } from 'uuid';
import { DBField, writeDB } from '../dbController';

const setJSON = (data: Products) => writeDB(DBField.PRODUCTS, data);

const productResolver: Resolver = {
  Query: {
    products: (parent, { cursor = '' }, { db }) => {
      // cursor가 product의 id 와 같은 상품의 index + 1 (다음 상품 인덱스)
      const fromIndex =
        db.products.findIndex((product) => product.id === cursor) + 1;

      // 위에서 찾은 index 번호로 상품을 나눔 (15개 씩)
      return db.products.slice(fromIndex, fromIndex + 15) || [];
    },
    product: (parent, { id }, { db }) => {
      const found = db.products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },
  Mutation: {
    addProduct: (parent, { imageUrl, price, title, description }, { db }) => {
      const newProduct = {
        id: uuid(),
        imageUrl,
        price,
        title,
        description,
        createdAt: Date.now(),
      };
      db.products.push(newProduct);
      setJSON(db.products);
      return newProduct;
    },
    updateProduct: (parent, { id, ...data }, { db }) => {
      const existProductIndex = db.products.findIndex((item) => item.id === id);

      if (existProductIndex < 0) {
        throw new Error('없는 상품입니다.');
      }

      const updatedItem = {
        ...db.products[existProductIndex],
        ...data,
      };

      db.products.splice(existProductIndex, 1, updatedItem);
      setJSON(db.products);
      return updatedItem;
    },
    deleteProduct: (parent, { id }, { db }) => {
      // 실제 db에서 삭제하는게 아닌, createdAt을 지워준다.
      const existProductIndex = db.products.findIndex((item) => item.id === id);

      if (existProductIndex < 0) {
        throw new Error('없는 상품입니다.');
      }
      const updatedItem = {
        ...db.products[existProductIndex],
      };

      delete updatedItem.createdAt;
      db.products.splice(existProductIndex, 1, updatedItem);
      setJSON(db.products);
      return id;
    },
  },
};

export default productResolver;

/**
 * 60페이지 중 15개씩 끊을 때
 * cursor | ids
 * ''     | 0 ~ 14
 * 15     | 15 ~ 29
 * 30     | 30 ~ 44
 * 45     | 45 ~ 59
 *
 * cursor : 이전 페이지의 마지막 id
 * page 단위로 나눠도 되지만 그럴경우 데이터가 추가 되거나 할때 애매할수있다함
 *
 */
