import { test, expect } from './fixtures';

// LeftSideBar is only rendered at lg: (1024px+); default desktop viewport
// from playwright.config.ts already satisfies that. Header also renders its
// own "Sign up"/"Log in" links at this width, so scope to <aside> (the
// sidebar) to avoid ambiguous matches between the two.
test.describe('desktop sidebar navigation', () => {
  test('Sign Up link navigates to the sign-up page', async ({ page }) => {
    await page.goto('/');
    await page.locator('aside').getByRole('link', { name: 'Sign Up', exact: true }).click();
    await expect(page).toHaveURL(/\/signUp$/);
    await expect(page.getByRole('heading', { name: 'Create Your Account' })).toBeVisible();
  });

  test('Log In link navigates to the sign-in page', async ({ page }) => {
    await page.goto('/');
    await page.locator('aside').getByRole('link', { name: 'Log In', exact: true }).click();
    await expect(page).toHaveURL(/\/signIn$/);
    await expect(page.getByText('Login to your account', { exact: true })).toBeVisible();
  });

  test('Analyze link navigates to the fallacy checker', async ({ page }) => {
    await page.goto('/');
    await page.locator('aside').getByRole('link', { name: 'Analyze', exact: true }).click();
    await expect(page).toHaveURL(/\/analyzer$/);
    await expect(page.locator('textarea#argument')).toBeVisible();
  });

  test('Debates link navigates to the debates page', async ({ page }) => {
    await page.goto('/');
    await page.locator('aside').getByRole('link', { name: 'Debates', exact: true }).click();
    await expect(page).toHaveURL(/\/debates$/);
  });

  test('Home link returns to the home page from elsewhere', async ({ page }) => {
    await page.goto('/debates');
    await page.locator('aside').getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});
