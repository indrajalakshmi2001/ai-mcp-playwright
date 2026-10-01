import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.use({ baseURL: 'https://qademo.com' });

const productSlug = 'bluetooth-speaker';

test('GET Product Details', async ({ request }) => {
  const response = await request.get(`/api/products/${productSlug}`, { headers: { 'X-Session-ID': `playwright-${randomUUID()}` } });
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.data).toEqual(expect.objectContaining({ id: expect.any(Number), slug: productSlug, name: 'Bluetooth Speaker', price: expect.any(Number), stock: expect.any(Number) }));
});
