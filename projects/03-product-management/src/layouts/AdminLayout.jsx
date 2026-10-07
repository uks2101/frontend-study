import { Link, NavLink, Outlet, useMatch } from 'react-router';

export default function AdminLayout() {
  const isEditPage = useMatch('/admin/products/:id/edit');

  return (
    <div className="app admin">
      <header className="header">
        <Link to="/admin" className="logo">SHOP ADMIN</Link>
        <nav className="gnb">
          <NavLink to="/admin" end className={({ isActive }) => (isActive || isEditPage ? 'active' : '')}>상품 관리</NavLink>
          <NavLink to="/admin/products/new">상품 등록</NavLink>
          <NavLink to="/">쇼핑몰로 이동</NavLink>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}