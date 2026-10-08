import { Link, NavLink, Outlet, ScrollRestoration, useMatch } from 'react-router';

export default function RootLayout() {
  const isProductDetail = useMatch('/products/:id');

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">SHOP</Link>
        <nav className="gnb">
          <NavLink to="/" end className={({ isActive }) => (isActive || isProductDetail ? 'active' : '')}>상품</NavLink>
          <NavLink to="/cart">장바구니</NavLink>
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