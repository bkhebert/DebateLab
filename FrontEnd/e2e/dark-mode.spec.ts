import { test, expect } from './fixtures';

test.describe('dark mode toggle', () => {
  test('toggling applies the dark class and persists across reload', async ({ page }) => {
    // DarkModeContext falls back to prefers-color-scheme when localStorage is
    // empty; pin it to light so the initial-state assertion below is deterministic.
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const html = page.locator('html');

    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expect(html).not.toHaveClass(/dark/);
  });
});
