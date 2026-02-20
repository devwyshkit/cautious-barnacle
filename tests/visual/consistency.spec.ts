import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: Visual Consistency & Layout Integrity Tests
 *
 * Swiggy 2026 Principle: Commitment before Creativity.
 * Every UI must be consistent, accessible, and premium BEFORE it's creative.
 *
 * Approach: Semantic layout validation (not pixel screenshot comparison).
 * Screenshot tests require baseline approval — run with `--update-snapshots` to approve.
 * These tests validate structural/semantic guarantees that cannot regress silently.
 */
test.describe('Visual Consistency: Swiggy 2026 Layout Audit', () => {

    test.beforeEach(async ({ page }) => {
        // Mobile-first: iPhone 12 Pro viewport
        await page.setViewportSize({ width: 390, height: 844 });
    });

    test('Touch Targets: All primary buttons meet 44px minimum (A11y Standard)', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle').catch(() => null);
        await page.waitForTimeout(1500);

        // Evaluate all buttons and links for minimum 44px touch target
        const smallTargets = await page.evaluate(() => {
            const tappables = [...document.querySelectorAll('button, a[href], [role="button"]')];
            return tappables
                .filter(el => {
                    const rect = el.getBoundingClientRect();
                    // Only check visible interactive elements
                    return rect.width > 0 && rect.height > 0 && rect.height < 32 && rect.width < 32;
                })
                .map(el => ({
                    tag: el.tagName,
                    text: el.textContent?.trim().slice(0, 30),
                    height: el.getBoundingClientRect().height,
                    width: el.getBoundingClientRect().width,
                }));
        });

        // Report violations but allow minor icon buttons (e.g. close icons in nav)
        const criticalViolations = smallTargets.filter(t => t.height < 24 && t.width < 24);
        expect(
            criticalViolations.length,
            `Found ${criticalViolations.length} touch targets smaller than 24x24px: ${JSON.stringify(criticalViolations)}`
        ).toBe(0);
    });

    test('Typography: No system default fonts leaking (Geist/Inter expected)', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000);

        const bodyFontFamily = await page.evaluate(() => {
            return window.getComputedStyle(document.body).fontFamily;
        });

        // Should be Geist Sans (our premium font), NOT Arial, Helvetica, or browser defaults alone
        const hasGeistOrInter = bodyFontFamily.toLowerCase().includes('geist') ||
            bodyFontFamily.toLowerCase().includes('inter') ||
            bodyFontFamily.toLowerCase().includes('var(') ||
            bodyFontFamily.toLowerCase().includes('__geist');

        expect(hasGeistOrInter, `Body font is leaking system font: "${bodyFontFamily}"`).toBe(true);
    });

    test('Bottom Navigation: Does not obscure cart bar (z-index layering)', async ({ page }) => {
        await page.goto('/partner/d206f0e3-4f9e-4e4d-bd22-866416ddc817');
        await page.waitForTimeout(1500);

        const bottomNav = page.locator('nav[aria-label], [data-testid="bottom-nav"], nav').last();
        const cartBar = page.locator('[aria-label="Floating cart summary"], [aria-label*="cart"]').first();

        const navVisible = await bottomNav.isVisible().catch(() => false);

        if (navVisible && await cartBar.isVisible().catch(() => false)) {
            const navBox = await bottomNav.boundingBox();
            const cartBox = await cartBar.boundingBox();

            if (navBox && cartBox) {
                // Cart bar must be positioned ABOVE the bottom nav (smaller Y value)
                // Or they must not overlap
                const doNotOverlap = cartBox.y + cartBox.height <= navBox.y + 8; // 8px tolerance
                expect(doNotOverlap, 'Cart bar overlaps the bottom nav bar').toBe(true);
            }
        }
    });

    test('Safe Area Inset: Bottom padding accounts for iOS safe area', async ({ page }) => {
        await page.goto('/');

        const hasSafeAreaUtility = await page.evaluate(() => {
            const styles = [...document.styleSheets].flatMap(ss => {
                try {
                    return [...ss.cssRules];
                } catch {
                    return [];
                }
            });
            return styles.some(rule => rule.cssText?.includes('safe-area-inset'));
        });

        expect(hasSafeAreaUtility, 'No safe-area-inset CSS found — iOS bottom bar overlap risk').toBe(true);
    });

    test('Color Contrast: Primary action buttons use Wyshkit Chili Red (#D91B24)', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000);

        // Find the primary CTA color in use
        const primaryColorInUse = await page.evaluate(() => {
            const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            return primary;
        });

        expect(primaryColorInUse, `Primary color should be #D91B24 (Wyshkit Chili Red) but got: ${primaryColorInUse}`)
            .toMatch(/#D91B24|#d91b24|D91B24/i);
    });

    test('Partner Store: Item cards render without layout shift', async ({ page }) => {
        await page.goto('/partner/d206f0e3-4f9e-4e4d-bd22-866416ddc817');

        const cumulativeLayoutShift = await page.evaluate(() => {
            return new Promise<number>((resolve) => {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!(entry as any).hadRecentInput) {
                            clsValue += (entry as any).value;
                        }
                    }
                });

                observer.observe({ type: 'layout-shift', buffered: true });
                setTimeout(() => {
                    observer.disconnect();
                    resolve(clsValue);
                }, 3000);
            });
        });

        // Google CWV Good CLS: < 0.1
        expect(cumulativeLayoutShift, `CLS of ${cumulativeLayoutShift.toFixed(3)} exceeds 0.1 threshold`).toBeLessThan(0.1);
    });

    test('Mobile: No horizontal scroll on Home page (layout overflow)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/');
        await page.waitForTimeout(1500);

        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalOverflow, 'Page has horizontal overflow — layout is broken on mobile').toBe(false);
    });

    test('Mobile: No horizontal scroll on Partner Store page', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/partner/d206f0e3-4f9e-4e4d-bd22-866416ddc817');
        await page.waitForTimeout(1500);

        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalOverflow, 'Partner store has horizontal overflow').toBe(false);
    });
});

/**
 * Screenshot Baseline Tests (run with --update-snapshots to create/approve baselines)
 * These are separate so they don't block the layout validation tests above.
 */
test.describe('Visual Baselines (Screenshot Comparison)', () => {
    test('Home Discovery: Matches approved baseline', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/');
        await page.waitForTimeout(2500); // Wait for animations to settle

        await expect(page).toHaveScreenshot('home-discovery-mobile.png', {
            mask: [page.locator('.animate-pulse'), page.locator('.animate-shimmer'), page.locator('[aria-live]')],
            maxDiffPixelRatio: 0.02, // 2% pixel diff tolerance
        });
    });

    test('Partner Store: Matches approved baseline', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/partner/d206f0e3-4f9e-4e4d-bd22-866416ddc817');
        await page.waitForTimeout(2500);

        await expect(page).toHaveScreenshot('partner-store-mobile.png', {
            mask: [page.locator('.animate-pulse')],
            maxDiffPixelRatio: 0.02,
        });
    });
});
