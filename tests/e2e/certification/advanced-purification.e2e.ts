import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: Phase 8 - Advanced Anti-Pattern Audits
 * Enforces Zero Reinvention, DRY, and Edge Case resilience.
 */

test.describe('Phase 8: Edge Case & Anti-Pattern Certification', () => {

    test('Version Skew Tolerance (Stale JS Handling)', async ({ page }) => {
        // Mock a backend response that includes a new SDUI Block Type (`FUTURE_BLOCK`)
        // that the current React frontend bundle doesn't know how to render.
        // A robust "Zero Overengineering" system should just quietly ignore unknown blocks,
        // rather than crashing the page with a White Screen of Death.

        await page.route('**/*home-surface-context*', async route => {
            const response = await route.fetch();
            const json = await response.json();

            // Inject a futuristic unknown block
            json.sections.unshift({
                id: 'future_block_id',
                type: 'FUTURE_HOLOGRAM_RAIL',
                title: 'Holograms from 2027',
                data: []
            });

            await route.fulfill({ response, json });
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // The page should still render the standard "Discover Products" block
        // proving that the BlocksEngine gracefully delegates unknown types to `null`
        // without tearing down the React tree.
        const header = page.locator('h2', { hasText: /Discover Products/i });
        await expect(header).toBeVisible({ timeout: 5000 });
    });

    test('Empty State Logic Test (SDUI Starvation)', async ({ page }) => {
        // Mock the discovery endpoint to return absolutely NO data.
        // The app must not throw "Cannot read properties of undefined (reading 'map')"

        await page.route('**/*home-surface-context*', async route => {
            const response = await route.fetch();
            await route.fulfill({
                response,
                json: { sections: [], categories: [], activeOrders: [] }
            });
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Verify the app stays alive. It might show a fallback or just be empty,
        // but it MUST NOT crash the React Root.
        const main = page.locator('main').first();
        await expect(main).toBeVisible();
    });

    test('Recursive Hit Test & Click Handler Isolation', async ({ page }) => {
        await page.goto('/?category=cakes');
        await page.waitForLoadState('networkidle');

        // A common anti-pattern is placing an <AddToCartButton> inside a <Link>.
        // This causes hydration mismatch warnings (<a> cannot appear as a descendant of <a>)
        // or causes double-navigation (adding to cart ALSO navigates to the product page).

        // Find a product card with an Add button
        const addBtn = page.locator('button', { hasText: 'ADD' }).first();
        if (await addBtn.count() > 0) {
            // Click the add button. We are testing if this click "bubbles" up
            // and triggers a navigation event on the parent card.

            const currentUrl = page.url();
            await addBtn.click();

            // Wait a moment for any eager navigation to fire
            await page.waitForTimeout(1000);

            // The URL should not have changed to /product/...
            // The Next.js router should stay exactly where it was.
            expect(page.url()).toBe(currentUrl);
        }
    });
});
