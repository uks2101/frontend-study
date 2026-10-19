import { useEffect, useRef, useState } from 'react';
import { useBlocker } from 'react-router';
import { useCategories } from '../../hooks/useCategories';
import { FIELD_ORDER, validateProductForm } from '../../utils/productForm';
import FormField from './FormField';
import ImageUpload from './ImageUpload';
import ConfirmDialog from '../common/ConfirmDialog';

export default function ProductForm({ initialValues, submitLabel, isSubmitting, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const { status: categoryStatus, data: categories } = useCategories();

  const errors = validateProductForm(values);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname && !nextLocation.state?.saved,
  );

  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(e) {
      e.preventDefault();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function errorOf(name) {
    return touched[name] || submitted ? errors[name] : undefined;
  }

  function fieldProps(name) {
    const id = `product-${name}`;
    const error = errorOf(name);
    return {
      id,
      name,
      value: values[name],
      onChange: (e) => setField(name, e.target.value),
      onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? `${id}-error` : `${id}-hint`,
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    const firstError = FIELD_ORDER.find((name) => errors[name]);
    if (firstError) {
      formRef.current.elements[`product-${firstError}`]?.focus();
      return;
    }

    onSubmit(values);
  }

  return (
    <form ref={formRef} className="product-form" noValidate onSubmit={handleSubmit}>
      <div className="product-form__grid">
        <FormField id="product-title" label="상품명" required error={errorOf('title')}>
          <input type='text' className="input" maxLength={100} {...fieldProps('title')} />
        </FormField>

        <FormField id="product-brand" label="브랜드" required error={errorOf('brand')}>
          <input type='text' className="input" {...fieldProps('brand')} />
        </FormField>

        <FormField id="product-category" label="카테고리" required error={errorOf('category')}>
          <select className="input" disabled={categoryStatus !== 'success'} {...fieldProps('category')}>
            <option value="">{categoryStatus === 'pending' ? '불러오는 중...' : '카테고리 선택'}</option>
            {categories?.map(({ slug }) => (
              <option key={slug} value={slug}>{slug.replaceAll('-', ' ')}</option>
            ))}
          </select>
        </FormField>

        <FormField id="product-price" label="가격 ($)" required error={errorOf('price')}>
          <input type="number" className="input" min="0" step="0.01" inputMode="decimal" {...fieldProps('price')} />
        </FormField>

        <FormField
          id="product-discountPercentage"
          label="할인율 (%)"
          hint="0~90 사이"
          error={errorOf('discountPercentage')}
        >
          <input type='number' className="input" min="0" max="90" inputMode="decimal" {...fieldProps('discountPercentage')} />
        </FormField>

        <FormField id="product-stock" label="재고" required error={errorOf('stock')}>
          <input type="number" className="input" min="0" step="1" inputMode="numeric" {...fieldProps('stock')} />
        </FormField>
      </div>

      <FormField
        id="product-description"
        label="상품 설명"
        required
        hint={`${values.description.trim().length}자 (10자 이상)`}
        error={errorOf('description')}
      >
        <textarea className="input" rows={5} {...fieldProps('description')} />
      </FormField>

      <FormField id="product-thumbnail" label="대표 이미지" required error={errorOf('thumbnail')}>
        <ImageUpload
          id="product-thumbnail"
          value={values.thumbnail}
          invalid={Boolean(errorOf('thumbnail'))}
          onChange={(dataUrl) => {
            setField('thumbnail', dataUrl);
            setTouched((prev) => ({ ...prev, thumbnail: true }));
          }}
        />
      </FormField>

      <div className="product-form__actions">
        <button type='button' className="btn" onClick={onCancel}>취소</button>
        <button type='submit' className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : submitLabel}
        </button>
      </div>

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        title="작성 중인 내용이 있어요"
        description="페이지를 나가면 입력한 내용이 저장되지 않습니다."
        confirmLabel="나가기"
        onConfirm={() => blocker.proceed()}
        onCancel={() => blocker.reset()}
      />
    </form>
  )
}