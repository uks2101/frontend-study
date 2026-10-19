import { Link, NavLink, Outlet, ScrollRestoration, useMatch } from 'react-router';
import { useCartStore } from '../store/cart/cartStore';
import { useWishlistCount } from '../store/wishlist/wishlistStore';
import SkipLink from '../components/common/SkipLink';
import ThemeSelect from '../components/common/ThemeSelect';

export default function RootLayout() {
  const isProductDetail = useMatch('/products/:id');
  const cartCount = useCartStore((state) => state.items.length);
  const wishlistCount = useWishlistCount();

  return (
    <div className="app">
      <SkipLink />
      <header className="header">
        <Link to="/" className="logo">
          SHOP
        </Link>
        <div className="header__actions">
          <nav className="gnb">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive || isProductDetail ? "active" : ""
              }
            >
              상품
            </NavLink>
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
          <ThemeSelect />
        </div>
      </header>

      <main id="main" className="main" tabIndex={-1}>
        <Outlet />
      </main>

      <ScrollRestoration />
    </div>
  );
}