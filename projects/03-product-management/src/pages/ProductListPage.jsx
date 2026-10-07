import { useEffect, useState } from 'react';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products').then((res) => res.json()).then((data) => setProducts(data.products))
  }, []);

  return (
    <div>
      <h1>상품 목록</h1>
      <p>총 {products.length}개</p>
    </div>
  )
}