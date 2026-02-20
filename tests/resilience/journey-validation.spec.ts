import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: High-Stakes Journey Validation (Data-Agnostic)
 */
test.describe('Wyshkit 2026: High-Stakes Journeys', () => {

    test('Flow 1: The Settlement Journey (Add to Cart -> Checkout)', async ({ page }) => {
        await page.goto('/search');
        await page.fill('input[placeholder*="Search"]', 'a');

        const itemCard = page.locator('a[href*="/item/"]').first();
        await expect(itemCard).toBeVisible({ timeout: 20000 });
        await itemCard.click();

        // Add to Cart
        const addToCartBtn = page.locator('[data-testid="add-to-cart-drawer"]');
        await expect(addToCartBtn).toBeVisible({ timeout: 15000 });
        await addToCartBtn.click();

        // Go to Checkout
        await page.locator('text=View Cart').click();
        await expect(page).toHaveURL(/.*checkout/);
        await expect(page.locator('text=Bill Summary')).toBeVisible({ timeout: 15000 });

        // Verify Settlement Details
        await expect(page.locator('text=GST')).toBeVisible();
    });

    test('Flow 2: Deep Link Resilience (Hydrated Background)', async ({ page }) => {
        await page.goto('/search');
        await page.fill('input[placeholder*="Search"]', 's');

        const itemLink = page.locator('a[href*="/item/"]').first();
        await expect(itemLink).toBeVisible({ timeout: 20000 });
        const itemHref = await itemLink.getAttribute('href');

        if (itemHref) {
            // Visit deep link
            await page.goto(itemHref);

            // Verify Sheet is open
            await expect(page.locator('[role="dialog"]')).toBeVisible();

            // Refresh
            await page.reload();
            await expect(page.locator('[role="dialog"]')).toBeVisible();

            // Close
            await page.keyboard.press('Escape');
            await expect(page.url()).not.toContain('/item/');
        }
    });
});
