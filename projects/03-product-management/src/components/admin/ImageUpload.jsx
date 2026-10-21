import { useState } from 'react';

const MAX_SIZE = 2 * 1024 * 1024;

export default function ImageUpload({ id, value, onChange, invalid = false }) {
  const [fileError, setFileError] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('이미지 파일만 올릴 수 있습니다.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileError('2MB 이하의 이미지만 올릴 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileError(null);
      onChange(reader.result);
    };
    reader.onerror = () => setFileError('이미지를 읽지 못했습니다. 다시 시도해주세요.');
    reader.readAsDataURL(file);
  }

  return (
    <div className="image-upload">
      <div className="image-upload__preview">
        {value ? <img src={value} alt="대표 이미지 미리보기" /> : <span>이미지 없음</span>}
      </div>

      <div className="image-upload__controls">
        <input
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-invalid={invalid || Boolean(fileError)}
          aria-describedby={`${id}-error ${id}-file-error`}
          onChange={handleFileChange}
        />
        <label htmlFor={id} className="btn btn--sm">
          {value ? '이미지 변경' : '이미지 선택'}
        </label>
        {value && (
          <button type="button" className="btn btn--sm" onClick={() => onChange('')}>
            삭제
          </button>
        )}
        <p className="form-field__hint">JPG, PNG, WEBP · 2MB 이하</p>
        {fileError && (
          <p id={`${id}-file-error`} className="form-field__error" role="alert">
            {fileError}
          </p>
        )}
      </div>
    </div>
  );
}
