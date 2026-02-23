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
  color: string; // Tailwind class like 'bg-zinc-500'
  pulse: boolean;
}

// ✅ STRICT: Type derived directly from database enum
// We explicitly EXCLUDE deprecated values that might technically exist in DB but should never be used in code.
export type OrderStatus = Database['public']['Enums']['order_status'];

export const ORDER_STATUS = {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  DETAILS_RECEIVED: 'DETAILS_RECEIVED',
  PREVIEW_READY: 'PREVIEW_READY',
  CHANGE_REQUESTED: 'CHANGE_REQUESTED',
  APPROVED: 'APPROVED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  PACKED: 'PACKED',
  DISPATCHED: 'DISPATCHED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  INPUT_RECEIVED: 'INPUT_RECEIVED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  // Swiggy 2026 Aliases
  PREPARING: 'IN_PRODUCTION',
  READY: 'PACKED',
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
  // Swiggy 2026: Check metadata flags instead of separate column
  const needsInput = order.has_personalization && !personalizationData.input_received;
  const previewReady = order.has_personalization && personalizationData.preview_ready && !personalizationData.approved;

  if (needsInput && (order.status === ORDER_STATUS.PLACED || order.status === ORDER_STATUS.CONFIRMED)) {
    return {
      label: "Design Input Needed",
      subLabel: "Upload your design details now",
      icon: React.createElement(Sparkles, { className: "size-4 text-amber-500" }),
      color: "bg-amber-50",
      pulse: true
    };
  }

  // 2. Action Needed: Preview Approval
  if (previewReady) {
    return {
      label: "Preview Ready",
      subLabel: "Tap to approve and ship",
      icon: React.createElement(Package, { className: "size-4 text-emerald-500" }),
      color: "bg-emerald-50",
      pulse: true
    };
  }

  // 1.5 Action Needed: Wait for Confirmation
  if (order.status === ORDER_STATUS.PLACED) {
    return {
      label: "Order Placed",
      subLabel: "Waiting for partner to accept",
      icon: React.createElement(Clock, { className: "size-4 text-zinc-400" }),
      color: "bg-zinc-50",
      pulse: true
    };
  }

  // 3. Status Display
  return {
    label: `Order #${order.order_number || (order.id ? order.id.slice(0, 8) : '...')}`,
    subLabel: getOrderStatusDisplay(order.status).toLowerCase(),
    icon: React.createElement(Clock, { className: "size-4 text-zinc-400" }),
    color: "bg-zinc-50",
    pulse: false
  };
}

// Type guard to validate status strings
export function isValidOrderStatus(status: string): status is OrderStatus {
  return Object.values(ORDER_STATUS).includes(status as any);
}

// Helper to get all valid statuses
export function getAllOrderStatuses(): OrderStatus[] {
  return [
    'PLACED', 'CONFIRMED', 'DETAILS_RECEIVED', 'PREVIEW_READY', 'CHANGE_REQUESTED', 'APPROVED',
    'IN_PRODUCTION', 'PACKED', 'DISPATCHED', 'DELIVERED',
    'CANCELLED', 'REFUNDED', 'INPUT_RECEIVED', 'REVISION_REQUESTED', 'OUT_FOR_DELIVERY'
  ];
}

// Display labels for statuses - Wyshkit 2026 Lean State Machine
const STATUS_DISPLAY: Record<string, string> = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Accepted',
  DETAILS_RECEIVED: 'Details Received',
  PREVIEW_READY: 'Preview Ready',
  CHANGE_REQUESTED: 'Change Requested',
  APPROVED: 'Approved',
  IN_PRODUCTION: 'Preparing Order',
  PACKED: 'Ready',
  DISPATCHED: 'Dispatched',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  INPUT_RECEIVED: 'Input Received',
  REVISION_REQUESTED: 'Revision Requested'
};

