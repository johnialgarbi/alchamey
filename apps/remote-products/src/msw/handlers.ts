import { http, HttpResponse } from 'msw';
import { generateProducts } from '../api/mockProducts';

// MSW (Mock Service Worker) request handlers.
export const handlers = [
  http.get('/api/products', async () => {
    const data = generateProducts(2000);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return HttpResponse.json(data);
  }),
];
