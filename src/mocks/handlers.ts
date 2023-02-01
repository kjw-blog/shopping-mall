import { graphql } from 'msw';
import { v4 as uuid } from 'uuid';
import GET_PRODUCTS, { GET_PRODUCT } from '../graphql/products';

const mockProducts = Array.from({ length: 20 }).map((_, index) => ({
  id: uuid(),
  imageUrl: `https://placeimg.com/200/150/${index + 1}`,
  price: 50000,
  title: `임시상품 ${index + 1}`,
  description: `임시상세내용 ${index + 1}`,
  createdAt: new Date(1676567890123 + index * 1000 * 60 * 60 * 24).toString(),
}));

export const handlers = [
  graphql.query(GET_PRODUCTS, (req, res, ctx) => {
    return res(
      ctx.data({
        products: mockProducts,
      })
    );
  }),
  graphql.query(GET_PRODUCT, (req, res, ctx) => {
    return res(ctx.data(mockProducts[0]));
  }),
];
