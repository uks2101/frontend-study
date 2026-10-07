import { http, HttpResponse, delay } from 'msw';
import { db } from './db';
import { getScenario } from './scenario';

export const handlers = [
  http.get('/api/products', async () => {
    await delay(500);

    const scenario = getScenario();
    if (scenario === 'error') {
      return HttpResponse.json({ message: '서버에 문제가 발생했습니다.' }, { status: 500 });
    }

    const products = scenario === 'empty' ? [] : db.products;
    return HttpResponse.json({
      products,
      total: products.length
    });
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