import { gql } from 'apollo-server-express';
import productSchema from './product';
import cartSchema from './cart';

/**
 * extend exam)
 *
 * type Query {
 *      _: Boolean
 *      a_schema_query : [any];
 *      b_schema_query : [any];
 * }
 *
 * 처럼 index에 합쳐진다는것같음
 * _: Boolean은 type Query 가 비어있는것을 방지하기 위함이라함 (아폴로 권장)
 */

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, productSchema, cartSchema];
