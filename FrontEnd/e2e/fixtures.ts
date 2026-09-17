import { test as base, expect } from '@playwright/test';

// The app always points at the deployed Render backend in committed code
// (see src/constants/constant.ts `isDevelopment`), so every test gets a
// read-only stub for the feed endpoints hit on mount. This keeps smoke/nav
// tests hermetic and fast instead of depending on a live production API.
// Individual tests can call page.route(...) again before navigating to
// override any of these with scenario-specific data.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/api/message/all/recent', (route) =>
      route.fulfill({ json: [] }),
    );
    await page.route('**/api/message/*', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: [] });
      }
      return route.continue();
    });

    await use(page);
  },
});

export { expect };
