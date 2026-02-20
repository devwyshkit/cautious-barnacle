import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: Elite Personalization Lifecycle Test (Authenticated)
 */

const TEST_ORDER_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const TEST_PHONE = '7624845361';
const TEST_OTP = '123456';

test.describe('Elite Certification: Personalization Lifecycle', () => {

    test.beforeEach(async ({ page }) => {
        // Perform Login using the Elite Bypass (defined in useAuth.tsx)
        await page.goto('/auth');

        // Wait for Phone Input
        const phoneInput = page.locator('input#phone');
        // Focus and type explicitly to prevent WebKit hydration wipe
        await phoneInput.click();
        await page.keyboard.type(TEST_PHONE, { delay: 50 });

        await page.click('button:has-text("Continue")');

        // Wait for OTP input
        await expect(page.locator('text=Verify OTP')).toBeVisible({ timeout: 15000 });

        // Focus and fill OTP (Elite Bypass triggers a real sign-in via password check)
        const otpContainer = page.locator('[data-slot="input-otp"]');
        await otpContainer.click();
        await page.keyboard.type(TEST_OTP, { delay: 100 });

        // Wait for redirect to home
        await expect(page).toHaveURL(/\/$/, { timeout: 30000 });
    });

    test('Post-Payment Identity Flow (Direct Tracking)', async ({ page }) => {
        // 1. Visit the order tracking page with 'identity' trigger
        await page.goto(`/orders/${TEST_ORDER_ID}?success=true&identity=true`);

        // 2. Verify the Personalization Form is present
        const textarea = page.locator('textarea').first();
        await expect(textarea).toBeVisible({ timeout: 20000 });

        // 3. Fill in the personalization details
        await textarea.fill('Elite Certification 2026: Please add a hand-written note saying "Happy Birthday" in gold ink.');

        // 4. Confirm Identity (Bespoke Slider interaction)
        // ActionSlider renders as a <button> on Desktop and a <div> slider on Mobile
        const confirmButton = page.locator('text=Slide to Share Brief').first();
        await expect(confirmButton).toBeVisible();

        const tagName = await confirmButton.evaluate(el => el.tagName);
        const isButton = tagName === 'BUTTON';

        if (isButton) {
            // Desktop flow: Just click
            await confirmButton.click();
        } else {
            // Mobile flow: Slide to confirm
            // The handle is the first child with ChevronRight usually, but we'll drag the container/role element
            const sliderBox = await confirmButton.boundingBox();
            if (sliderBox) {
                await page.mouse.move(sliderBox.x + 30, sliderBox.y + sliderBox.height / 2);
                await page.mouse.down();
                // Move significantly to the right (past 70% threshold)
                await page.mouse.move(sliderBox.x + sliderBox.width - 30, sliderBox.y + sliderBox.height / 2, { steps: 20 });
                await page.mouse.up();
            }
        }

        // 5. Verify Success UI (Optimistic transmission)
        await expect(page.locator('text=Mission Started')).toBeVisible({ timeout: 20000 });
    });

    test('Deep Link Persistence: Identity Overlay State', async ({ page }) => {
        await page.goto(`/orders/${TEST_ORDER_ID}?identity=true`);
        await expect(page.locator('text=Add Identity')).toBeVisible({ timeout: 15000 });

        await page.reload();
        await expect(page.locator('text=Add Identity')).toBeVisible({ timeout: 15000 });
    });
});
