import { http, HttpResponse, delay } from 'msw';
import { db } from './db';

export const handlers = [
  http.get('/api/products', async () => {
    await delay(500);
    return HttpResponse.json({
      products: db.products,
      total: db.products.length,
    })
  }),

  http.get('/api/products/:id', async ({ params }) => {
    await delay(300);
    const product = db.products.find((p) => p.id === Number(params.id));

    if (!product) {
      return HttpResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 });
    }
    return HttpResponse.json(product);
  })
]