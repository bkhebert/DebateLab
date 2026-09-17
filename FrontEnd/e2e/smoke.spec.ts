import { test, expect } from './fixtures';

// Regression net for a visual refactor: these pages must render without
// throwing, before/after any CSS or markup changes. Not asserting on visual
// details here, just "the route resolves and something reasonable is on screen".
test.describe('page loads', () => {
  test('home page renders the header and logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByAltText('DebateLab Logo').first()).toBeVisible();
  });

  test('sign in page renders the login form', async ({ page }) => {
    await page.goto('/signIn');
    // Not getByRole('heading', ...): shadcn's CardTitle renders a plain <div>,
    // not a semantic heading - a real (separate) a11y gap, not fixed here.
    await expect(page.getByText('Login to your account', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('sign up page renders the registration form', async ({ page }) => {
    await page.goto('/signUp');
    await expect(page.getByRole('heading', { name: 'Create Your Account' })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
  });

  test('analyzer page renders the fallacy checker form', async ({ page }) => {
    await page.goto('/analyzer');
    await expect(page.locator('textarea#argument')).toBeVisible();
  });

  test('debates page renders', async ({ page }) => {
    await page.goto('/debates');
    await expect(page.locator('body')).toBeVisible();
  });

  test('extension download page renders', async ({ page }) => {
    await page.goto('/extension');
    await expect(page.locator('body')).toBeVisible();
  });

  test('the great conversation page renders', async ({ page }) => {
    await page.goto('/thegreatconversation');
    await expect(page.locator('body')).toBeVisible();
  });

  test('unknown route does not crash the app shell', async ({ page }) => {
    // There's no catch-all <Route path="*">, documented in the audit as a
    // known gap (e.g. MagicBoxIntro links to the wrong-case /signup). This
    // pins today's behavior (blank routed area, header/sidebar still render)
    // so a future fix is a deliberate change, not a silent regression.
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByAltText('DebateLab Logo').first()).toBeVisible();
  });
});
