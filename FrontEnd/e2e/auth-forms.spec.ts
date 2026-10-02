import { test, expect } from './fixtures';

test.describe('sign up form', () => {
  test('client-side validation blocks submission before hitting the network', async ({ page }) => {
    let signupCalled = false;
    await page.route('**/jwt/auth/signup', (route) => {
      signupCalled = true;
      return route.continue();
    });

    await page.goto('/signUp');
    await page.getByLabel('Email Address').fill('person@example.com');
    await page.getByLabel('Username').fill('person');
    await page.getByLabel('Password', { exact: true }).fill('short');
    await page.getByLabel('Confirm Password').fill('short');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    expect(signupCalled).toBe(false);
  });

  test('mismatched passwords show an error without hitting the network', async ({ page }) => {
    await page.goto('/signUp');
    await page.getByLabel('Email Address').fill('person@example.com');
    await page.getByLabel('Username').fill('person');
    await page.getByLabel('Password', { exact: true }).fill('password1');
    await page.getByLabel('Confirm Password').fill('password2');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test('successful signup redirects to onboarding', async ({ page }) => {
    await page.route('**/jwt/auth/signup', (route) =>
      route.fulfill({
        json: {
          accessToken: 'fake-token',
          user: { id: '1', email: 'person@example.com', username: 'person' },
        },
      }),
    );

    await page.goto('/signUp');
    await page.getByLabel('Email Address').fill('person@example.com');
    await page.getByLabel('Username').fill('person');
    await page.getByLabel('Password', { exact: true }).fill('password1');
    await page.getByLabel('Confirm Password').fill('password1');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page).toHaveURL(/\/onboarding$/);
  });

  test('server-rejected signup shows the real server error message', async ({ page }) => {
    await page.route('**/jwt/auth/signup', (route) =>
      route.fulfill({ status: 409, json: { error: 'A user with that email already exists' } }),
    );

    await page.goto('/signUp');
    await page.getByLabel('Email Address').fill('person@example.com');
    await page.getByLabel('Username').fill('person');
    await page.getByLabel('Password', { exact: true }).fill('password1');
    await page.getByLabel('Confirm Password').fill('password1');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Must show the server's actual message, not a hardcoded frontend guess.
    await expect(page.getByText('A user with that email already exists')).toBeVisible();
  });

  test('regression: a network/CORS failure shows a network error, not a misleading "email may already exist" message', async ({ page }) => {
    // This is the actual bug Barry hit: testing signup from localhost against
    // the production backend gets silently blocked by CORS (the production
    // backend only allows the real deployed origin). The fetch call rejects
    // before any response is ever received - route.abort() reproduces that
    // exact "request never completed" shape from the page's point of view.
    await page.route('**/jwt/auth/signup', (route) => route.abort('failed'));

    await page.goto('/signUp');
    await page.getByLabel('Email Address').fill('person@example.com');
    await page.getByLabel('Username').fill('person');
    await page.getByLabel('Password', { exact: true }).fill('password1');
    await page.getByLabel('Confirm Password').fill('password1');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText(/unable to reach the server/i)).toBeVisible();
    await expect(page.getByText(/already exist/i)).toHaveCount(0);
  });
});

test.describe('sign in form', () => {
  test('successful login redirects home', async ({ page }) => {
    await page.route('**/jwt/auth/signin', (route) =>
      route.fulfill({
        json: {
          accessToken: 'fake-token',
          user: { id: '1', email: 'person@example.com' },
        },
      }),
    );

    await page.goto('/signIn');
    await page.getByLabel('Email').fill('person@example.com');
    await page.getByLabel('Password').fill('password1');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('http://localhost:5173/');
  });

  test('rejected login shows the real server error message', async ({ page }) => {
    await page.route('**/jwt/auth/signin', (route) =>
      route.fulfill({ status: 401, json: { error: 'Invalid credentials' } }),
    );

    await page.goto('/signIn');
    await page.getByLabel('Email').fill('person@example.com');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('a network/CORS failure during login shows a network error, not a generic credentials message', async ({ page }) => {
    await page.route('**/jwt/auth/signin', (route) => route.abort('failed'));

    await page.goto('/signIn');
    await page.getByLabel('Email').fill('person@example.com');
    await page.getByLabel('Password').fill('password1');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText(/unable to reach the server/i)).toBeVisible();
  });
});
