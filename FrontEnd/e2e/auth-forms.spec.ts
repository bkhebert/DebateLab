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

  test('server-rejected signup shows an error message', async ({ page }) => {
    await page.route('**/jwt/auth/signup', (route) =>
      route.fulfill({ status: 409, json: { error: 'Email already exists' } }),
    );

    await page.goto('/signUp');
    await page.getByLabel('Email Address').fill('person@example.com');
    await page.getByLabel('Username').fill('person');
    await page.getByLabel('Password', { exact: true }).fill('password1');
    await page.getByLabel('Confirm Password').fill('password1');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Failed to create account. Email may already exist.')).toBeVisible();
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

  test('rejected login shows an error message', async ({ page }) => {
    await page.route('**/jwt/auth/signin', (route) =>
      route.fulfill({ status: 401, json: { error: 'Invalid credentials' } }),
    );

    await page.goto('/signIn');
    await page.getByLabel('Email').fill('person@example.com');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });
});
