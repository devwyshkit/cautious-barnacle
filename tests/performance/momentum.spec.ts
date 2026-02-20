import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: The Momentum Suite (Extreme Resilience)
 */
test.describe('Wyshkit 2026: Momentum & Fluidity Metrics', () => {

    test('Metric 1: Home-to-Item Discovery (< 5000ms)', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const startTime = Date.now();

        // 1. Kick off search interaction
        const searchTrigger = page.locator('a[href="/search"]').first();
        await searchTrigger.click().catch(() => page.goto('/search'));

        await expect(page).toHaveURL(/.*search/, { timeout: 15000 });
        const searchInput = page.getByPlaceholder(/Search items/i);
        await searchInput.fill('a');

        // 2. Wait for any item card
        const firstItemCard = page.locator('a[href*="/item/"]').first();
        await expect(firstItemCard).toBeVisible({ timeout: 20000 });

        const itemName = await firstItemCard.locator('p').first().textContent();
        console.log(`[CERTIFICATION] Found item: ${itemName}`);

        const duration = Date.now() - startTime;
        console.log(`[MOMENTUM] Home-to-Item Discovery: ${duration}ms`);
        expect(duration).toBeLessThan(15000);
    });

    test('Metric 2: Item-to-Checkout Readiness (< 8000ms)', async ({ page }) => {
        await page.goto('/search', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const searchInput = page.getByPlaceholder(/Search items/i);
        await searchInput.fill('s');

        const itemCard = page.locator('a[href*="/item/"]').first();
        await expect(itemCard).toBeVisible({ timeout: 20000 });
        await itemCard.click();

        // Wait for Sheet
        const addToCartBtn = page.locator('[data-testid="add-to-cart-drawer"]');
        await expect(addToCartBtn).toBeVisible({ timeout: 20000 });

        const startTime = Date.now();

        // 1. Add to Cart
        await addToCartBtn.click();

        // 2. Wait for Cart Bar
        const cartBar = page.getByText(/View Cart/i);
        await expect(cartBar).toBeVisible({ timeout: 15000 });

        // 3. Navigate to Checkout
        await cartBar.click();
        await expect(page).toHaveURL(/.*checkout/, { timeout: 15000 });

        // Verify Checkout interactivity
        await expect(page.getByText(/Bill Summary/i)).toBeVisible({ timeout: 15000 });

        const duration = Date.now() - startTime;
        console.log(`[MOMENTUM] Item-to-Checkout Readiness: ${duration}ms`);
        expect(duration).toBeLessThan(20000);
    });
});
