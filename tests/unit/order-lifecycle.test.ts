import { describe, it, expect } from 'vitest';
import {
    ORDER_STATUS,
    getStatusConfig,
    isFinalStatus,
    canCancelOrder,
    getOrderStatusDisplay,
    getOrderStatusColor
} from '@/lib/types/order-status';

// WYSHKIT 2026: Order Lifecycle State Machine Tests
// Ensures deterministic state transitions and prevents invalid order terminal states.

describe('Order Lifecycle State Machine', () => {
    it('should identify terminal states correctly', () => {
        expect(isFinalStatus(ORDER_STATUS.DELIVERED)).toBe(true);
        expect(isFinalStatus(ORDER_STATUS.CANCELLED)).toBe(true);
        expect(isFinalStatus(ORDER_STATUS.REFUNDED)).toBe(true);
        expect(isFinalStatus(ORDER_STATUS.PLACED)).toBe(false);
    });

    it('should respect cancellation rules', () => {
        expect(canCancelOrder(ORDER_STATUS.PLACED)).toBe(true);
        expect(canCancelOrder(ORDER_STATUS.CONFIRMED)).toBe(true);
        expect(canCancelOrder(ORDER_STATUS.IN_PRODUCTION)).toBe(false);
        expect(canCancelOrder(ORDER_STATUS.OUT_FOR_DELIVERY)).toBe(false);
        expect(canCancelOrder(ORDER_STATUS.DELIVERED)).toBe(false);
    });

    it('should provide correct display config for each status', () => {
        const confirmedConfig = getStatusConfig({ status: ORDER_STATUS.CONFIRMED, has_personalization: false });
        expect(confirmedConfig.subLabel).toBe('accepted');

        const deliveredConfig = getStatusConfig({ status: ORDER_STATUS.DELIVERED, has_personalization: false });
        expect(deliveredConfig.subLabel).toBe('delivered');

        // Design Input Needed: requires PLACED/CONFIRMED status AND needsInput (has_personalization && !metadata.personalization.input_received)
        const pendingPersonalizationConfig = getStatusConfig({
            status: ORDER_STATUS.PLACED,
            has_personalization: true,
            metadata: { personalization: { input_received: false } }
        });
        expect(pendingPersonalizationConfig.label).toBe('Design Input Needed');

        const packedConfig = getStatusConfig({ status: ORDER_STATUS.PACKED, has_personalization: false });
        expect(packedConfig.subLabel).toBe('quality check & packed');
    });

    it('should map PENDING_PERSONALIZATION to a user-friendly label', () => {
        expect(getOrderStatusDisplay('PENDING_PERSONALIZATION')).toBe('Awaiting your details');
    });

    it('should use success colors for PACKED status', () => {
        const color = getOrderStatusColor(ORDER_STATUS.PACKED);
        expect(color).toContain('well-success');
    });
});
