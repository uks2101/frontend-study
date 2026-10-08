import ProductCard from './ProductCard';

export default function ProductList({ products, view = 'grid' }) {
  return (
    <ul className={`product-list product-list--${view}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  )
}