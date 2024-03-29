import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import resolvers from './resolvers';
import schema from './schema';
import { DBField, readDB } from './dbController';

(async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,

    /** 아폴로 서버가 인식할 DB */
    context: {
      db: {
        products: readDB(DBField.PRODUCTS),
        cart: readDB(DBField.CART),
      },
    },
  });

  const app = express();
  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: [
        'http://localhost:3000',
        'https://studio.apollographql.com',
        'http://127.0.0.1:3000',
      ],
      credentials: true,
    },
  });

  await app.listen({ port: 8000 });

  console.log('server listening on 8000...');
  // console.log(readDB(DBField.PRODUCTS));
})();
