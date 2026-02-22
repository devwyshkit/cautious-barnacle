import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: SDUI Resilience
 * Verifies that critical blocks (like Category Rail) do not collapse 
 * the UI silently when data pipelines fail.
 */

test.describe('SDUI: Resilience & Empty States', () => {

    test('Category Rail renders shell when data is missing', async ({ page }) => {
        // Intercept the home surface context to return empty categories
        await page.route('**/*home-surface-context*', async route => {
            const response = await route.fetch();
            const json = await response.json();

            // Inject empty data for categories
            json.categories = [];

            await route.fulfill({ response, json });
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // ASSERTION: The section header for "What's on your mind?" should still exist
        // due to the relaxation in BlocksEngine which allows CIRCLE_RAIL to render.
        const header = page.locator('h2', { hasText: /What's on your mind\?/i });
        await expect(header).toBeVisible();

        // The app must not crash
        const main = page.locator('main').first();
        await expect(main).toBeVisible();
    });
});
