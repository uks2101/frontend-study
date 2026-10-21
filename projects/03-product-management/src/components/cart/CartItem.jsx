import { Link } from 'react-router';
import { formatPrice, getSalePrice } from '../../utils/format';
import QuantitySelector from '../product-detail/QuantitySelector';
import { useCartStore } from '../../store/cart/cartStore';
import { toast } from '../../store/toast/toastStore';

export default function CartItem({ item, index }) {
  const { id, title, brand, thumbnail, price, discountPercentage, stock, quantity, checked } = item;
  const { toggleItem, updateQuantity, removeItem, restoreItem } = useCartStore.getState();
  const salePrice = getSalePrice(price, discountPercentage);

  function handleRemove() {
    removeItem(id);
    toast.info(`${title}을(를) 삭제했습니다.`, {
      action: { label: '실행 취소', onClick: () => restoreItem(item, index) },
    });
  }

  return (
    <li className="cart-item">
      <input
        type="checkbox"
        className="cart-item__check"
        checked={checked}
        onChange={() => toggleItem(id)}
        aria-label={`${title} 선택`}
      />

      <Link to={`/products/${id}`} className="cart-item__thumb" tabIndex={-1} aria-hidden="true">
        <img src={thumbnail} alt="" width="96" height="96" />
      </Link>

      <div className="cart-item__info">
        <p className="cart-item__brand">{brand}</p>
        <Link to={`/products/${id}`} className="cart-item__title">
          {title}
        </Link>
        <p className="cart-item__price">
          {formatPrice(salePrice)} <del>{formatPrice(price)}</del>
        </p>
        {quantity >= stock && <p className="cart-item__notice">최대 구매 가능 수량입니다.</p>}
      </div>

      <QuantitySelector
        value={quantity}
        max={stock}
        onChange={(next) => updateQuantity(id, next)}
      />

      <p className="cart-item__total">{formatPrice(salePrice * quantity)}</p>

      <button
        type="button"
        className="cart-item__remove"
        aria-label={`${title} 삭제`}
        onClick={handleRemove}
      >
        ×
      </button>
    </li>
  );
}
