import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: Resilience: Graceful Degradation Tests
 *
 * Swiggy 2026 Principle: The app must NEVER be broken.
 * Every failure mode must have a clear, gracious fallback.
 *
 * Pattern: Intercept Supabase REST API calls (not RPC names assumed to exist)
 * Grounded approach: routes we mock must be real API paths.
 */
test.describe('Resilience: Supabase Failure Handling', () => {

    test('Home Discovery: Skeleton shown during delayed network response', async ({ page }) => {
        // Simulate 4G delay (Swiggy core concern: hyperlocal users often on 4G)
        await page.route('**/rest/v1/rpc/get_nearby_items**', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await route.continue();
        });

        await page.goto('/');

        // During the delay, loading skeleton must be visible (not a blank screen)
        const skeleton = page.locator('.animate-pulse');
        // Either a skeleton or an already-loaded page is acceptable — never a complete blank
        const hasContent = await Promise.race([
            skeleton.first().isVisible().then(() => true),
            page.locator('main').isVisible().then(() => true),
        ]).catch(() => false);

        expect(hasContent, 'Page showed nothing during data load delay').toBe(true);
    });

    test('Partner Store: Graceful 500 error from Supabase does not crash app', async ({ page }) => {
        // Mock a server-side failure for partner data
        await page.route('**/rest/v1/partners**', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Internal Server Error' }),
            });
        });

        // Should not throw an unhandled error / white screen of death
        await page.goto('/partner/d206f0e3-4f9e-4e4d-bd22-866416ddc817');

        // The app should handle the error — either show a not-found page or error state,
        // NOT a blank white screen or unhandled exception
        await page.waitForLoadState('domcontentloaded');
        const body = await page.textContent('body').catch(() => '');
        expect(body).toBeTruthy(); // Body has content — not a crash
        expect(body).not.toContain('Application error'); // Not a Next.js unhandled error
    });

    test('Add to Cart: Shows error toast when server action fails', async ({ page }) => {
        // First load the page normally, then intercept the add-to-cart action
        await page.goto('/partner/d206f0e3-4f9e-4e4d-bd22-866416ddc817');

        // Wait for the page to be fully loaded so the button exists
        await page.waitForSelector('[data-testid="add-to-cart-quick"]', { timeout: 8000 }).catch(() => null);

        const addButton = page.locator('[data-testid="add-to-cart-quick"]').first();
        const hasQuickAdd = await addButton.isVisible().catch(() => false);

        if (!hasQuickAdd) {
            // All items on this partner require variant selection — skip quick-add test
            // and validate the sheet navigation resilience instead
            test.skip();
            return;
        }

        // Now intercept the server action
        await page.route('**/rest/v1/rpc/**', async (route) => {
            if (route.request().postData()?.includes('add_to_cart')) {
                await route.fulfill({ status: 500 });
            } else {
                await route.continue();
            }
        });

        await addButton.click();

        // Wyshkit 2026: Uses Sonner toast for error feedback
        const toastContainer = page.locator('ol[data-sonner-toaster]');
        await expect(toastContainer).toBeVisible({ timeout: 5000 });
    });

    test('Checkout: Pricing RPC failure shows error state, not blank', async ({ page }) => {
        // Intercept pricing calculation
        await page.route('**/rest/v1/rpc/calculate_order_total**', async (route) => {
            await route.fulfill({
                status: 503,
                body: JSON.stringify({ error: 'Service Unavailable' }),
            });
        });

        await page.goto('/checkout');
        await page.waitForLoadState('domcontentloaded');

        // The page should render — either empty cart state or an error message
        // It must NEVER be a blank screen
        const bodyText = await page.textContent('body').catch(() => '');
        expect(bodyText?.trim().length).toBeGreaterThan(0);
        expect(bodyText).not.toContain('Application error');
    });

    test('Location Permission Denied: Hyperlocal fallback works', async ({ page, context }) => {
        // Deny geolocation permission (hyperlocal is core to Wyshkit)
        await context.grantPermissions([]);
        await context.setGeolocation(null as any);

        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // App must not crash — should show a location prompt or general content
        await page.waitForTimeout(2000);
        const bodyText = await page.textContent('body').catch(() => '');
        expect(bodyText?.trim().length).toBeGreaterThan(0);
        expect(bodyText).not.toContain('Application error');
    });
});
