import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

// Training Mode requires a signed-in user. There's no existing e2e pattern
// for "already logged in" (every other spec tests the login flow itself),
// so this seeds sessionStorage with a fake token before the app's first
// script runs and mocks the verify-on-mount call AuthContext makes - see
// src/contexts/AuthContext.tsx's checkAuth() for the exact contract this
// mirrors ({user: ...} shape, Bearer token header).
async function loginAs(page: Page, user: { id: number; username: string; email: string }) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('debatelab_jwt_token', 'fake-token');
  });
  await page.route('**/jwt/auth/verify', (route) =>
    route.fulfill({ json: { user } }),
  );
  await page.route('**/api/training/history', (route) =>
    route.fulfill({ json: [] }),
  );
}

const FAKE_USER = { id: 1, username: 'trainee', email: 'trainee@example.com' };

test.describe('training mode - signed out', () => {
  test('shows a sign-in prompt instead of the debate setup form', async ({ page }) => {
    await page.goto('/training');
    await expect(page.getByText('Sign in to start a practice debate.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByPlaceholder('e.g. Social media does more harm than good')).toHaveCount(0);
  });
});

test.describe('training mode - signed in', () => {
  test('Start Debate stays disabled until a topic and opening argument are both filled', async ({ page }) => {
    await loginAs(page, FAKE_USER);
    await page.goto('/training');

    const startButton = page.getByRole('button', { name: 'Start Debate' });
    await expect(startButton).toBeDisabled();

    await page.getByPlaceholder('e.g. Social media does more harm than good').fill('Remote work should replace offices');
    await expect(startButton).toBeDisabled();

    await page.getByPlaceholder('Make your opening case...').fill('Remote work measurably improves focus and cuts commute-driven burnout.');
    await expect(startButton).toBeEnabled();
  });

  test('starting a debate shows the AI taking the opposite stance', async ({ page }) => {
    await loginAs(page, FAKE_USER);
    await page.route('**/api/training/start', (route) =>
      route.fulfill({ json: { debateId: 'debate-1', aiStance: 'for', reply: 'Offices enable spontaneous collaboration that remote work cannot replicate.' } }),
    );

    await page.goto('/training');
    await page.getByPlaceholder('e.g. Social media does more harm than good').fill('Remote work should replace offices');
    await page.getByRole('button', { name: 'Against', exact: true }).click();
    await page.getByPlaceholder('Make your opening case...').fill('Remote work measurably improves focus and cuts commute-driven burnout.');
    await page.getByRole('button', { name: 'Start Debate' }).click();

    await expect(page.getByText('Offices enable spontaneous collaboration that remote work cannot replicate.')).toBeVisible();
    // User argued Against, so the header must show the AI as For - never the user's own side.
    await expect(page.getByText(/AI:\s*for/i)).toBeVisible();
  });

  test('a 429 from starting a debate shows a friendly daily-limit message, not a generic error', async ({ page }) => {
    await loginAs(page, FAKE_USER);
    await page.route('**/api/training/start', (route) =>
      route.fulfill({ status: 429, json: { error: 'Daily limit reached.', retryAfterSeconds: 3600 } }),
    );

    await page.goto('/training');
    await page.getByPlaceholder('e.g. Social media does more harm than good').fill('Universal healthcare');
    await page.getByPlaceholder('Make your opening case...').fill('Universal healthcare reduces per-capita costs in every country that has it.');
    await page.getByRole('button', { name: 'Start Debate' }).click();

    await expect(page.getByText(/used all 3 practice debates for today/i)).toBeVisible();
    await expect(page.getByText(/1h 0m/)).toBeVisible();
  });

  test('ending a debate renders the evaluation report', async ({ page }) => {
    await loginAs(page, FAKE_USER);
    await page.route('**/api/training/start', (route) =>
      route.fulfill({ json: { debateId: 'debate-2', aiStance: 'against', reply: 'Opening rebuttal from the AI.' } }),
    );
    await page.route('**/api/training/grade', (route) =>
      route.fulfill({
        json: {
          overallScore: 88,
          categories: {
            argumentStructure: 9, logicalReasoning: 8, evidence: 8, rebuttal: 9, responsiveness: 9,
            counterarguments: 8, clarity: 9, consistency: 9, persuasiveness: 8,
          },
          strengths: ['Strong opening thesis'],
          weaknesses: ['Could cite more evidence'],
          improvements: ['Address counterarguments earlier'],
          fallacies: [],
          bestMoment: { quote: 'The opening line', explanation: 'Set up the whole argument well.' },
          weakestMoment: { quote: 'A vague claim', explanation: 'Lacked support.', betterApproach: 'Cite a specific example.' },
          summary: 'A strong performance overall.',
        },
      }),
    );

    await page.goto('/training');
    await page.getByPlaceholder('e.g. Social media does more harm than good').fill('Space exploration funding');
    await page.getByPlaceholder('Make your opening case...').fill('Space exploration funding drives technological spillover into everyday life.');
    await page.getByRole('button', { name: 'Start Debate' }).click();

    await expect(page.getByRole('button', { name: 'End Debate & Get Evaluation' })).toBeEnabled();
    await page.getByRole('button', { name: 'End Debate & Get Evaluation' }).click();

    await expect(page.getByText('Your Debate Report')).toBeVisible();
    await expect(page.getByText('88')).toBeVisible();
    await expect(page.getByText('A strong performance overall.')).toBeVisible();
  });
});
