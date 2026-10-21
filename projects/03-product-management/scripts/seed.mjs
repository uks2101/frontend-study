import { writeFile, mkdir } from 'node:fs/promises';

const res = await fetch('https://dummyjson.com/products?limit=0');
if (!res.ok) throw new Error(`데이터 요청 실패: ${res.status}`);
const { products } = await res.json();

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

const trimmed = products.map((p, i) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  category: p.category,
  brand: p.brand ?? '기타',
  price: p.price,
  discountPercentage: p.discountPercentage,
  rating: p.rating,
  stock: p.stock,
  thumbnail: p.thumbnail,
  images: p.images,
  createdAt: new Date(now - i * DAY).toISOString(),
}));

await mkdir('src/mocks/data', { recursive: true });
await writeFile('src/mocks/data/products.json', JSON.stringify(trimmed, null, 2));

console.log(`✅ 상품 ${trimmed.length}개 저장 완료`);
