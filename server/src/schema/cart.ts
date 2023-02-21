import { gql } from 'apollo-server-express';

/**
 * CartItem이 테이블 인것같음
 * Query가 get 메소드, Mutation이 put, post, delete인듯함 (react-query 비슷한듯)
 *
 * extend 붙이는 이유
 * index.ts 에서 먼저 정의해놓은 type에다가 해당 type을 추가하겠다는 의미라고함
 * (파일 분리를 위해서)
 */

const cartSchema = gql`
  type CartItem {
    id: ID!
    imageUrl: String!
    price: Int!
    title: String!
    amount: Int!
  }

  extend type Query {
    cart: [CartItem!]
  }

  extend type Mutation {
    addCart(id: ID!): CartItem!
    updateCart(id: ID!, amount: Int!): CartItem!
    deleteCart(id: ID!): ID!
    executePay(ids: [ID!]): [ID!]
  }
`;

export default cartSchema;
