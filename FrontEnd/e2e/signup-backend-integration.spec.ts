import { test, expect } from '@playwright/test';

/**
 * Real integration test against a LIVE backend - deliberately NOT mocked.
 *
 * Every other auth test in this suite (auth-forms.spec.ts) mocks the network
 * entirely, which is correct for testing the frontend's own logic in
 * isolation, but it means those tests can never catch a real backend/CORS
 * misconfiguration - mocking bypasses the actual HTTP request and the
 * browser's CORS enforcement completely.
 *
 * This is exactly what happened: Barry filled out the real signup form with
 * fresh data and got "Failed to create account. Email may already exist." -
 * every existing mocked test passed throughout, because none of them ever
 * made a real request. The actual cause was the production backend's CORS
 * policy rejecting requests from localhost (it only allows the real deployed
 * frontend origin). This file tests the real HTTP layer so that class of bug
 * gets caught here instead of by a confused user.
 *
 * Targets http://localhost:3000 by default (your local backend) - override
 * with TEST_BACKEND_URL if you specifically want to check another instance.
 * NEVER point this at the production backend in routine use: it creates a
 * real user row with throwaway data on every run.
 *
 * Requires: the local backend running with a reachable database (see
 * BackEnd/CLAUDE.md for local dev setup). Runs as part of the normal
 * `npm run test:e2e`, but the beforeAll health check below skips this whole
 * file gracefully (not a failure) if the backend isn't reachable, so it
 * won't break the rest of the suite for anyone who hasn't started it.
 * To run just this file: npx playwright test signup-backend-integration
 */

const BACKEND_URL = process.env.TEST_BACKEND_URL || 'http://localhost:3000';
const DEV_ORIGIN = 'http://localhost:5173';

test.describe('signup - real backend integration', () => {
  test.beforeAll(async ({ request }) => {
    const health = await request.get(BACKEND_URL).catch(() => null);
    test.skip(
      !health || !health.ok(),
      `Backend not reachable at ${BACKEND_URL} - start it with "npm run dev" in BackEnd/ before running this test.`,
    );
  });

  test('a fresh signup succeeds end-to-end and the response allows the local dev origin via CORS', async ({ request }) => {
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const response = await request.post(`${BACKEND_URL}/jwt/auth/signup`, {
      headers: {
        'Content-Type': 'application/json',
        Origin: DEV_ORIGIN,
      },
      data: {
        email: `playwright_test_${unique}@example.com`,
        password: 'testpassword123',
        username: `pw_test_${unique}`,
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.accessToken).toBeTruthy();
    expect(body.user.email).toBe(`playwright_test_${unique}@example.com`);

    // This is the exact header a real browser checks before letting the
    // page's JS read the response. If this is missing or wrong for the
    // calling origin, the frontend's fetch() throws "Failed to fetch" and
    // the user sees a network-error message (see auth-forms.spec.ts's CORS
    // regression test) - or, before that fix, the misleading "may already
    // exist" message this test suite exists to prevent recurring.
    expect(response.headers()['access-control-allow-origin']).toBe(DEV_ORIGIN);
  });

  test('signing up twice with the same email correctly fails as a real duplicate (not a CORS false-positive)', async ({ request }) => {
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const payload = {
      email: `playwright_dup_${unique}@example.com`,
      password: 'testpassword123',
      username: `pw_dup_${unique}`,
    };
    const headers = { 'Content-Type': 'application/json', Origin: DEV_ORIGIN };

    const first = await request.post(`${BACKEND_URL}/jwt/auth/signup`, { headers, data: payload });
    expect(first.status()).toBe(201);

    const second = await request.post(`${BACKEND_URL}/jwt/auth/signup`, { headers, data: payload });
    expect(second.status()).toBe(400);
    const body = await second.json();
    expect(body.error).toMatch(/already exists/i);
  });

  test('signup rejects a too-short password with a specific, real error message', async ({ request }) => {
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const response = await request.post(`${BACKEND_URL}/jwt/auth/signup`, {
      headers: { 'Content-Type': 'application/json', Origin: DEV_ORIGIN },
      data: {
        email: `playwright_short_${unique}@example.com`,
        password: 'short',
        username: `pw_short_${unique}`,
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/at least 6 characters/i);
  });
});
