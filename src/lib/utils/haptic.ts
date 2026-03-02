/**
 * WYSHKIT 2026: Standardized Haptic Feedback Patterns
 * WYSHKIT 2026 Pattern: Consistent haptic feedback for all user actions
 * 
 * Patterns:
 * - Success: Double light tap (50ms, 50ms) - confirms action completed
 * - Error: Single strong vibration (200ms) - indicates failure
 * - Action: Single light tap (50ms) - confirms button press
 * - Warning: Medium vibration (100ms) - indicates caution
 */

export const HapticPattern = {
  /** Success pattern: Double light tap (50ms, 50ms) */
  SUCCESS: [50, 50] as const,

  /** Error pattern: Single strong vibration (200ms) */
  ERROR: 200 as const,

  /** Action pattern: Single light tap (50ms) - for button presses */
  ACTION: 50 as const,

  /** Warning pattern: Medium vibration (100ms) */
  WARNING: 100 as const,

  /** Heartbeat pattern: Triple pulse (60ms, 40ms, 60ms, 40ms, 100ms) */
  HEARTBEAT: [60, 40, 60, 40, 100] as const,
} as const;

/**
 * Trigger haptic feedback with standardized patterns
 * 
 * @param pattern - Haptic pattern to use
 * @returns void
 * 
 * @example
 * ```tsx
 * import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
 * 
 * const handleAddToCart = () => {
 *   triggerHaptic(HapticPattern.ACTION); // Immediate feedback
 *   // ... add to cart logic
 *   triggerHaptic(HapticPattern.SUCCESS); // Success confirmation
 * };
 * ```
 */
export function triggerHaptic(pattern: number | readonly number[]): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return; // Not supported or not in browser
  }

  try {
    navigator.vibrate(pattern as number | number[]);
  } catch (e: unknown) { // Changed 'error' to 'e' and added 'unknown' type
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/logging/logger').then(({ logger }) => {
        // Changed logger.debug to logger.error and updated message to reflect haptic context
        logger.error('Haptic feedback failed:', { error: String(e) });
      });
    }
  }
}
