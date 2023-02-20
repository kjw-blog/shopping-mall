import { graphql } from 'msw';
import GET_PRODUCTS, { GET_PRODUCT } from '../graphql/products';
import {
  ADD_CART,
  Cart,
  DELETE_CART,
  GET_CART,
  UPDATE_CART,
} from '../graphql/cart';
import { EXECUTE_PAY } from '../graphql/payment';

const mockProducts = Array.from({ length: 20 }).map((_, index) => ({
  id: index + 1 + '',
  imageUrl: `https://picsum.photos/id/${index + 10}/200/150`,
  price: 50000,
  title: `임시상품 ${index + 1}`,
  description: `임시상세내용 ${index + 1}`,
  createdAt: new Date(1676567890123 + index * 1000 * 60 * 60 * 24).toString(),
}));

let cartData: { [key: string]: Cart } = {};

export const handlers = [
  graphql.query(GET_PRODUCTS, (req, res, ctx) => {
    return res(
      ctx.data({
        products: mockProducts,
      })
    );
  }),
  graphql.query(GET_PRODUCT, (req, res, ctx) => {
    const found = mockProducts.find((item) => item.id === req.variables.id);
    if (found) return res(ctx.data(found));

    return res();
  }),
  graphql.query(GET_CART, (req, res, ctx) => {
    return res(ctx.data(cartData));
  }),
  graphql.mutation(ADD_CART, (req, res, ctx) => {
    const newCartData = { ...cartData };
    const id = req.variables.id;
    const targetProduct = mockProducts.find(
      (item) => item.id === req.variables.id
    );

    if (!targetProduct) {
      throw new Error('상품이 없습니다');
    }

    const newItem = {
      ...targetProduct,
      amount: (newCartData[id]?.amount || 0) + 1,
    };

    newCartData[id] = newItem;

    cartData = newCartData;

    return res(ctx.data(newItem));
  }),
  graphql.mutation(UPDATE_CART, (req, res, ctx) => {
    /**
     *  직접 짠 코드
     *  예외 처리를 안했다...
     */

    // const { id, amount } = req.variables;

    // const newData = {
    //   ...cartData,
    //   [id]: {
    //     ...cartData[id],
    //     amount,
    //   },
    // };

    // cartData = newData;

    // return res(ctx.data({ newData }));

    const newData = { ...cartData };
    const { id, amount } = req.variables;
    if (!newData[id]) {
      throw new Error('없는 데이터입니다.');
    }

    const newItem = {
      ...newData[id],
      amount,
    };

    newData[id] = newItem;

    cartData = newData;
    return res(ctx.data(newItem));
  }),
  graphql.mutation(DELETE_CART, ({ variables: { id } }, res, ctx) => {
    const newData = { ...cartData };

    if (!newData[id]) throw new Error('없는 데이터입니다.');

    delete newData[id];

    cartData = newData;
    return res(ctx.data(id));
  }),
  graphql.mutation(EXECUTE_PAY, ({ variables: ids }, res, ctx) => {
    ids.forEach((id: string) => {
      delete cartData[id];
    });

    return res(ctx.data(ids));
  }),
];
