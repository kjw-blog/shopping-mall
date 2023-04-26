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
import { db } from '../../firebase';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';

const PAGE_SIZE = 15;

const setJSON = (data: Products) => writeDB(DBField.PRODUCTS, data);

const productResolver: Resolver = {
  Query: {
    products: async (parent, { cursor = '', showDeleted = false }) => {
      // firebase store에서 가져온 db 중 "products"를 가져온다
      const products = collection(db, 'products');

      // 생성일 역순으로 정렬
      const queryOptions: any[] = [orderBy('createdAt', 'desc')];

      // 만약 cursor (리스트 배열 마지막 ID)가 있으면 시작지점을 해당 id로 설정한다
      if (cursor) queryOptions.push(startAfter(cursor));

      // 만약 showDeleted가 false라면 createdAt이 null이 아닌것만 가져온다.
      if (!showDeleted) queryOptions.unshift(where('createdAt', '!=', null));

      // products table에 위에 설정한 옵션 + PAGE_SIZE만큼 limit를 설정한 쿼리
      const q = query(products, ...queryOptions, limit(PAGE_SIZE));

      // 해당 쿼리 문서를 가져옴. (getDocs: 문서 여러개 , getDoc: 단일 문서)
      const snapshot = await getDocs(q);
      const data: DocumentData[] = [];

      // 쿼리 결과 반복문을 돌리며 data배열에 결과 data와 id를 넣어준다
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return data;
    },
    product: async (parent, { id }) => {
      const snapshot = await getDoc(doc(db, 'products', id));

      if (snapshot)
        return {
          id: snapshot.id,
          ...snapshot.data(),
        };
      return null;
    },
  },
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
