import { test, expect } from '@playwright/test';

test.describe('Swiggy 2026: Performance Budgets (Momentum First)', () => {

    test('LCP Budget < 2.5s (Slow 4G Simulation)', async ({ page }) => {
        // Simulate "Hyperlocal Reality" (3G/4G Flaky network)
        const client = await page.context().newCDPSession(page);
        await client.send('Network.emulateNetworkConditions', {
            offline: false,
            downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6 Mbps
            uploadThroughput: 750 * 1024 / 8, // 750 Kbps
            latency: 150, // 150ms RTT
        });

        const lcp = await page.evaluate(() => {
            return new Promise((resolve) => {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry.startTime);
                }).observe({ type: 'largest-contentful-paint', buffered: true });

                // Fallback if no LCP after 5s
                setTimeout(() => resolve(5000), 5000);
            });
        });

        console.log(`[PERF][LCP] Slow 4G: ${lcp}ms`);
        expect(lcp).toBeLessThan(2500);
    });

    test('Main Thread Blocking (TBT) < 100ms', async ({ page }) => {
        await page.goto('/');

        const longTasks = await page.evaluate(() => {
            return new Promise((resolve) => {
                let totalLongTaskDuration = 0;
                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        totalLongTaskDuration += (entry.duration - 50);
                    }
                    resolve(totalLongTaskDuration);
                }).observe({ type: 'longtask', buffered: true });

                // Pulse check after first interaction
                setTimeout(() => resolve(0), 2000);
            });
        });

        console.log(`[PERF][TBT]: ${longTasks}ms`);
        expect(longTasks).toBeLessThan(100);
    });
});
