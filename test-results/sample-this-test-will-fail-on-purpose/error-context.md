# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sample.spec.ts >> this test will fail on purpose
- Location: tests/sample.spec.ts:14:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#does-not-exist')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#does-not-exist')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Example Domain" [level=1] [ref=e3]
  - paragraph [ref=e4]: This domain is for use in documentation examples without needing permission. Avoid use in operations.
  - paragraph [ref=e5]:
    - link "Learn more" [ref=e6] [cursor=pointer]:
      - /url: https://iana.org/domains/example
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('homepage loads', async ({ page }) => {
  4  |   await page.goto('https://example.com');
  5  |   expect(await page.title()).toBeTruthy();
  6  | });
  7  | 
  8  | test('button is visible', async ({ page }) => {
  9  |   await page.goto('https://example.com');
  10 |   const heading = page.locator('h1');
  11 |   await expect(heading).toBeVisible();
  12 | });
  13 | 
  14 | test('this test will fail on purpose', async ({ page }) => {
  15 |   await page.goto('https://example.com');
> 16 |   await expect(page.locator('#does-not-exist')).toBeVisible();
     |                                                 ^ Error: expect(locator).toBeVisible() failed
  17 | });
```