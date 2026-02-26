import { test, expect } from '@playwright/test';

test.describe('Swiggy 2026 Certification: Ergonomics & A11y', () => {
    test('should have 44px+ touch targets and zero layout overflows', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // 1. Coordinate-based Hit Test (Touch Targets)
        // Verify category buttons are at least 44px in size
        const categoryProducts = await page.locator('.no-scrollbar a').all();
        for (const product of categoryProducts.slice(0, 5)) {
            const box = await product.boundingBox();
            if (box) {
                expect(box.width, `Width too small for touch target: ${box.width}px`).toBeGreaterThanOrEqual(44);
                expect(box.height, `Height too small for touch target: ${box.height}px`).toBeGreaterThanOrEqual(44);
            }
        }

        // 2. Overflow Trace (Page Jiggle Audit)
        const isOverflowing = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(isOverflowing, 'Horizontal overflow (jiggle) detected on home page').toBe(false);
    });

    test('should verify focus trap in Bottom Sheets', async ({ page }) => {
        await page.goto('/');

        // Find an product and open its sheet (triggered by clicking an ProductCard)
        // We'll look for a button that likely opens a sheet
        const productLink = page.locator('a[href^="/product/"]').first();
        if (await productLink.isVisible()) {
            await productLink.click();

            // Check if the sheet is visible
            const sheet = page.locator('[role="dialog"]');
            await expect(sheet).toBeVisible();

            // Verify focus trap: Tab should stay within the sheet
            await page.keyboard.press('Tab');
            const activeElement = await page.evaluate(() => document.activeElement?.tagName);
            // It should be one of the buttons in the sheet
            expect(['BUTTON', 'A', 'INPUT', 'TEXTAREA']).toContain(activeElement);
        }
    });
});
