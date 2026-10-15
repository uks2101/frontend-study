import { http, HttpResponse, delay } from 'msw';
import { db } from './db';
import { getScenario } from './scenario';
import { getSalePrice } from '../utils/format';

const SORTERS = {
  latest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => getSalePrice(a.price, a.discountPercentage) - getSalePrice(b.price, b.discountPercentage),
  'price-desc': (a, b) => getSalePrice(b.price, b.discountPercentage) - getSalePrice(a.price, a.discountPercentage),
  rating: (a, b) => b.rating - a.rating,
  'created-desc': (a, b) => b.createdAt.localeCompare(a.createdAt),
  'created-asc': (a, b) => a.createdAt.localeCompare(b.createdAt),
  'title-asc': (a, b) => a.title.localeCompare(b.title),
  'title-desc': (a, b) => b.title.localeCompare(a.title),
  'stock-asc': (a, b) => a.stock - b.stock,
  'stock-desc': (a, b) => b.stock - a.stock,
};

function validateProduct(body) {
  if (!body.title?.trim() || !body.brand?.trim() || !body.category || !body.thumbnail) {
    return '필수 항목이 비어 있습니다.';
  }
  if (!(body.price > 0) || !(body.stock >= 0)) {
    return '가격과 재고를 확인해주세요.';
  }
  return null;
}

function mutationError() {
  return getScenario() === 'mutation-error'
    ? HttpResponse.json({ message: '저장에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 })
    : null;
}

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

  http.post('/api/products', async ({ request }) => {
    await delay(700);
    const failed = mutationError();
    if (failed) return failed;

    const body = await request.json();
    const invalid = validateProduct(body);
    if (invalid) return HttpResponse.json({ message: invalid }, { status: 400 });

    const product = {
      ...body,
      id: Math.max(0, ...db.products.map((p) => p.id)) + 1,
      images: body.images ?? [body.thumbnail],
      rating: 0,
      createdAt: new Date().toISOString()
    };
    db.products = [product, ...db.products];
    return HttpResponse.json(product, { status: 201 });
  }),

  http.patch('/api/products/:id', async ({ params, request }) => {
    await delay(500);
    const failed = mutationError();
    if (failed) return failed;

    const id = Number(params.id);
    const target = db.products.find((p) => p.id === id);
    if (!target) {
      return HttpResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 });
    }

    const updated = { ...target, ...(await request.json()), id };
    const invalid = validateProduct(updated);
    if (invalid) return HttpResponse.json({ message: invalid }, { status: 400 });

    db.products = db.products.map((p) => (p.id === id ? updated : p));
    return HttpResponse.json(updated);
  }),

  http.delete('/api/products/:id', async ({ params }) => {
    await delay(500);
    const failed = mutationError();
    if (failed) return failed;

    const id = Number(params.id);
    if (!db.products.some((p) => p.id === id)) {
      return HttpResponse.json({ message: '이미 삭제된 상품입니다.' }, { status: 404 });
    }

    db.products = db.products.filter((p) => p.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/api/products/bulk-delete', async ({ request }) => {
    await delay(700);
    const failed = mutationError();
    if (failed) return failed;

    const { ids } = await request.json();
    db.products = db.products.filter((p) => !ids.includes(p.id));
    return HttpResponse.json({ deleted: ids.length });
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