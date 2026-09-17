import { test, expect } from './fixtures';

// This is the flagship feature and the audit's #1 flagged risk: it depends on
// an exact backend JSON shape with no runtime validation, and the gauge's
// fill animation is hardcoded to `percentage * 0.75`. This test locks in
// today's happy-path behavior against a controlled mock response so a visual
// refactor (fonts, spacing, the textarea's CSS) can't silently break the
// data flow without a failing test.
test.describe('fallacy checker (ArgumentForm)', () => {
  test('submitting an argument shows the analysis breakdown', async ({ page }) => {
    await page.route('**/api/ai/fact', (route) =>
      route.fulfill({
        json: {
          factCheckedMessage: 'This is the revised, more careful version of the argument.',
          factCheckedStatement: 'Removed an unsupported generalization.',
          listOfFallacies: ['Straw Man Fallacy'],
          percentage: 40,
        },
      }),
    );

    await page.goto('/analyzer');

    await page.locator('textarea#argument').fill('Everyone who disagrees with me is obviously an idiot.');
    await page.getByRole('button', { name: 'Analyze' }).click();

    await expect(page.getByText('Argument submitted for analysis!')).toBeVisible();

    // GaugeComponent animates the ring fill 1%/100ms up to floor(percentage*0.75);
    // give it room to finish before asserting on the final displayed number.
    await expect(page.getByText('40 %')).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText('Straw Man Fallacy').first()).toBeVisible();
    await expect(
      page.getByText('This is the revised, more careful version of the argument.'),
    ).toBeVisible();
    await expect(page.getByText('Removed an unsupported generalization.')).toBeVisible();
  });

  test('the character counter enforces the 500 character limit', async ({ page }) => {
    await page.goto('/analyzer');
    const textarea = page.locator('textarea#argument');
    await textarea.fill('a'.repeat(500));

    await expect(page.getByText('500/500 characters')).toBeVisible();

    // The component ignores keystrokes past the limit rather than truncating.
    await textarea.pressSequentially('b');
    await expect(page.getByText('500/500 characters')).toBeVisible();
    await expect(textarea).toHaveValue('a'.repeat(500));
  });

  test('accepting the original post submits it and closes the panel', async ({ page }) => {
    await page.route('**/api/ai/fact', (route) =>
      route.fulfill({
        json: {
          factCheckedMessage: 'Revised message',
          factCheckedStatement: 'Reason',
          listOfFallacies: [],
          percentage: 10,
        },
      }),
    );
    let acceptedPayload: unknown;
    await page.route('**/api/message/', (route) => {
      acceptedPayload = route.request().postDataJSON();
      return route.fulfill({ json: { id: 'new-post' } });
    });

    await page.goto('/analyzer');
    await page.locator('textarea#argument').fill('An argument with no fallacies.');
    await page.getByRole('button', { name: 'Analyze' }).click();

    // Not asserting on the gauge's displayed percentage here: GaugeComponent's
    // floor(floor(percentage*0.75)/0.75) math doesn't round-trip for every
    // input (e.g. 10 displays as "9 %") - a separate bug, not this test's concern.
    const acceptButton = page.getByRole('button', { name: 'Accept Original Post' });
    await expect(acceptButton).toBeVisible();
    await acceptButton.click();

    await expect(page.getByText('Original Message')).toHaveCount(0);
    expect(acceptedPayload).toMatchObject({
      content: { argument: 'An argument with no fallacies.' },
    });
  });
});
