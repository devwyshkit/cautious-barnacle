import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Swiggy 2026 Certification: Accessibility Purity', () => {

    test('should have zero critical accessibility violations on landing page', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Analyze page
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        // 2026 Platform Budget: Zero critical violations
        const criticalViolations = accessibilityScanResults.violations.filter(v => v.impact === 'critical');

        expect(criticalViolations.length, `Critical accessibility violations detected: ${JSON.stringify(criticalViolations, null, 2)}`).toBe(0);
    });

    test('should have zero critical violations in the product detail sheet', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Open first product
        const firstProduct = page.locator('a[href*="/product/"]').first();
        if (await firstProduct.count() > 0) {
            await firstProduct.click();
            await page.waitForSelector('[role="dialog"]');

            const accessibilityScanResults = await new AxeBuilder({ page })
                .include('[role="dialog"]')
                .analyze();

            const criticalViolations = accessibilityScanResults.violations.filter(v => v.impact === 'critical');
            expect(criticalViolations.length, `Critical accessibility violations inside sheet: ${JSON.stringify(criticalViolations, null, 2)}`).toBe(0);
        }
    });

});
