import { test, expect } from '@playwright/test';

test.describe('Happy Path: Landing to Checkout', () => {
    test('should allow user to browse partner, add item, and see it in checkout', async ({ page }) => {
        // 1. Visit Home
        await page.goto('/');

        // 2. Click on a Partner card (assuming there's a list)
        // We'll target a generic link or card for now, or a specific test ID if known
        await page.waitForSelector('a[href^="/partner/"]');
        const firstPartner = page.locator('a[href^="/partner/"]').first();
        await firstPartner.click();

        // 3. Verify Partner page loaded
        await expect(page).toHaveURL(/\/partner\/.+/);

        // 4. Click on an Item Card (to open the sheet)
        // Note: Clicks on the card (Link) rather than the Add button directly to test the sheet flow
        await page.waitForSelector('a[href*="/item/"]');
        const firstItemCard = page.locator('a[href*="/item/"]').first();
        await firstItemCard.click();

        // 5. Check if it opens a sheet (Intercepted Item Sheet) - which we converted to Drawer
        // Drawer/Sheet is usually in a portal, so we check for its content
        await page.waitForSelector('[role="dialog"]');

        // 6. Complete adding to cart
        const addToCartBtn = page.getByTestId('add-to-cart-drawer');
        await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
        await addToCartBtn.click();

        // 7. Verify Floating Cart Bar appears (using robust attribute)
        await page.waitForSelector('a[href="/checkout"]', { timeout: 15000 });

        // 8. Go to Checkout
        await page.click('a[href="/checkout"]');
        await expect(page).toHaveURL('/checkout');

        // 9. Verify Item is in checkout
        await expect(page.locator('#checkout-summary')).toBeVisible();
    });
});
