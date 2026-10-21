import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import NotFoundPage from './pages/NotFoundPage';
import WishlistPage from './pages/WishlistPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <ProductListPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminProductsPage /> },
      { path: 'products/new', element: <AdminProductFormPage /> },
      { path: 'products/:id/edit', element: <AdminProductFormPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
