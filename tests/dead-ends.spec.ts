import { test, expect } from '@playwright/test';

test.describe('Dead End Detection & Escape Hatches', () => {
    test('should allow dismissing the Location Sheet via swipe (Drawer pattern)', async ({ page }) => {
        // 1. Trigger the Location Sheet (Intercepted route)
        await page.goto('/');
        await page.click('[aria-label="Delivery Location"], #location-trigger');

        // 2. Verify it opens
        await page.waitForSelector('[role="dialog"]');

        // 3. Verify it has an escape hatch (Swipe Indicator or Drawer Handle)
        const handle = page.locator('.mx-auto.mt-4.h-2.w-\\[100px\\]'); // Default Drawer handle in drawer.tsx
        await expect(handle).toBeVisible();

        // 4. Try to click outside or press ESC (Standard Drawer behavior)
        await page.keyboard.press('Escape');
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });

    test('should allow dismiss in Item Details (Drawer pattern)', async ({ page }) => {
        await page.goto('/');

        // Click on first partner then first item
        await page.waitForSelector('a[href^="/partner/"]');
        await page.locator('a[href^="/partner/"]').first().click();

        await page.waitForSelector('a[href*="/item/"]');
        await page.locator('a[href*="/item/"]').first().click();

        // Verify Drawer opens
        const drawer = page.locator('[role="dialog"]');
        await expect(drawer).toBeVisible();

        // Escape hatch check
        await page.keyboard.press('Escape');
        await expect(drawer).not.toBeVisible();
    });
});
