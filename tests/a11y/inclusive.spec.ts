import { test, expect } from '@playwright/test';
const { injectAxe, checkA11y } = require('axe-playwright');

test.describe('Swiggy 2026: Accessibility & Inclusive Design', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await injectAxe(page);
    });

    test('Home Page A11y Check', async ({ page }) => {
        // Check for violations against WCAG 2.1 Level AA
        await checkA11y(page, null, {
            axeOptions: {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa']
                }
            },
            detailedReport: true,
            detailedReportOptions: { html: true }
        });
    });

    test('Tap Target Sizing (The "One-Thumb" Rule)', async ({ page }) => {
        // Enforce 44x44px minimum for primary action buttons
        const miniCart = page.locator('button[aria-label="Floating cart summary"]');
        if (await miniCart.isVisible()) {
            const box = await miniCart.boundingBox();
            expect(box?.width).toBeGreaterThanOrEqual(44);
            expect(box?.height).toBeGreaterThanOrEqual(44);
        }

        // Check "Add to Cart" button sizing
        const addToCart = page.locator('button:has-text("Add")').first();
        if (await addToCart.isVisible()) {
            const box = await addToCart.boundingBox();
            expect(box?.width).toBeGreaterThanOrEqual(44);
            expect(box?.height).toBeGreaterThanOrEqual(44);
        }
    });

    test('Color Contrast Compliance (Premium Text)', async ({ page }) => {
        // Audit specifically for grey-on-white text (common in premium designs but bad for a11y)
        await checkA11y(page, '.text-zinc-500, .text-zinc-400', {
            axeOptions: {
                runOnly: ['color-contrast']
            }
        });
    });
});
