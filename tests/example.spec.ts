import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.use({ baseURL: 'https://qademo.com' });

test('GET Products', async ({ request }) => {
  const response = await request.get('/api/products', { headers: { 'X-Session-ID': `playwright-${randomUUID()}` } });
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);
  expect(body.data[0]).toEqual(expect.objectContaining({ id: expect.any(Number), slug: expect.any(String), name: expect.any(String), price: expect.any(Number) }));
});