// Color classes for statuses - Wyshkit 2026 Design Language
// Optimized for inclusive GST and high-contrast accessibility
const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-rose-50 text-[var(--primary)] border-rose-100',
  CONFIRMED: 'bg-emerald-50 text-[#60B246] border-emerald-100',
  DETAILS_RECEIVED: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  PREVIEW_READY: 'bg-blue-50 text-blue-600 border-blue-100',
  CHANGE_REQUESTED: 'bg-amber-50 text-amber-600 border-amber-100',
  APPROVED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  IN_PRODUCTION: 'bg-amber-50 text-amber-600 border-amber-100',
  PACKED: 'bg-emerald-50 text-[#60B246] border-emerald-100',
  DISPATCHED: 'bg-amber-50 text-amber-600 border-amber-100',
  OUT_FOR_DELIVERY: 'bg-amber-50 text-amber-600 border-amber-100',
  DELIVERED: 'bg-emerald-50 text-[#60B246] border-emerald-100',
  CANCELLED: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  REFUNDED: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  INPUT_RECEIVED: 'bg-blue-50 text-blue-600 border-blue-100',
  REVISION_REQUESTED: 'bg-amber-50 text-amber-600 border-amber-100'
};

export function getOrderStatusDisplay(status: string): string {
  return STATUS_DISPLAY[status as OrderStatus] || status.replace(/_/g, ' ');
}

export function getOrderStatusColor(status: string): string {
  return STATUS_COLORS[status as OrderStatus] || 'bg-zinc-50 text-zinc-400 border-zinc-100';
}

// Status grouping helpers (for UI/logic)
export const STATUS_GROUPS = {
  CUSTOMER_ACTION: [] as const,

  // Partner action required
  PARTNER_ACTION: [
    ORDER_STATUS.PLACED, // 2026: Partner needs to Accept
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.IN_PRODUCTION,
  ] as const,

  // In progress
  IN_PROGRESS: [
    ORDER_STATUS.IN_PRODUCTION,
    ORDER_STATUS.PACKED,
    ORDER_STATUS.DISPATCHED,
    ORDER_STATUS.OUT_FOR_DELIVERY,
  ] as const,

  // Completed
  COMPLETED: [
    ORDER_STATUS.DELIVERED,
  ] as const,

  // Terminal states
  TERMINAL: [
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.REFUNDED,
    ORDER_STATUS.DELIVERED, // Delivered is terminal for the standard flow
  ] as const,
} as const;

/**
 * WYSHKIT 2026: Deterministic State Machine Helpers
 */
export function isFinalStatus(status: string): boolean {
  return [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(status as any);
}

export function canCancelOrder(status: string): boolean {
  return [ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED].includes(status as any);
}
// WYSHKIT 2026: Item-level status configuration
// Used by OrderItemsList and CreativeBrief for consistent item status badges
export function getItemStatusConfig(status: string) {
  const s = (status || '').toUpperCase();

  if (s === 'WAITING_FOR_INPUT' || s === 'AWAITING_DETAILS') {
    return {
      label: 'ACTION REQ.',
      color: 'text-amber-700 bg-amber-50 border-amber-200 shadow-sm shadow-amber-100/50',
      icon: Sparkles
    };
  }

  if (s === 'DETAILS_SHARED' || s === 'DETAILS_RECEIVED') {
    return {
      label: 'Reviewing',
      color: 'text-zinc-600 bg-zinc-100 border-zinc-200',
      icon: Clock
    };
  }

  if (s === 'PREVIEW_READY') {
    return {
      label: 'REVIEW REQ.',
      color: 'text-rose-700 bg-rose-50 border-rose-200 shadow-sm shadow-rose-100/50',
      icon: PreviewIcon
    };
  }

  if (s === 'APPROVED' || s === 'IN_PRODUCTION') {
    return {
      label: 'Preparing',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: Package
    };
  }

  if (s === 'PACKED') {
    return {
      label: 'Ready',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: CheckCircle2
    };
  }

  return {
    label: s.toLowerCase(),
    color: 'text-zinc-700 bg-zinc-100 border-zinc-200',
    icon: Clock
  };
}

// Internal icon mapping to avoid name collision with Clock
const PreviewIcon = (props: any) => React.createElement(AlertCircle, props);
