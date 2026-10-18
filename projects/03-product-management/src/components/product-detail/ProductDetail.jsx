import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useToast } from '../../store/toast/toastContext';
import { formatPrice, getSalePrice } from '../../utils/format';
import { useCart, useCartActions } from '../../store/cart/cartContext';
import ImageGallery from './ImageGallery';
import QuantitySelector from './QuantitySelector';
import { addRecentlyViewed } from '../../store/recent/recentStore';
import WishlistButton from '../product/WishlistButton';

const LOW_STOCK = 10;

export default function ProductDetail({ product }) {
  const { id, title, brand, category, description, images, price, discountPercentage, rating, stock } = product;
  const { items } = useCart();
  const { addItem } = useCartActions();
  const toast = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const salePrice = getSalePrice(price, discountPercentage);
  const isSoldOut = stock === 0;
  const inCartQuantity = items.find((item) => item.id === id)?.quantity ?? 0;
  const available = stock - inCartQuantity;
  const canAdd = available > 0;

  useEffect(() => {
    addRecentlyViewed(product);
  }, [product]);

  function handleAddToCart() {
    addItem(product, quantity);
    toast.success(`${quantity}개를 장바구니에 담았습니다.`, {
      action: { label: '장바구니 보기', onClick: () => navigate('/cart') },
    });
    setQuantity(1);
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
          <div className="detail__title-row">
            <h1 className="detail__title">{title}</h1>
            <WishlistButton product={product} />
          </div>
          <p className="detail__rating">
            <span aria-hidden="true">★</span> {rating.toFixed(1)}
          </p>

          <div className="detail__price">
            <span className="detail__discount">{Math.round(discountPercentage)}%</span>
            <strong>{formatPrice(salePrice)}</strong>
            <del>{formatPrice(price)}</del>
          </div>

          <p className="detail__desc">{description}</p>

          <p className={`detail__stock${stock < LOW_STOCK ? ' detail__stock--low' : ''}`}>
            {isSoldOut ? '품절' : stock < LOW_STOCK ? `품절 임박! ${stock}개 남음` : '재고 있음'}
          </p>

          <div className="detail__purchase">
            <QuantitySelector value={quantity} max={Math.max(available, 1)} onChange={setQuantity} disabled={!canAdd} />
            <p className="detail__total">
              총 <strong>{formatPrice(salePrice * quantity)}</strong>
            </p>
          </div>

          {inCartQuantity > 0 && (
            <p className="detail__in-cart">
              장바구니에 {inCartQuantity}개 담겨 있어요.
              {!canAdd && ' 재고만큼 모두 담았습니다.'}
            </p>
          )}

          <button
            type='button'
            className="btn btn--primary btn--block"
            disabled={!canAdd}
            onClick={handleAddToCart}
          >
            {isSoldOut ? '품절' : canAdd ? '장바구니 담기' : '최대 수량 담김'}
          </button>
        </div>
      </div>
    </article>
  )
}