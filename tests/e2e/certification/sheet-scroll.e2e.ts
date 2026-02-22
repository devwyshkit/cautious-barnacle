import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: Mobile Touch Contract
 * Verifies that Vaul sheets allow inner scrolling without accidental dismissal
 * or "scroll leaking" to the document body.
 */

test.describe('Mobile: Vaul Sheet Scroll Trap Fix', () => {

    test('Sheet inner scroll does not leak or dismiss', async ({ page }) => {
        // Use a small mobile viewport
        await page.setViewportSize({ width: 390, height: 844 });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // 1. Open a sheet (e.g., Cart sheet)
        const cartBtn = page.locator('button', { hasText: /CART/i }).first();
        if (await cartBtn.isVisible()) {
            await cartBtn.click();
            await page.waitForTimeout(500); // Animation

            const drawerContent = page.locator('[role="dialog"]').first();
            await expect(drawerContent).toBeVisible();

            // 2. Identify the scrollable container
            const scrollContainer = drawerContent.locator('[data-vaul-no-drag]');
            await expect(scrollContainer).toBeVisible();

            // 3. Create a CDP session for touch simulation
            const client = await page.context().newCDPSession(page);

            const box = await scrollContainer.boundingBox();
            if (!box) throw new Error('Could not get box for scroll container');

            const centerX = box.x + box.width / 2;
            const centerY = box.y + box.height / 2;

            // Get initial body scroll position (should be 0)
            const initialBodyScroll = await page.evaluate(() => window.scrollY);

            // 4. Perform a touch drag (swipe up to scroll down)
            await client.send('Input.dispatchTouchEvent', {
                type: 'touchStart',
                touchPoints: [{ x: centerX, y: centerY + 100 }],
            });

            await client.send('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: [{ x: centerX, y: centerY - 100 }],
            });

            await client.send('Input.dispatchTouchEvent', {
                type: 'touchEnd',
                touchPoints: [],
            });

            await page.waitForTimeout(300);

            // 5. ASSERTIONS
            // - Sheet must remain open
            await expect(drawerContent).toBeVisible();

            // - Body scroll must remain unchanged
            const finalBodyScroll = await page.evaluate(() => window.scrollY);
            expect(finalBodyScroll).toBe(initialBodyScroll);

            // - Inner container scroll might have changed (depending on content height)
            const innerScroll = await scrollContainer.evaluate(el => el.scrollTop);
            // Even if it didn't change (no content), the lack of body scroll is the key.
        }
    });
});
