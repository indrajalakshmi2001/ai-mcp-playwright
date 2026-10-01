import { APIRequestContext, expect, Page, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.use({ baseURL: 'https://qademo.com' });

async function createTemporaryAccount(request: APIRequestContext) {
  const id = randomUUID().replaceAll('-', '');
  const phoneDigits = [...id].map(character => String(parseInt(character, 16) % 10)).join('');
  const account = { email: `pw-${id}@example.com`, phone: `+1555${phoneDigits.slice(0, 7)}`, username: `pw${id.slice(0, 12)}`, password: `Pw${id.slice(12, 24)}!1` };
  const response = await request.post('/api/auth/signup', { headers: { 'X-Session-ID': `playwright-${id}` }, data: account });
  const body = await response.json();
  expect(response.ok(), JSON.stringify(body)).toBeTruthy();
  expect(body.success, JSON.stringify(body)).toBe(true);
  return account;
}

class LoginPage {
  readonly username = this.page.getByRole('textbox', { name: 'Username or email' });
  readonly password = this.page.getByRole('textbox', { name: 'Password' });
  readonly signIn = this.page.getByTestId('login-submit-button');
  constructor(private readonly page: Page) {}
  async open() { await this.page.goto('/login'); }
  async signInAs(username: string, password: string) { await this.username.fill(username); await this.password.fill(password); await this.signIn.click(); }
}

class ProductPage {
  readonly addToCart = this.page.getByRole('button', { name: /Add .* to cart/ });
  constructor(private readonly page: Page) {}
  async selectAvailableProduct() {
    await this.page.getByRole('link', { name: 'View products' }).click();
    await this.page.getByRole('link', { name: 'View Bluetooth Speaker', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Bluetooth Speaker' })).toBeVisible();
    await expect(this.addToCart).toBeEnabled();
  }
}

class CheckoutPage {
  constructor(private readonly page: Page) {}
  async completePurchase() {
    await expect(this.page.getByTestId('checkout-heading')).toBeVisible();
    await this.page.getByLabel('First name').fill('QA');
    await this.page.getByLabel('Last name').fill('Tester');
    await this.page.getByLabel('Shipping address').fill('1 Test Street, London');
    await this.page.getByLabel('Card number').fill('4242424242424242');
    await this.page.getByLabel('Expiry date').fill('12/30');
    await this.page.getByLabel('CVV').fill('123');
    await this.page.getByLabel('Name on card').fill('QA Tester');
    await this.page.getByRole('button', { name: /Place order/ }).click();
  }
}

test('Login, select available product, add to cart, checkout, and successfully complete purchase', async ({ page, request }) => {
  const account = await createTemporaryAccount(request);
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.signInAs(account.username, account.password);
  await expect(page.getByTestId('navbar-user-menu')).toBeVisible();
  const productPage = new ProductPage(page);
  await productPage.selectAvailableProduct();
  const addToCartResponse = page.waitForResponse(response => response.url().includes('/api/cart/items') && response.request().method() === 'POST');
  await productPage.addToCart.click();
  await addToCartResponse;
  await page.getByRole('link', { name: /Shopping cart with 1 item/ }).click();
  await expect(page.getByRole('heading', { name: /Your Cart|Shopping Cart/ })).toBeVisible();
  await page.goto('/checkout');
  await new CheckoutPage(page).completePurchase();
  await expect(page).toHaveURL(/\/orders\//);
  await expect(page.getByText(/order confirmation|order placed|thank you/i)).toBeVisible();
});
