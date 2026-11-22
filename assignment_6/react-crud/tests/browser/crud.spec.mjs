import { test, expect } from '@playwright/test';
const api = 'https://jsonplaceholder.typicode.com/users';
const fixture = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com', address: { street: 'Old street', suite: 'Suite A', city: 'Hanoi' }, phone: '0901234567', website: '' },
  { id: 3, name: 'Ervin Howell', username: 'Antonette', email: 'ervin@example.com', address: { street: 'Second street', suite: 'Suite B', city: 'Hue' }, phone: '0912345678', website: '' }
];
test.beforeEach(async ({ page }) => {
  await page.route(api, route => route.fulfill({ json: fixture }));
});

test('loads users and searches both name and username case-insensitively', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('row')).toHaveCount(3);
  const search = page.getByRole('searchbox');
  await search.fill('lEANne');
  await expect(page.getByRole('row')).toHaveCount(2);
  await expect(page.getByRole('row').last()).toContainText('Bret');
  await search.fill('ANTON');
  await expect(page.getByRole('row').last()).toContainText('Ervin');
  await search.fill('missing');
  await expect(page.getByText('Không tìm thấy người dùng phù hợp.')).toBeVisible();
  await search.fill('');
  await expect(page.getByRole('row')).toHaveCount(3);
});

test('adds a user, cancels nested edits without mutation, saves and deletes immediately', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('./');
  await expect(page.getByRole('row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Thêm người dùng', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Họ và tên').fill('Nguyễn An');
  await dialog.getByLabel('Tên đăng nhập').fill('nguyenan');
  await dialog.getByLabel('Email').fill('an@example.com');
  await dialog.getByLabel('Đường').fill('Đường mới');
  await dialog.getByLabel('Căn hộ / số nhà').fill('Số 10');
  await dialog.getByLabel('Thành phố').fill('Đà Nẵng');
  await dialog.getByRole('button', { name: 'Thêm người dùng', exact: true }).click();
  await expect(page.getByRole('row')).toHaveCount(4);
  const row = page.getByRole('row').filter({ hasText: 'nguyenan' });
  await expect(row).toContainText('Đường mới');
  await row.getByRole('button', { name: /Sửa/ }).click();
  await dialog.getByLabel('Đường').fill('Không lưu');
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(row).toContainText('Đường mới');
  await expect(row).not.toContainText('Không lưu');
  await row.getByRole('button', { name: /Sửa/ }).click();
  await dialog.getByLabel('Đường').fill('Đường đã sửa');
  await dialog.getByRole('button', { name: 'Lưu thay đổi' }).click();
  await expect(row).toContainText('Đường đã sửa');
  await expect(row).toContainText('Số 10');
  await expect(row).toContainText('Đà Nẵng');
  await row.getByRole('button', { name: /Xóa/ }).click();
  await expect(page.getByRole('row')).toHaveCount(3);
  expect(errors).toEqual([]);
});

test('rejects whitespace-only names, closes on Escape and returns keyboard focus', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Thêm người dùng', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Họ và tên').fill('   ');
  await dialog.getByLabel('Tên đăng nhập').fill('user');
  await dialog.getByRole('button', { name: 'Thêm người dùng', exact: true }).click();
  await expect(dialog.getByRole('alert')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Thêm người dùng', exact: true })).toBeFocused();
});

test('a new user submitted during loading is consumed once after the API completes', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route(api, async route => { await gate; await route.fulfill({ json: fixture }); });
  await page.goto('./');
  await page.getByRole('button', { name: 'Thêm người dùng', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Họ và tên').fill('Pending user');
  await dialog.getByLabel('Tên đăng nhập').fill('pending');
  await dialog.getByRole('button', { name: 'Thêm người dùng', exact: true }).click();
  release();
  await expect(page.getByRole('row')).toHaveCount(4);
  await page.getByRole('searchbox').fill('pending');
  await expect(page.getByRole('row')).toHaveCount(2);
});

test('shows an API error and recovers with retry', async ({ page }) => {
  await page.route(api, route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('./');
  await expect(page.getByRole('alert')).toContainText('Không tải được');
  await page.route(api, route => route.fulfill({ json: fixture }));
  await page.getByRole('button', { name: 'Thử lại' }).click();
  await expect(page.getByRole('row')).toHaveCount(3);
});

test('mobile layout fits, and dialogs fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.getByRole('row')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Thêm người dùng', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.getByRole('dialog').evaluate(el => el.getBoundingClientRect().width <= innerWidth)).toBe(true);
});
