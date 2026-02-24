/**
 * Admin types derived from Supabase database types
 */

import type { Tables } from '@/lib/supabase/types'

// Base table types from Supabase
export type Vendor = Tables<'vendors'> & {
  kyc_status?: string | null; // UI Alias
  onboarding_status?: string | null; // UI Alias
  name?: string | null; // UI Alias
  whatsapp_number?: string | null; // UI Alias
  whatsapp_phoneNumber?: string | null; // UI Alias
}
export type Order = Tables<'orders'>
export type Product = Tables<'products'>
export type Category = Tables<'categories'>
export type Coupon = Tables<'coupons'>
export type User = Tables<'users'>
export type ServiceablePincode = any

// Admin session
export interface AdminSession {
  id: string
  email: string | null
  phone: string
  name: string | null
  role: string
}

// Dashboard metrics
export interface DashboardMetrics {
  gmv_today: number
  orders_today: number
  active_partners: number
  pending_kyc: number
}

// Vendor with joined data for lists
export interface PartnerWithStats extends Omit<Vendor, 'total_orders'> {
  total_orders?: number | null
  total_gmv?: number
  total_items?: number
}

// Order with joined data for lists
export interface OrderWithRelations extends Order {
  vendor: Pick<Vendor, 'id' | 'name' | 'business_name'> | null
  user: Pick<User, 'id' | 'full_name' | 'phone'> | null
}

// Product with joined data for catalog
export interface ItemWithRelations extends Product {
  vendor: Pick<Vendor, 'id' | 'name' | 'business_name'> | null
}

// KYC status values
export const KYC_STATUS = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
} as const

export type KYCStatus = (typeof KYC_STATUS)[keyof typeof KYC_STATUS]

// Order status values
export const ORDER_STATUS = {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  PACKED: 'PACKED',
  DISPATCHED: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

// Discount type
export const DISCOUNT_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const

export type DiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE]
