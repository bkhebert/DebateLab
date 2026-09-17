import { test, expect } from './fixtures';

// HamburgerMenu is the only nav on small screens (sidebars are `hidden` below
// lg:). This overrides the viewport for just this file, matching what the
// audit flagged as the app's real mobile nav path.
test.use({ viewport: { width: 390, height: 844 } });

test.describe('mobile hamburger navigation', () => {
  test('menu is closed by default and opens on click', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveCount(0);

    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  });

  test('selecting a link navigates and closes the menu', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('link', { name: 'Debates', exact: true }).click();

    await expect(page).toHaveURL(/\/debates$/);
    await expect(page.getByRole('link', { name: 'Debates', exact: true })).toHaveCount(0);
  });
});
