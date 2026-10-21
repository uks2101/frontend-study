import { Link, NavLink, Outlet, useMatch } from 'react-router';
import SkipLink from '../components/common/SkipLink';
import ThemeSelect from '../components/common/ThemeSelect';

export default function AdminLayout() {
  const isEditPage = useMatch('/admin/products/:id/edit');

  return (
    <div className="app admin">
      <SkipLink />
      <header className="header">
        <Link to="/admin" className="logo">
          SHOP ADMIN
        </Link>
        <div className="header__actions">
          <nav className="gnb">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive || isEditPage ? 'active' : '')}
            >
              상품 관리
            </NavLink>
            <NavLink to="/admin/products/new">상품 등록</NavLink>
            <NavLink to="/">쇼핑몰로 이동</NavLink>
          </nav>
          <ThemeSelect />
        </div>
      </header>

      <main id="main" className="main" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
