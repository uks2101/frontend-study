import { useState } from 'react';

export default function ImageGallery({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="gallery">
      <div className="gallery__main">
        <img
          src={images[selectedIndex]}
          alt={`${title} 이미지 ${selectedIndex + 1}`}
          width="600"
          height="600"
        />
      </div>

      {images.length > 1 && (
        <ul className="gallery__thumbs">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                className="gallery__thumb"
                aria-label={`${index + 1}번째 이미지 보기`}
                aria-current={index === selectedIndex}
                onClick={() => setSelectedIndex(index)}
              >
                <img src={image} alt="" width="80" height="80" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
