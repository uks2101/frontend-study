import ProductCard from './ProductCard';

export default function ProductList({ products }) {
  return (
    <ul className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  )
}