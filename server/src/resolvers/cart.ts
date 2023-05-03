/** 임시 데이터 */

import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { DBField, writeDB } from '../dbController';
import { Cart, Product, Resolver } from './types';
import { db } from '../../firebase';

const setJSON = (data: Cart) => writeDB(DBField.CART, data);

const cartResolver: Resolver = {
  Query: {
    cart: async (parent, args) => {
      const cart = collection(db, 'cart');
      const q = query(cart);

      const snapshot = await getDocs(q);

      const data: DocumentData[] = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

      return data;
    },
  },
  Mutation: {
    // key값이 id로 들어오는데 productId로 key를 설정해서 계속 undefined떳엇음
    // 강사님은 schema에 있는 id를 각각 productId, cartId로 바꿔서 씀
    addCart: async (parent, { id: productId }) => {
      if (!productId) throw Error('상품id가 없다!');

      const productRef = doc(db, 'products', productId);
      const cartCollection = collection(db, 'cart');

      // cart 테이블에 받아온 id와 같은 상품이 있는지 확인하는 변수
      const exist = (
        await getDocs(query(cartCollection, where('product', '==', productRef)))
      ).docs[0];

      let cartRef;

      if (exist) {
        cartRef = doc(db, 'cart', exist.id);

        await updateDoc(cartRef, {
          // increment 함수의 파라미터 만큼 증가시킴
          amount: increment(1),
        });
      } else {
        cartRef = await addDoc(cartCollection, {
          amount: 1,
          product: productRef,
        });
      }

      const snapshot = await getDoc(cartRef);

      return {
        id: snapshot.id,
        ...snapshot.data(),
        product: productRef,
      };
    },
    updateCart: async (parent, { id: cartId, amount }) => {
      if (amount < 1) throw Error('1 이하로 바꿀 수 없습니다.');

      // const productRef = doc(db, 'products', cartId);

      /** 강사님이 구현한 방식
       *  강의 중간에 바꾸심
       */

      // const cartCollection = collection(db, 'cart');
      // const exist = (
      //   await getDocs(query(cartCollection, where('product', '==', productRef)))
      // ).docs[0];

      // if (!exist) throw Error('등록된 장바구니 정보가 없다!');

      // const cartRef = doc(db, 'cart', exist.id);
      // await updateDoc(cartRef, {
      //   amount,
      // });

      // const cartSnapshot = await getDoc(cartRef);
      // return {
      //   ...cartSnapshot.data(),
      //   product: productRef,
      //   id: cartSnapshot.id,
      // };

      const cartRef = doc(db, 'cart', cartId);
      if (!cartRef) throw Error('장바구니 정보가 없다');

      await updateDoc(cartRef, {
        amount,
      });

      const cartSnapshot = await getDoc(cartRef);
      return {
        ...cartSnapshot.data(),
        id: cartSnapshot.id,
      };

      /**
       * 내가 구현한 방식
       * 정상 작동함
       * updateCart함수 자체가 cart id를 받아오는건데
       * 굳이 쿼리 돌려서 exist를 찾을 필요가 있나싶음
       *
       *
       */
      // const cart = doc(db, 'cart', id);
      // const snapshot = await getDoc(cart);

      // if (!snapshot) throw Error('등록된 장바구니 정보 없음');

      // await updateDoc(cart, {
      //   amount,
      // });

      // return {
      //   id: snapshot.id,
      //   ...snapshot.data(),
      //   product: productRef,
      // };
    },
    deleteCart: async (parent, { id: cartId }) => {
      const cartRef = doc(db, 'cart', cartId);
      if (!cartRef) throw Error('장바구니 정보가 없다.');

      await deleteDoc(cartRef);

      return cartId;
    },
    executePay: async (parent, { ids }) => {
      const deleted = [];

      for await (const id of ids) {
        const cartRef = doc(db, 'cart', id);
        const cartSnapshot = await getDoc(cartRef);
        const cartData = cartSnapshot.data();

        const productRef = cartData?.product;

        if (!productRef) throw Error('상품 정보가 없다!');

        const product = (await getDoc(productRef)).data() as Product;
        if (!product) throw Error('상품 정보가 없다!');

        if (product.createdAt) {
          await deleteDoc(cartRef);
          deleted.push(id);
        }
      }

      return deleted;
    },
  },
  CartItem: {
    product: async (cartItem, args) => {
      const snapshot = await getDoc(cartItem.product);

      return {
        ...(snapshot.data() as any),
        id: snapshot.id,
      };
    },
  },
};

export default cartResolver;
