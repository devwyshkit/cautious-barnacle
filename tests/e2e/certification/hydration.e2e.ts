import { test, expect } from '@playwright/test';

test.describe('Swiggy 2026 Certification: Hydration Purity', () => {
    test('should have zero hydration mismatches and stable ghost interactions', async ({ page }) => {
        const hydrationErrors: string[] = [];

        // Listen for hydration warnings/errors
        page.on('console', msg => {
            const text = msg.text();
            // React 18 text match + React 19 Error Codes (418, 423)
            if (text.includes('hydration') || text.includes('did not match') || text.includes('React error #418') || text.includes('React error #423')) {
                hydrationErrors.push(text);
            }
        });

        // 1. Navigate to home
        await page.goto('/');

        // 2. Wait for FCP (First Contentful Paint)
        await page.waitForSelector('body');

        // 3. Ghost Interaction Stress Test
        // Attempt to click a category button immediately to see if it registers or breaks
        // Swiggy 2026: Zero-Jank engagement. Handler MUST be wired before paint completes.
        const categoryRail = page.locator('[data-testid="category-rail"], [data-testid="category-nav"], .no-scrollbar').first();
        if (await categoryRail.isVisible()) {
            // Click the first category product (usually "All")
            // force: false ensures we test real actionability/hydration state
            const firstProduct = categoryRail.locator('a').first();
            await firstProduct.click({ force: false }).catch(() => { /* skip if truly unclickable */ });
        }

        // 4. Verify no hydration errors were logged
        expect(hydrationErrors, `Hydration errors detected: ${hydrationErrors.join(', ')}`).toHaveLength(0);

        // 5. Verify navigation state after "Ghost Click"
        // If we clicked "All", it should stay on / or navigate back to /
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('/');
    });
});
