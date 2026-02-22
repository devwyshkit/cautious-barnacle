import { test, expect } from '@playwright/test';

test.describe('Swiggy 2026 Certification: Performance Purity', () => {
    test('should maintain zero layout shift on scroll and high response during transitions', async ({ page }) => {
        // 1. Monitor CLS
        let clsScore = 0;
        await page.exposeFunction('onLayoutShift', (score: number) => {
            clsScore += score;
        });

        await page.addInitScript(() => {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!(entry as any).hadRecentInput) {
                        (window as any).onLayoutShift((entry as any).value);
                    }
                }
            }).observe({ type: 'layout-shift', buffered: true });
        });

        // 2. Navigate and Stress Test Layout
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Rapid scroll to trigger lazy loading jumps
        await page.evaluate(async () => {
            for (let i = 0; i < 5; i++) {
                window.scrollBy(0, 500);
                await new Promise(r => setTimeout(r, 100));
            }
        });

        // 3. Transition Starvation Test
        // Simulating high-frequency interaction on a dynamic component
        const categoryRail = page.locator('.no-scrollbar').first();
        if (await categoryRail.isVisible()) {
            const start = Date.now();
            // Click multiple categories in rapid succession
            const items = await categoryRail.locator('a').all();
            for (let i = 0; i < Math.min(items.length, 3); i++) {
                await items[i].click();
            }
            const duration = Date.now() - start;

            // Certify: Rapid interactions shouldn't "hang" the main thread indefinitely
            // Each click + transition should be extremely fast (mobile-first 2026 standard)
            expect(duration, 'Transition starvation detected - UI response too slow').toBeLessThan(2000);
        }

        // 4. Verify CLS (Swiggy 2026 standard: < 0.05 for "Perfect" score)
        console.log(`CLS Score: ${clsScore}`);
        expect(clsScore, `CLS too high: ${clsScore}`).toBeLessThan(0.05);
    });
});
