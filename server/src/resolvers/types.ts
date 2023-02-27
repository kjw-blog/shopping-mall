type Method = 'Query' | 'Mutation';

export type Resolver = {
  // [k in Method]: {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: { [key: string]: any },
      context: {
        db: {
          cart: Cart;
          products: Products;
        };
      },
      info: any
    ) => any;
  };
};

export type Product = {
  id: string;
  imageUrl: string;
  price: number;
  title: string;
  description: string;
  createdAt: number;
};

export type Products = Product[];

export type CartItem = {
  id: string;
  amount: number;
};

export type Cart = CartItem[];
