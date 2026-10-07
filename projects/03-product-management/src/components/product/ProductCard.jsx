import { Link } from 'react-router';
import { formatPrice, getSalePrice } from '../../utils/format';

export default function ProductCard({ product }) {
  const { id, title, brand, thumbnail, price, discountPercentage, rating } = product;
  const salePrice = getSalePrice(price, discountPercentage);

  return (
    <li className="product-card">
      <Link to={`/products/${id}`} className="product-card__link">
        <div className="product-card__thumb">
          <img src={thumbnail} alt={title} loading="lazy" width="300" height="300" />
        </div>
        <div className="product-card__body">
          <p className="product-card__brand">{brand}</p>
          <h3 className="product-card__title">{title}</h3>
          <p className="product-card__price">
            <span className="product-card__discount">{Math.round(discountPercentage)}%</span>
            <strong>{formatPrice(salePrice)}</strong>
            <del>{formatPrice(price)}</del>
          </p>
          <p className="product-card__rating">
            <span aria-hidden="true">★</span> {rating.toFixed(1)}
          </p>
        </div>
      </Link>
    </li>
  )
}