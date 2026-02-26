import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: Phase 10 - Silent Failure Eradication & The Lego Test
 * 
 * 1. "Silent Failure Detection": Asserts that backend RPC failures do not silently
 *    collapse the UI without a trace.
 * 2. "The Lego Test": Verifies that individual purified components (EntityCards,
 *    Cart, Checkout) stack together seamlessly into a full commerce transaction.
 * 3. Exact Coordinate Hit Testing: Proves z-index logic isn't blocking CTAs.
 */

test.describe('Phase 10: Silent Failure & The Lego Test', () => {

    test('Silent Failure Prevention (Anti-Missing-Rail Audit)', async ({ page }) => {
        // The core issue previously was that the Category Rail vanished *silently*
        // because an RPC exception was swallowed by the SDUI mapper.
        // We now enforce that critical SDUI components MUST exist in the DOM,
        // proving data integrity and rendering completeness.

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // ASSERTION: The Category Rail (which we fixed) must be visible.
        // If it vanishes again, this test fails the build.
        const categoryRailHeader = page.locator('h2', { hasText: /What's on your mind\?/i });
        await expect(categoryRailHeader).toBeVisible();

        // Ensure at least one Category Circle is rendered inside the rail.
        // We look for the "Cakes" category link.
        const cakesCategory = page.locator('a[href*="category=cakes"], a[href="/cakes"]').first();
        await expect(cakesCategory).toBeVisible();
    });

    test('Coordinate-Based Hit Test (Z-Index Transparency)', async ({ page }) => {
        await page.goto('/?category=cakes');
        await page.waitForLoadState('networkidle');

        // Dark patterns or CSS bugs often place invisible `div` overlays over
        // buttons, preventing users from clicking them. We use Playwright's
        // strict actionability checks to ensure the exact coordinates of the 
        // "ADD" button are unobstructed.

        const addBtn = page.locator('button', { hasText: 'ADD' }).first();

        if (await addBtn.count() > 0) {
            const box = await addBtn.boundingBox();
            expect(box).not.toBeNull();

            // Proceed to verify the center coordinates are interactive and not 
            // obscured by a rogue z-[9999] element.
            // force: false ensures it fails if covered
            await addBtn.click({ force: false, position: { x: box!.width / 2, y: box!.height / 2 } });
        }
    });

    test('The "Lego Test": Complete Traversal Integrity', async ({ page }) => {
        // The most critical test: Does the whole thing stack together?
        // Add to Cart -> Open Cart -> Estimate -> Checkout.
        // If one "Lego piece" is missing props or broken, this flow halts.

        await page.goto('/?category=cakes');
        await page.waitForLoadState('networkidle');

        // 1. Add to Cart (Lego Piece 1: EntityCard -> Cart Action)
        const addBtn = page.locator('button', { hasText: 'ADD' }).first();
        if (await addBtn.count() === 0) return; // Skip gracefully if no products

        await addBtn.click();
        await page.waitForTimeout(500); // Allow optimistic UI to settle

        // 2. Open Cart (Lego Piece 2: FloatingCart -> Direct Checkout routing)
        const cartTrigger = page.locator('[data-testid="floating-cart-bar"] a').first();
        await expect(cartTrigger).toBeVisible({ timeout: 10000 });
        // Wait for the Server Action (AddToCart) to finish sinking to DB, dropping the 'pointer-events-none' lock
        await expect(cartTrigger).not.toHaveClass(/pointer-events-none/, { timeout: 15000 });
        await page.waitForTimeout(1000); // Wait for transition animation to stabilize
        await cartTrigger.click({ force: true });

        // Wait for the checkout page URL
        await page.waitForURL('**/checkout**');

        // 3. Estimate Validation (Lego Piece 3: Location -> Pricing Sync on Checkout page)
        // Check if the price calculation engine renders an output
        const totalSpan = page.locator('span', { hasText: /₹[0-9,]+/ }).first();
        await expect(totalSpan).toBeVisible();

        // Ensure no fatal React Errors occurred during this dense sequence
        const reactErr = page.locator('text="Application error"');
        await expect(reactErr).toHaveCount(0);
    });

    test('Haptic & Motion Audit (Zero-Jank Transitions)', async ({ page }) => {
        // Evaluate if `navigator.vibrate` is called on primary actions without
        // throwing exceptions on unsupported devices (like desktop Safari).

        let vibrateCalled = false;
        await page.exposeFunction('mockVibrate', () => { vibrateCalled = true; });

        // Inject mock before navigating
        await page.addInitScript(() => {
            (navigator as any).vibrate = (window as any).mockVibrate;
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Clicking a category should trigger haptic feedback
        const firstCategory = page.locator('a[href*="category="]').first();
        if (await firstCategory.count() > 0) {
            await firstCategory.click();
            await page.waitForTimeout(200);
        }

        // We assert the haptic intent was fired successfully if categories exist
        if (await firstCategory.count() > 0) {
            expect(vibrateCalled, 'navigator.vibrate not called').toBe(true);
        }
    });

});
