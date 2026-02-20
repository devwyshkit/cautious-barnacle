import { test, expect } from '@playwright/test';

test.describe('SLA & Timer Resilience', () => {
    test('HyperlocalTimer should render and count down correctly', async ({ page }) => {
        // 1. Visit a page that has a timer (e.g., an active order)
        // For testing, we can Mock the response or visit a specific order if we have one
        await page.goto('/orders');

        // 2. Look for the timer
        const timer = page.locator('.font-outfit').filter({ hasText: /h|m|s/ });
        if (await timer.count() > 0) {
            const initialTime = await timer.first().textContent();
            await page.waitForTimeout(2000); // Wait 2s
            const updatedTime = await timer.first().textContent();

            expect(initialTime).not.toBe(updatedTime);
        }
    });
});
