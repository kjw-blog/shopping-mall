import GlobalLayout from './pages/_layout';

import Index from './pages/index';
import ProductsIndex from './pages/products/index';
import ProductsId from './pages/products/[id]';
import Cart from './pages/cart';
import Payment from './pages/payment';
import AdminIndex from './pages/admin/index';

export const routes = [
  {
    path: '/',
    element: <GlobalLayout />,
    children: [
      { path: '/', element: <Index />, index: true },
      { path: '/products', element: <ProductsIndex />, index: true },
      { path: '/products/:id', element: <ProductsId /> },
      { path: '/cart', element: <Cart />, index: true },
      { path: '/payment', element: <Payment />, index: true },
      { path: '/admin', element: <AdminIndex />, index: true },
    ],
  },
];

export const pages = [
  { route: '/' },
  { route: '/products' },
  { route: '/products/:id' },
];
