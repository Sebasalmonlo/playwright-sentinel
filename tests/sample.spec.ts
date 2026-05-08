import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('https://example.com');
  expect(await page.title()).toBeTruthy();
});

test('button is visible', async ({ page }) => {
  await page.goto('https://example.com');
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
});

test('this test will fail on purpose', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('#does-not-exist')).toBeVisible();
});