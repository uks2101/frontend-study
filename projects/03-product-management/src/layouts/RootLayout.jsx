import { Link, NavLink, Outlet, ScrollRestoration, useMatch } from 'react-router';
import { useCart } from '../store/cart/cartContext';
import { getCartCount } from '../store/cart/cartSelectors';
import { useWishlistCount } from '../store/wishlist/wishlistStore';

export default function RootLayout() {
  const isProductDetail = useMatch('/products/:id');
  const { items } = useCart();
  const cartCount = getCartCount(items);
  const wishlistCount = useWishlistCount();

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">SHOP</Link>
        <nav className="gnb">
          <NavLink to="/" end className={({ isActive }) => (isActive || isProductDetail ? 'active' : '')}>상품</NavLink>
          <NavLink to="/wishlist">
            찜
            {wishlistCount > 0 && (
              <span className="badge">
                {wishlistCount}
                <span className="sr-only">개 상품</span>
              </span>
            )}
          </NavLink>
          <NavLink to="/cart">
            장바구니
            {cartCount > 0 && (
              <span className="badge">
                {cartCount}
                <span className="sr-only">개 상품</span>
              </span>
            )}
          </NavLink>
          <NavLink to="/admin">관리자</NavLink>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <ScrollRestoration />
    </div>
  )
}