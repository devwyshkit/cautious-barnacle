/**
 * Order Status Types - STRICTLY Derived from Supabase Database Enum
 * 
 * This file is the SINGLE SOURCE OF TRUTH for order status values.
 * All status values must match the database enum exactly (UPPERCASE).
 * 
 * Database Enum: Database['public']['Enums']['order_status']
 * 
 * NEVER create custom status constants. Always use this file.
 */

import type { Database } from '@/lib/supabase/database.types';
import { Sparkles, Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import React from 'react';

export interface StatusConfig {
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  color: string; // Tailwind class like 'bg-[var(--surface-muted)]0'
  pulse: boolean;
}

// ✅ STRICT: Type derived directly from database enum
// We explicitly EXCLUDE deprecated values that might technically exist in DB but should never be used in code.
export type OrderStatus = Database['public']['Enums']['order_status'];

export const ORDER_STATUS = {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  PACKED: 'PACKED',
  RIDER_ASSIGNED: 'RIDER_ASSIGNED',
  ARRIVED_PICKUP: 'ARRIVED_PICKUP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  ARRIVED_DROP: 'ARRIVED_DROP',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const satisfies Record<string, OrderStatus>;

export const PERSONALIZATION_STATUS = {
  PENDING: 'pending',
  PREVIEW_READY: 'preview_ready',
  REVISION_REQUESTED: 'change_requested',
  APPROVED: 'approved'
} as const;

// WYSHKIT 2026: Centralized Status Configuration
// Used by OrderTrackingBar and OrderTracker for consistent UI
export function getStatusConfig(order: {
  status: string;
  has_personalization: boolean;
  order_number?: string;
  id?: string;
  metadata?: any;
}): StatusConfig {
  const metadata = order.metadata || {};
  const personalizationData = metadata.personalization || {};

  // 1. Action Needed: Personalization (STRICT: Only if has_personalization is true)
  const needsInput = order.has_personalization && !personalizationData.input_received;
  const previewReady = order.has_personalization && personalizationData.preview_ready && !personalizationData.approved;

  if (needsInput && (order.status === ORDER_STATUS.PLACED || order.status === ORDER_STATUS.CONFIRMED)) {
    return {
      label: "Design Input Needed",
      subLabel: "Upload your design details now",
      icon: React.createElement(Sparkles, { className: "size-4 text-[var(--warning)]" }),
      color: "bg-[var(--well-warning)]",
      pulse: true
    };
  }

  // 2. Action Needed: Preview Approval
  if (previewReady) {
    return {
      label: "Preview Ready",
      subLabel: "Tap to approve and ship",
      icon: React.createElement(Package, { className: "size-4 text-[var(--success)]" }),
      color: "bg-[var(--well-success)]",
      pulse: true
    };
  }

  // 1.5 Action Needed: Wait for Confirmation
  if (order.status === ORDER_STATUS.PLACED) {
    return {
      label: "Order Placed",
      subLabel: "Waiting for vendor to accept",
      icon: React.createElement(Clock, { className: "size-4 text-[var(--text-tertiary)]" }),
      color: "bg-[var(--surface-muted)]",
      pulse: true
    };
  }

  // 3. Status Display
  return {
    label: `Order #${order.order_number || (order.id ? order.id.slice(0, 8) : '...')}`,
    subLabel: getOrderStatusDisplay(order.status).toLowerCase(),
    icon: React.createElement(Clock, { className: "size-4 text-[var(--text-tertiary)]" }),
    color: "bg-[var(--surface-muted)]",
    pulse: false
  };
}

// Type guard to validate status strings
export function isValidOrderStatus(status: string): status is OrderStatus {
  return Object.values(ORDER_STATUS).includes(status as any);
}

// Helper to get all valid statuses
export function getAllOrderStatuses(): OrderStatus[] {
  return Object.values(ORDER_STATUS);
}

// Display labels for statuses - Wyshkit 2026 Lean State Machine
const STATUS_DISPLAY: Record<string, string> = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Accepted',
  IN_PRODUCTION: 'Being Prepared',
  PACKED: 'Quality Check & Packed',
  RIDER_ASSIGNED: 'Rider Assigned',
  ARRIVED_PICKUP: 'Rider at Vendor',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  ARRIVED_DROP: 'Rider at Destination',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  PENDING_PERSONALIZATION: 'Awaiting your details',
};

// Color classes for statuses - Wyshkit 2026 Design Language
const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-[var(--well-destructive)] text-[var(--primary)] border-[var(--destructive)]/20',
  CONFIRMED: 'bg-[var(--well-success)] text-[var(--success)] border-[var(--success)]/20',
  IN_PRODUCTION: 'bg-[var(--well-warning)] text-[var(--warning)] border-[var(--warning)]/20',
  PACKED: 'bg-[var(--well-success)] text-[var(--success)] border-[var(--success)]/20',
  RIDER_ASSIGNED: 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]',
  ARRIVED_PICKUP: 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]',
  OUT_FOR_DELIVERY: 'bg-[var(--well-warning)] text-[var(--warning)] border-[var(--warning)]/20',
  ARRIVED_DROP: 'bg-[var(--well-success)] text-[var(--success)] border-[var(--success)]/20',
  DELIVERED: 'bg-[var(--well-success)] text-[var(--success)] border-[var(--success)]/20',
  CANCELLED: 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]',
  REFUNDED: 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]',
  // Personalization Statuses (v_order_tracking maps these)
  PENDING_PERSONALIZATION: 'bg-[var(--well-warning)] text-[var(--warning)] border-[var(--warning)]/20',
  pending: 'bg-[var(--well-warning)] text-[var(--warning)] border-[var(--warning)]/20',
  preview_ready: 'bg-[var(--well-success)] text-[var(--success)] border-[var(--success)]/20',
  change_requested: 'bg-[var(--well-destructive)] text-[var(--destructive)] border-[var(--destructive)]/20',
  approved: 'bg-[var(--well-success)] text-[var(--success)] border-[var(--success)]/20',
};

export function getOrderStatusDisplay(status: string): string {
  return STATUS_DISPLAY[status as OrderStatus] || status.replace(/_/g, ' ');
}

export function getOrderStatusColor(status: string): string {
  return STATUS_COLORS[status as OrderStatus] || 'bg-[var(--surface-muted)] text-[var(--text-tertiary)] border-[var(--border)]';
}

// WYSHKIT 2026: Minimal Status Tracking
const ORDER_TRACKING_STEPS = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.IN_PRODUCTION,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.RIDER_ASSIGNED,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED
];

export function getOrderTrackingSteps() {
  return ORDER_TRACKING_STEPS;
}

/**
 * WYSHKIT 2026: Deterministic State Machine Helpers
 */
export function isFinalStatus(status: string): boolean {
  return [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(status as any);
}

export function canCancelOrder(status: string): boolean {
  return [ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED].includes(status as any);
}
// WYSHKIT 2026: Order Product Status Configuration
export function getProductStatusConfig(productStatus: string) {
  // Map legacy product statuses to the lean model if needed
  const display = STATUS_DISPLAY[productStatus] || productStatus;
  const color = STATUS_COLORS[productStatus] || 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]';

  return {
    label: display,
    color,
    icon: [ORDER_STATUS.DELIVERED].includes(productStatus as any) ? CheckCircle2 : Package,
    isComplete: productStatus === ORDER_STATUS.DELIVERED,
    isProcessing: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.IN_PRODUCTION, ORDER_STATUS.PACKED, ORDER_STATUS.OUT_FOR_DELIVERY].includes(productStatus as any)
  };
}
