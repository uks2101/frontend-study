import { useState } from 'react';
import { Link } from 'react-router';
import { formatPrice, getSalePrice } from '../../utils/format';
import ImageGallery from './ImageGallery';
import QuantitySelector from './QuantitySelector';

const LOW_STOCK = 10;

export default function ProductDetail({ product }) {
  const { title, brand, category, description, images, price, discountPercentage, rating, stock } = product;
  const [quantity, setQuantity] = useState(1);

  const salePrice = getSalePrice(price, discountPercentage);
  const isSoldOut = stock === 0;

  function handleAddToCart() {
    console.log('장바구니 담기', product.id, quantity);
  }

  return (
    <article className="detail">
      <title>{`${title} | SHOP`}</title>

      <nav className="breadcrumb" aria-label='현재 위치'>
        <ol>
          <li><Link to="/">상품</Link></li>
          <li><Link to={`/?category=${category}`}>{category.replaceAll('-', ' ')}</Link></li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>

      <div className="detail__layout">
        <ImageGallery images={images} title={title} />

        <div className="detail__info">
          <p className="detail__brand">{brand}</p>
          <h1 className="detail__title">{title}</h1>
          <p className="detail__rating">
            <span aria-hidden="true">★</span> {rating.toFixed(1)}
          </p>

          <div className="detail__price">
            <span className="detail__discount">{Math.round(discountPercentage)}%</span>
            <strong>{formatPrice(salePrice)}</strong>
            <del>{formatPrice(price)}</del>
          </div>

          <p className="detail__desc">{description}</p>

          <p className={`detail__stock${stock < LOW_STOCK ? ' detail_stock--low' : ''}`}>
            {isSoldOut ? '품절' : stock < LOW_STOCK ? `품절 임박! ${stock}개 남음` : '재고 있음'}
          </p>

          <div className="detail__purchase">
            <QuantitySelector value={quantity} max={Math.max(stock, 1)} onChange={setQuantity} disabled={isSoldOut} />
            <p className="detail__total">
              총 <strong>{formatPrice(salePrice * quantity)}</strong>
            </p>
          </div>

          <button
            type='button'
            className="btn btn--primary btn--block"
            disabled={isSoldOut}
            onClick={handleAddToCart}
          >
            {isSoldOut ? '품절' : '장바구니 담기'}
          </button>
        </div>
      </div>
    </article>
  )
}