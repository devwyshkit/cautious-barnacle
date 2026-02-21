'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'
import type { DiscountType } from '@/lib/types/admin.types'
import type { Json } from '@/lib/supabase/database.types'

// Partner actions
export async function approvePartnerKYC(partnerId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('partners')
    .update({ kyc_status: 'ACTIVE', is_active: true })
    .eq('id', partnerId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/partners')
}

export async function rejectPartnerKYC(partnerId: string, reason: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('partners')
    .update({ kyc_status: 'REJECTED', is_active: false })
    .eq('id', partnerId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/partners')
}

export async function togglePartnerStatus(partnerId: string, isActive: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('partners')
    .update({ is_active: isActive })
    .eq('id', partnerId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/partners')
}

export async function updatePartnerCommission(partnerId: string, rate: number) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('partners')
    .update({ commission_percentage: rate })
    .eq('id', partnerId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/partners')
}

// Order actions
export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status: status as unknown as "PLACED" | "CONFIRMED" | "DETAILS_RECEIVED" | "PREVIEW_READY" | "CHANGE_REQUESTED" | "APPROVED" | "IN_PRODUCTION" | "PACKED" | "DISPATCHED" | "DELIVERED" | "CANCELLED" | "REFUNDED" | "INPUT_RECEIVED" | "REVISION_REQUESTED" | "OUT_FOR_DELIVERY" })
    .eq('id', orderId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
}

// Item actions
export async function toggleItemStatus(itemId: string, isActive: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('items')
    .update({ is_active: isActive })
    .eq('id', itemId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/catalog')
}

/**
 * WYSHKIT 2026: Approve item for public visibility
 * Swiggy Pattern: Admin approval gate for items
 */
export async function approveItem(itemId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('items')
    .update({ approval_status: 'approved' })
    .eq('id', itemId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/catalog')
  revalidatePath('/')
}

/**
 * WYSHKIT 2026: Reject item (requires reason)
 */
export async function rejectItem(itemId: string, reason: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('items')
    .update({
      approval_status: 'rejected',
      // Store rejection reason in description or a separate field if needed
    })
    .eq('id', itemId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/catalog')
}

/**
 * WYSHKIT 2026: Bulk approve items (for efficiency)
 */
export async function bulkApproveItems(itemIds: string[]) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('items')
    .update({ approval_status: 'approved' })
    .in('id', itemIds)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/catalog')
  revalidatePath('/')
}

export async function toggleItemSponsored(itemId: string, isSponsored: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('items')
    .update({ is_sponsored: isSponsored })
    .eq('id', itemId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/catalog')
}

// Category actions
export async function createCategory(name: string, slug: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('categories').insert({
    name,
    slug: slug.toLowerCase().replace(/\s+/g, '-'),
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

export async function updateCategory(id: string, name: string, slug: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .update({ name, slug })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

export async function toggleCategoryStatus(id: string, isActive: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

// Coupon actions
export async function createCoupon(data: {
  code: string
  discount_type: DiscountType
  discount_value: number
  min_order_value?: number
  max_discount_amount?: number
  usage_limit?: number
}) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('coupons').insert(data)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/coupons')
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('coupons')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/coupons')
}

// Serviceability actions
export async function addPincode(pincode: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('serviceable_pincodes').insert({
    pincode,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/serviceability')
}

export async function togglePincodeStatus(id: string, isActive: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('serviceable_pincodes')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/serviceability')
}

export async function deletePincode(id: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('serviceable_pincodes')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/serviceability')
}

// Payout actions
export async function processPartnerPayout(payoutId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('partner_payouts')
    .update({
      status: 'processed',
      processed_at: new Date().toISOString(),
    })
    .eq('id', payoutId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/payouts')
}

// Return actions
export async function approveReturn(returnId: string, refundAmount: number) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('returns')
    .update({
      status: 'approved',
      refund_amount: refundAmount,
      processed_at: new Date().toISOString(),
    })
    .eq('id', returnId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/returns')
}

export async function rejectReturn(returnId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('returns')
    .update({
      status: 'rejected',
      processed_at: new Date().toISOString(),
    })
    .eq('id', returnId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/returns')
}

// Campaign and cashback actions removed: campaigns and cashback_rules tables do not exist in schema (Option B)
export async function createCampaign(data: any) {
  throw new Error('Campaigns are currently disabled')
}

export async function toggleCampaignStatus(id: string, isActive: boolean) {
  throw new Error('Campaigns are currently disabled')
}

export async function createCashbackRule(data: any) {
  throw new Error('Cashback rules are currently disabled')
}

export async function toggleCashbackRuleStatus(id: string, isActive: boolean) {
  throw new Error('Cashback rules are currently disabled')
}

// Wallet actions
export async function creditWallet(userId: string, amount: number, description: string) {
  await requireAdmin()
  const supabase = await createClient()

  // First, update or create wallet
  const { data: existing } = await supabase
    .from('wyshkit_money')
    .select('user_id, balance')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('wyshkit_money')
      .update({ balance: (existing.balance || 0) + amount })
      .eq('user_id', existing.user_id)
  } else {
    await supabase
      .from('wyshkit_money')
      .insert({ user_id: userId, balance: amount })
  }

  // Log transaction
  await supabase.from('wyshkit_money_transactions').insert({
    user_id: userId,
    amount,
    type: 'credit',
    description,
  })

  revalidatePath('/admin/wallet')
}

// Settings actions
export async function updateSetting(key: string, value: string | number | boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('app_settings')
    .upsert({
      key,
      value: value as unknown as Json,
      updated_at: new Date().toISOString(),
    })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/settings')
}
