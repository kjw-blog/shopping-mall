type Method = 'Query' | 'Mutation';

export type Resolver = {
  [k in Method]: {
    [key: string]: (
      parent: any,
      args: { [key: string]: any },
      context: {},
      info: any
    ) => any;
  };
};
