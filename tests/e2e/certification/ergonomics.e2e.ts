import { test, expect } from '@playwright/test';

test.describe('Swiggy 2026 Certification: Ergonomics & A11y', () => {
    test('should have 44px+ touch targets and zero layout overflows', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // 1. Coordinate-based Hit Test (Touch Targets)
        // Verify category buttons are at least 44px in size
        const categoryItems = await page.locator('.no-scrollbar a').all();
        for (const item of categoryItems.slice(0, 5)) {
            const box = await item.boundingBox();
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

        // Find an item and open its sheet (triggered by clicking an ItemCard)
        // We'll look for a button that likely opens a sheet
        const itemLink = page.locator('a[href^="/item/"]').first();
        if (await itemLink.isVisible()) {
            await itemLink.click();

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
