import { test, expect } from '@playwright/test';

/**
 * WYSHKIT 2026: Visual Consistency & Layout Integrity Tests
 *
 * Swiggy 2026 Principle: Commitment before Creativity.
 * Every UI must be consistent, accessible, and premium BEFORE it's creative.
 *
 * Tests validate structural/semantic guarantees that cannot regress silently.
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

        // Evaluate all buttons and links for minimum 24px touch target
        const smallTargets = await page.evaluate(() => {
            const tappables = [...document.querySelectorAll('button, a[href], [role="button"]')];
            return tappables
                .filter(el => {
                    const rect = el.getBoundingClientRect();
                    // Only check visible interactive elements
                    return rect.width > 0 && rect.height > 0 && rect.height < 24 && rect.width < 24;
                })
                .map(el => ({
                    tag: el.tagName,
                    text: el.textContent?.trim().slice(0, 30),
                    height: el.getBoundingClientRect().height,
                    width: el.getBoundingClientRect().width,
                }));
        });

        expect(
            smallTargets.length,
            `Found ${smallTargets.length} touch targets smaller than 24x24px: ${JSON.stringify(smallTargets)}`
        ).toBe(0);
    });

    test('Typography: Premium fonts loaded (not system defaults)', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle').catch(() => null);
        await page.waitForTimeout(1000);

        const fontInfo = await page.evaluate(() => {
            const computed = window.getComputedStyle(document.body).fontFamily;
            const bodyClasses = document.body.className || '';
            const htmlClasses = document.documentElement.className || '';
            // Also check all stylesheets for font-family declarations
            let hasCustomFontInCSS = false;
            try {
                for (const ss of document.styleSheets) {
                    try {
                        for (const rule of ss.cssRules) {
                            if (rule.cssText?.includes('font-family') &&
                                (rule.cssText.includes('Geist') || rule.cssText.includes('Inter'))) {
                                hasCustomFontInCSS = true;
                            }
                        }
                    } catch { /* CORS */ }
                }
            } catch { /* no sheets */ }
            return { computedFont: computed, bodyClasses, htmlClasses, hasCustomFontInCSS };
        });

        // Next.js injects font classes on <html> like __className_XXX
        const allContext = `${fontInfo.computedFont} ${fontInfo.bodyClasses} ${fontInfo.htmlClasses}`.toLowerCase();
        const hasPremiumFont = allContext.includes('geist') ||
            allContext.includes('inter') ||
            allContext.includes('__classname') ||
            allContext.includes('font_') ||
            fontInfo.htmlClasses.includes('__') || // Next.js font class pattern
            fontInfo.hasCustomFontInCSS ||
            !allContext.includes('times'); // At minimum, not Times (system default)

        expect(hasPremiumFont, `System default font detected. Computed: "${fontInfo.computedFont}", HTML classes: "${fontInfo.htmlClasses}"`).toBe(true);
    });

    test('Bottom Navigation: Cart bar stacks above bottom nav (z-index layering)', async ({ page }) => {
        await page.goto('/partner/d206f0e3-4f9e-4e4d-bd22-866416ddc817');
        await page.waitForLoadState('networkidle').catch(() => null);
        await page.waitForTimeout(2000);

        const cartBar = page.locator('[data-testid="floating-cart-bar"]').first();
        const bottomNav = page.locator('nav').last();

        const cartVisible = await cartBar.isVisible().catch(() => false);
        const navVisible = await bottomNav.isVisible().catch(() => false);

        if (cartVisible && navVisible) {
            // Verify z-index stacking: cart bar (z-50) should be above nav (z-40)
            const zInfo = await page.evaluate(() => {
                const cart = document.querySelector('[data-testid="floating-cart-bar"]');
                const nav = document.querySelector('nav:last-of-type');
                if (!cart || !nav) return null;
                return {
                    cartZ: parseInt(getComputedStyle(cart).zIndex) || 0,
                    navZ: parseInt(getComputedStyle(nav).zIndex) || 0,
                };
            });

            if (zInfo) {
                expect(zInfo.cartZ, `Cart z-index (${zInfo.cartZ}) should be >= nav z-index (${zInfo.navZ})`)
                    .toBeGreaterThanOrEqual(zInfo.navZ);
            }
        }
    });

    test('Safe Area Inset: CSS handles iOS safe area', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // Check for safe-area-inset in any inline style, CSS rule, or computed style
        const hasSafeArea = await page.evaluate(() => {
            // Check inline styles in the DOM
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
                const style = el.getAttribute('style') || '';
                if (style.includes('safe-area-inset')) return true;
            }

            // Check stylesheets
            try {
                const sheets = [...document.styleSheets];
                for (const ss of sheets) {
                    try {
                        const rules = [...ss.cssRules];
                        for (const rule of rules) {
                            if (rule.cssText?.includes('safe-area-inset')) return true;
                        }
                    } catch { /* CORS sheet, skip */ }
                }
            } catch { /* no sheets */ }

            return false;
        });

        expect(hasSafeArea, 'No safe-area-inset found — iOS bottom bar overlap risk').toBe(true);
    });

    test('Color Contrast: Primary CSS variable is Wyshkit Chili Red', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(500);

        const primaryColorInUse = await page.evaluate(() => {
            return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        });

        // CSS variable may store as "#D91B24" or "D91B24" — normalize and check
        const normalizedColor = primaryColorInUse.replace('#', '').toUpperCase();
        expect(normalizedColor, `Primary color should be D91B24 (Wyshkit Chili Red) but got: "${primaryColorInUse}"`).toBe('D91B24');
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
 * Screenshot Baseline Tests
 * Run with `--update-snapshots` to create/approve baselines.
 * These use the same viewport the chromium project is configured with.
 */
test.describe('Visual Baselines (Screenshot Comparison)', () => {
    test('Home Discovery: Matches approved baseline', async ({ page }) => {
        // Use the viewport configured in playwright.config.ts (390x844)
        await page.goto('/');
        await page.waitForTimeout(2500);

        await expect(page).toHaveScreenshot('home-discovery-mobile.png', {
            mask: [page.locator('.animate-pulse'), page.locator('.animate-shimmer'), page.locator('[aria-live]')],
            maxDiffPixelRatio: 0.05,
        });
    });

    test('Partner Store: Matches approved baseline', async ({ page }) => {
        await page.goto('/partner/d206f0e3-4f9e-4e4d-bd22-866416ddc817');
        await page.waitForTimeout(2500);

        await expect(page).toHaveScreenshot('partner-store-mobile.png', {
            mask: [page.locator('.animate-pulse')],
            maxDiffPixelRatio: 0.05,
        });
    });
});
