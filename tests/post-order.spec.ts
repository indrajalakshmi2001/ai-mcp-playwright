import { APIRequestContext, expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.use({ baseURL: 'https://qademo.com' });

async function createTemporaryAccount(request: APIRequestContext) {
  const id = randomUUID().replaceAll('-', '');
  const phoneDigits = [...id].map(character => String(parseInt(character, 16) % 10)).join('');
  const account = { email: `api-${id}@example.com`, phone: `+1555${phoneDigits.slice(0, 7)}`, username: `api${id.slice(0, 12)}`, password: `Api${id.slice(12, 24)}!1` };
  const response = await request.post('/api/auth/signup', { headers: { 'X-Session-ID': `playwright-${id}` }, data: account });
  const body = await response.json();
  expect(response.ok(), JSON.stringify(body)).toBeTruthy();
  expect(body.success).toBe(true);
  return { username: account.username, password: account.password };
}

async function authenticate(request: APIRequestContext, username: string, password: string) {
  const sessionId = `playwright-${randomUUID()}`;
  const response = await request.post('/api/auth/login', { headers: { 'X-Session-ID': sessionId }, data: { username, password } });
  const body = await response.json();
  expect(response.ok(), JSON.stringify(body)).toBeTruthy();
  expect(body.success).toBe(true);
  return { sessionId, token: body.data.accessToken as string };
}

test('POST Order', async ({ request }) => {
  const account = await createTemporaryAccount(request);
  const { sessionId, token } = await authenticate(request, account.username, account.password);
  const headers = { Authorization: `Bearer ${token}`, 'X-Session-ID': sessionId };
  const productsResponse = await request.get('/api/products', { headers });
  expect(productsResponse.ok()).toBeTruthy();
  const productsBody = await productsResponse.json();
  const product = productsBody.data.find((item: { stock: number }) => item.stock > 0);
  expect(product).toBeTruthy();
  const cartResponse = await request.post('/api/cart/items', { headers, data: { productId: product.id, quantity: 1 } });
  expect(cartResponse.ok()).toBeTruthy();
  const response = await request.post('/api/orders', { headers, data: { shipping: { firstName: 'QA', lastName: 'Tester', address: '1 Test Street, London' }, payment: { cardNumber: '4242424242424242', expiryDate: '12/30', cvv: '123', cardholderName: 'QA Tester' } } });
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.data).toEqual(expect.objectContaining({ id: expect.anything() }));
});
