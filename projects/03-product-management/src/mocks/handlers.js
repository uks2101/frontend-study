import { http, HttpResponse, delay } from 'msw';
import { db } from './db';
import { getScenario } from './scenario';
import { getSalePrice } from '../utils/format';

const SORTERS = {
  latest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => getSalePrice(a.price, a.discountPercentage) - getSalePrice(b.price, b.discountPercentage),
  'price-desc': (a, b) => getSalePrice(b.price, b.discountPercentage) - getSalePrice(a.price, a.discountPercentage),
  rating: (a, b) => b.rating - a.rating,
};

export const handlers = [
  http.get('/api/products', async ({ request }) => {
    await delay(500);

    const scenario = getScenario();
    if (scenario === 'error') {
      return HttpResponse.json({ message: '서버에 문제가 발생했습니다.' }, { status: 500 });
    }
    if (scenario === 'empty') {
      return HttpResponse.json({ products: [], total: 0, page: 1, totalPages: 0 });
    }

    const params = new URL(request.url).searchParams;
    const q = (params.get('q') ?? '').trim().toLowerCase();
    const categories = params.getAll('category');
    const minPrice = params.has('minPrice') ? Number(params.get('minPrice')) : null;
    const maxPrice = params.has('maxPrice') ? Number(params.get('maxPrice')) : null;
    const sort = params.get('sort') ?? 'latest';
    const page = Math.max(1, Number(params.get('page')) || 1);
    const limit = Math.max(1, Number(params.get('limit')) || 20);

    const filtered = db.products
    .filter((p) => !q || p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    .filter((p) => categories.length === 0 || categories.includes(p.category))
    .filter((p) => {
      const salePrice = getSalePrice(p.price, p.discountPercentage);
      if (minPrice !== null && salePrice < minPrice) return false;
      if (maxPrice !== null && salePrice > maxPrice) return false;
      return true;
    })
    .toSorted(SORTERS[sort] ?? SORTERS.latest);

    const start = (page - 1) * limit;

    return HttpResponse.json({
      products: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  http.get('/api/products/:id', async ({ params }) => {
    await delay(300);
    const product = db.products.find((p) => p.id === Number(params.id));

    if (!product) {
      return HttpResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  http.get('/api/products/:id/related', async ({ params }) => {
    await delay(400);
    const product = db.products.find((p) => p.id === Number(params.id));

    if (!product) {
      return HttpResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 });
    }

    const related = db.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

    return HttpResponse.json(related);
  }),

  http.get('/api/categories', async () => {
    await delay(300);

    const counts = {};
    db.products.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });

    const categories = Object.entries(counts)
    .map(([slug, count]) => ({ slug, count }))
    .toSorted((a, b) => a.slug.localeCompare(b.slug));

    return HttpResponse.json(categories);
  }),
]