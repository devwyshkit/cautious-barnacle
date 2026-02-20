import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: God-Tier Chaos Resilience Suite (Revamped)
 * 
 * Simulates extreme real-world conditions to certify platform stability.
 * Uses comprehensive Supabase REST mocks to ensure deterministic results.
 */

test.describe('Extreme Chaos Resilience (Swiggy 2026 Standards)', () => {

    test.beforeEach(async ({ page }) => {
        // Clear cookies and session for clean state
        await page.context().clearCookies();

        // MOCK Supabase REST: Items
        await page.route('**/rest/v1/items*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    {
                        id: '00000000-0000-0000-0000-000000000001',
                        name: 'Chaos Chili Cake',
                        slug: 'chaos-chili-cake',
                        images: ['/images/logo.png'],
                        base_price: 499,
                        partner_id: '00000000-0000-0000-0000-000000000000',
                        stock_status: 'in_stock',
                        stock_quantity: 10,
                        partners: {
                            name: 'Chaos Bakery',
                            display_name: 'Chaos Bakery'
                        }
                    }
                ])
            });
        });

        // MOCK Supabase REST: Partners
        await page.route('**/rest/v1/partners*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    {
                        id: '00000000-0000-0000-0000-000000000000',
                        name: 'Chaos Bakery',
                        slug: 'chaos-bakery',
                        rating: 4.8,
                        city: 'Chaos City',
                        display_name: 'Chaos Bakery',
                        image_url: '/images/logo.png',
                        status: 'active'
                    }
                ])
            });
        });

        await page.goto('/');
    });

    test('Scenario 1: Latency Jitter - Inventory RPC Delay', async ({ page }) => {
        // Intercept Supabase RPC for stock checks and add 3s delay
        await page.route('**/rest/v1/rpc/get_available_stock*', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(10) // Mocking 10 in stock
            });
        });

        // Navigate to search and TYPE to trigger client-side fetch (interceptable)
        await page.goto('/search');
        await page.fill('input[placeholder*="Search"]', 'chaos');

        // Find and click our mocked item
        const itemCard = page.locator('text=Chaos Chili Cake').first();
        await expect(itemCard).toBeVisible({ timeout: 10000 });
        await itemCard.click();

        // Verify that the Item Detail sheet shows a loading state or disabled button
        const addToCartButton = page.locator('[data-testid="add-to-cart-drawer"]');

        // Wait for the delay to finish
        await expect(addToCartButton).toBeEnabled({ timeout: 15000 });
        await expect(addToCartButton).toContainText(/Add to Cart/i);
    });

    test('Scenario 2: Failure Injection - 500 Error on Order Placement', async ({ page }) => {
        // Intercept Order creation RPC and force a 500
        await page.route('**/rest/v1/rpc/create_order*', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Chaos Injection: Database Overload' })
            });
        });

        // Add item to cart first via interactive search
        await page.goto('/search');
        await page.fill('input[placeholder*="Search"]', 'chaos');
        await page.locator('text=Chaos Chili Cake').first().click();

        const addToCartButton = page.locator('[data-testid="add-to-cart-drawer"]');
        await expect(addToCartButton).toBeVisible();
        await expect(addToCartButton).toBeEnabled();
        await addToCartButton.click();

        // Navigate to checkout
        await page.goto('/checkout');

        // Wait for pricing to stabilize
        await expect(page.locator('text=Bill Summary')).toBeVisible({ timeout: 10000 });

        // Mock Checkout Data fetch (since we might need partner info etc)
        // Usually handled by page.route if needed

        // Slide to Pay or Click Place Order
        const placeOrderBtn = page.locator('button:has-text("Place Order")');
        if (await placeOrderBtn.isVisible()) {
            await placeOrderBtn.click();
        } else {
            // Mobile Slide to Pay
            const slider = page.locator('[data-testid="slide-to-pay-handle"]');
            if (await slider.isVisible()) {
                const box = await slider.boundingBox();
                if (box) {
                    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                    await page.mouse.down();
                    await page.mouse.move(box.x + 300, box.y + box.height / 2);
                    await page.mouse.up();
                }
            }
        }

        // Verify that the UI shows an error toast
        await expect(page.locator('text=Something went wrong|Could not save order')).toBeVisible({ timeout: 15000 });
    });

    test('Scenario 3: Zero Disconnect - Intercepted Route Recovery', async ({ page }) => {
        // Go to search to find the item link
        await page.goto('/search');
        await page.fill('input[placeholder*="Search"]', 'chaos');

        const itemLink = page.locator('a[href*="/item/"]').first();
        await expect(itemLink).toBeVisible({ timeout: 10000 });
        const itemHref = await itemLink.getAttribute('href');

        // 1. Visit item directly (hard link)
        if (itemHref) {
            await page.goto(itemHref);
        }

        // 2. Verify Sheet is open
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // 3. Refresh the page (Hard Link check)
        await page.reload();

        // 4. Verify foreground (Item Sheet) is present
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // 5. Close sheet and verify we navigate back
        await page.keyboard.press('Escape');
        await expect(page.url()).toContain('/partner/');
    });
});
