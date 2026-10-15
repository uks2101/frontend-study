export const EMPTY_PRODUCT_FORM = {
  title: '',
  brand: '',
  category: '',
  description: '',
  price: '',
  discountPercentage: '0',
  stock: '',
  thumbnail: ''
};

export const FIELD_ORDER = Object.keys(EMPTY_PRODUCT_FORM);

export function toFormValues(product) {
  return {
    title: product.title,
    brand: product.brand,
    category: product.category,
    description: product.description,
    price: String(product.price),
    discountPercentage: String(product.discountPercentage),
    stock: String(product.stock),
    thumbnail: product.thumbnail
  };
}

export function validateProductForm(values) {
  const errors = {};
  const price = Number(values.price);
  const discount = Number(values.discountPercentage);
  const stock = Number(values.stock);

  if (!values.title.trim()) errors.title = '상품명을 입력해주세요.';
  else if (values.title.trim().length > 100) errors.title = '상품명은 100자 이하로 입력해주세요.';

  if (!values.brand.trim()) errors.brand = '브랜드를 입력해주세요.';
  if (!values.category) errors.category = '카테고리를 선택해주세요.';

  if (values.description.trim().length < 10) errors.description = '상품 설명을 10자 이상 입력해주세요.';

  if (values.price === '') errors.price = '가격을 입력해주세요.';
  else if (!(price > 0)) errors.price = '가격은 0보다 커야 합니다.';

  if (values.discountPercentage === '' || discount < 0 || discount > 90) {
    errors.discountPercentage = '할인율은 0~90% 사이로 입력해주세요.';
  }

  if (values.stock === '') errors.stock = '재고를 입력해주세요.';
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = '재고는 0 이상의 정수로 입력해주세요.';

  if (!values.thumbnail) errors.thumbnail = '대표 이미지를 등록해주세요.';

  return errors;
}

export function toProductPayload(values, original) {
  const isSameImage = original && original.thumbnail === values.thumbnail;

  return {
    title: values.title.trim(),
    brand: values.brand.trim(),
    category: values.category,
    description: values.description.trim(),
    price: Number(values.price),
    discountPercentage: Number(values.discountPercentage),
    stock: Number(values.stock),
    thumbnail: values.thumbnail,
    images: isSameImage ? original.images : [values.thumbnail]
  };
}