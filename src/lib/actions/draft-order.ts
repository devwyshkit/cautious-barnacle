'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logging/logger'

function revalidateCartPaths() {
  revalidatePath('/')
  revalidatePath('/checkout')
}
import { DraftTransaction, DraftLineItem, SelectedPersonalization, SelectedAddon } from '@/lib/types/personalization'
import { calculateItemPrice, calculateCartSubtotal } from '@/lib/utils/pricing'
import { logError, handleActionError } from '@/lib/utils/error-handler'
import { getGuestSessionId, getGuestSessionIdReadOnly } from '@/lib/session'
import { DBItem, DBVariant } from '@/lib/supabase/types'
import { createAdminClient } from '@/lib/supabase/server'
import type { Database, Json } from '@/lib/supabase/database.types'

// Define interfaces for View and Join results
interface CartItemView {
  id: string;
  item_id: string;
  item_name: string;
  item_image: string;
  quantity: number;
  variant_price: number | null;
  base_price: number | null;
  selected_variant_id: string | null;
  personalization: SelectedPersonalization | null;
  selected_addons: SelectedAddon[] | null;
  partner_name: string | null;
  partner_id: string | null;
  user_id?: string | null;
  session_id?: string | null;
}

/** Raw row from getCart query (cart_items + joined items, partners, variants). */
interface CartItemRawRow {
  id: string;
  item_id: string;
  quantity: number;
  selected_variant_id: string | null;
  personalization: SelectedPersonalization | null;
  selected_addons: SelectedAddon[] | null;
  user_id?: string | null;
  session_id?: string | null;
  items?: {
    id: string;
    name: string | null;
    base_price: number | null;
    images: string[] | null;
    partner_id?: string | null;
    partners?: { name: string | null } | null;
  } | null;
  variants?: { price: number | null } | null;
}

interface ItemWithVariants extends Pick<DBItem, 'id' | 'name' | 'base_price' | 'images' | 'partner_id'> {
  variants: Pick<DBVariant, 'id' | 'name' | 'price'>[];
}

/** WYSHKIT 2026: Max quantity per line (Swiggy-style cap). */
const MAX_ITEM_QUANTITY = 10;

/** Cart identity for remounting CartProvider when guest → user (so merged cart is shown). */
export type GetCartResult = {
  cart?: DraftTransaction
  error?: string
  cartIdentity?: string
  /** For guests: session id so client can filter realtime (no leak). Omitted when user. */
  guestSessionId?: string | null
}

export async function getCart(): Promise<GetCartResult> {
  try {
    const supabase = await createClient();

    // WYSHKIT 2026: Get Cart Identity (Auth or Session)
    const { data: { user } } = await supabase.auth.getUser()
    const guestSessionId = !user ? await getGuestSessionIdReadOnly() : null

    if (!user && !guestSessionId) {
      return {
        cart: { items: [], partner_id: null, subtotal: 0, total: 0, item_count: 0 },
        cartIdentity: 'empty',
        guestSessionId: null
      }
    }

    const cartIdentity = user?.id ?? guestSessionId ?? 'empty'

    // Fetch unified cart rows from v_active_cart_totals
    const { data: totalsData, error: totalsError } = await supabase
      .from('v_active_cart_totals')
      .select('pricing')
      .or(user ? `user_id.eq.${user.id}` : `session_id.eq.${guestSessionId}`)
      .maybeSingle();

    if (totalsError) {
      logError(totalsError, 'GetCartTotals');
    }

    // Fetch individual cart items for detailed listing
    let itemsQuery = supabase
      .from('cart_items')
      .select(`
        id,
        item_id,
        quantity,
        selected_variant_id,
        personalization,
        selected_addons,
        items:items (
          id,
          name,
          base_price,
          images,
          partner_id,
          partners:partners (
            name,
            latitude,
            longitude
          ),
          personalization_options (*),
          item_addons (*)
        ),
        variants:variants (
          name,
          price
        )
      `)
      .order('id');

    if (user) {
      itemsQuery = itemsQuery.eq('user_id', user.id);
    } else {
      itemsQuery = itemsQuery.eq('session_id', guestSessionId!);
    }

    const { data: itemRows, error: itemsError } = await itemsQuery;

    if (itemsError) {
      logError(itemsError, 'GetCartItems');
    }

    const dbPricing = (totalsData?.pricing as unknown as { subtotal: number; total: number }) || { subtotal: 0, total: 0 };

    // Map DB items to frontend MappedCartItem objects
    const items: DraftLineItem[] = (itemRows || []).map(row => {
      const itemNode = row.items as any;
      const itemBasePrice = Number(itemNode?.base_price || 0);
      const variantNode = row.variants as any;
      const variantPrice = variantNode?.price != null ? Number(variantNode.price) : null;
      const unitPrice = variantPrice !== null ? variantPrice : itemBasePrice;
      const quantity = Number(row.quantity) || 1;

      const selectedAddons = (row.selected_addons as unknown as SelectedAddon[]) || [];
      const addonsPrice = selectedAddons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);

      const personalization = (row.personalization as unknown as SelectedPersonalization) || undefined;
      const personalizationPrice = (personalization?.price || 0);

      return {
        id: row.id,
        item_id: row.item_id,
        item_name: itemNode?.name || 'Product',
        item_image: itemNode?.images?.[0] || '/placeholder.png',
        quantity: quantity,
        unit_price: unitPrice,
        total_price: (unitPrice + addonsPrice + personalizationPrice) * quantity,
        selected_variant_id: row.selected_variant_id,
        personalization: personalization,
        selected_addons: selectedAddons,
        partner_name: itemNode?.partners?.name || 'Store',
        partner_id: itemNode?.partner_id,
        partner_latitude: itemNode?.partners?.latitude,
        partner_longitude: itemNode?.partners?.longitude,
        base_price: itemBasePrice,
        variant_price: variantPrice,
        variant_name: variantNode?.name,
        personalization_price: personalizationPrice,
        addons_price: addonsPrice,
        personalization_options: (itemNode?.personalization_options as any[]) || [],
        item_addons: (itemNode?.item_addons as any[]) || [],
        is_personalized: !!personalization?.enabled,
        personalization_details: personalization?.enabled ? personalization : null
      } as DraftLineItem;
    });

    const partnerIds = new Set(items.map(item => item.partner_id).filter(Boolean));
    const partnerId = partnerIds.size === 1 ? Array.from(partnerIds)[0] as string : null;

    const cart: DraftTransaction = {
      items,
      partner_id: partnerId as string | null,
      subtotal: Number(dbPricing.subtotal) || 0,
      total: Number(dbPricing.total) || 0,
      item_count: items.reduce((sum, item) => sum + item.quantity, 0),
    };

    return {
      cart,
      cartIdentity,
      guestSessionId
    };
  } catch (error) {
    logError(error, 'GetCart');
    return {
      cart: { items: [], partner_id: null, subtotal: 0, total: 0, item_count: 0 },
      error: error instanceof Error ? error.message : 'Failed to fetch cart',
      cartIdentity: 'error-fallback',
      guestSessionId: null
    };
  }
}

/**
 * WYSHKIT 2026: Merge guest cart into logged-in user (Swiggy 2026 pattern).
 * Call after verifyOTP success so cart is not lost on login.
 * Uses service role because RLS does not allow user to UPDATE rows with user_id = null.
 */
export async function mergeGuestCartToUser(): Promise<{ merged: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { merged: false };

    const guestSessionId = await getGuestSessionIdReadOnly();
    if (!guestSessionId) return { merged: true };

    const admin = await createAdminClient();
    const { error } = await admin
      .from('cart_items')
      .update({ user_id: user.id, session_id: null })
      .eq('session_id', guestSessionId);

    if (error) {
      logError(error, 'MergeGuestCartToUser');
      return { merged: false, error: error.message };
    }
    return { merged: true };
  } catch (err) {
    logError(err, 'MergeGuestCartToUser');
    return { merged: false, error: err instanceof Error ? err.message : 'Merge failed' };
  }
}

/**
 * WYSHKIT 2026: addToCart with Deferred Authentication Support
 */
export async function addToCart(payload: {
  item_id: string
  variant_id?: string | null
  personalization?: SelectedPersonalization
  selected_addons?: SelectedAddon[]
  quantity?: number
}) {
  try {
    const { item_id, variant_id: raw_variant_id, personalization, selected_addons, quantity: raw_qty = 1 } = payload

    // WYSHKIT 2026: Strict UUID Guard
    if (!item_id || item_id.trim() === '') {
      return { error: 'Invalid Item ID', code: 'INVALID_ID' }
    }

    const variant_id = (raw_variant_id && raw_variant_id.trim() !== '') ? raw_variant_id : null

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()
    const session_id = !user ? await getGuestSessionId() : null

    const quantity = Math.min(Math.max(1, Math.floor(Number(raw_qty) || 1)), MAX_ITEM_QUANTITY)

    const [item_res, cart_res, variants_res] = await Promise.all([
      supabase.from('items')
        .select('partner_id, is_active')
        .eq('id', item_id)
        .eq('is_active', true)
        .maybeSingle(),
      (async () => {
        let query = supabase.from('cart_items')
          .select('id, item_id, quantity, selected_variant_id, personalization, selected_addons')

        if (user) {
          query = query.eq('user_id', user.id)
        } else if (session_id) {
          query = query.eq('session_id', session_id)
        }
        return query;
      })(),
      supabase.from('variants').select('id, stock_quantity').eq('item_id', item_id).limit(1),
    ])

    const { data: item, error: item_error } = item_res;
    const { data: cart_items_data, error: cart_error } = (await cart_res);
    const cart_items = (cart_items_data as unknown as CartItemRawRow[]) || [];
    const variant_rows = variants_res.data;

    if (item_error || !item) return { error: 'Item not found' }
    if (cart_error) throw cart_error

    // WYSHKIT 2026: Require variant when item has variants (Swiggy-style)
    let has_variants = Array.isArray(variant_rows) && variant_rows.length > 0
    if (has_variants && (variant_id == null)) {
      return { error: 'Please select an option', code: 'VARIANT_REQUIRED' }
    }

    // 0. STOCK CHECK (Swiggy 2026: Inventory Soft-Lock)
    const normalized_personalization = personalization || { enabled: false }
    const personalization_key = normalized_personalization.enabled
      ? `enabled:${(normalized_personalization as any).option_id || 'default'}`
      : 'disabled'

    // Addons Key Generation (Sorted IDs for consistency)
    const addons_key = (selected_addons || [])
      .map(a => a.id)
      .sort()
      .join(',');

    const duplicate_item = cart_items?.find((ci) => {
      if (ci.item_id !== item_id) return false

      const ci_variant = ci.selected_variant_id || null
      const payload_variant = variant_id || null
      if (ci_variant !== payload_variant) return false

      const ci_pers = ci.personalization || { enabled: false }
      const ci_key = ci_pers.enabled
        ? `enabled:${(ci_pers as any).option_id || 'default'}`
        : 'disabled'

      const ci_addons_key = (ci.selected_addons || [])
        .map((a) => a.id)
        .sort()
        .join(',')

      return ci_key === personalization_key && ci_addons_key === addons_key
    })

    // 1. Stock Check (Unified Authority - Zero Reinvention)
    let available_stock_number = 0;

    const { data: available_stock, error: stock_error } = await supabase.rpc('get_available_stock', {
      p_item_id: !variant_id ? item_id : undefined,
      p_variant_id: variant_id || undefined,
      p_exclude_user_id: user?.id || undefined,
      p_exclude_session_id: session_id || undefined
    });

    if (stock_error) {
      // Swiggy 2026: Robust Fallback - If RPC fails (e.g. missing in env), fallback to basic stock check
      logger.warn('Stock RPC failed, falling back to direct check', stock_error as unknown as Record<string, unknown>);

      if (variant_id) {
        const { data: v_data } = await supabase.from('variants').select('stock_quantity').eq('id', variant_id).single();
        available_stock_number = v_data?.stock_quantity ?? 0;
      } else {
        const { data: i_data } = await supabase.from('items').select('stock_quantity').eq('id', item_id).single();
        available_stock_number = i_data?.stock_quantity ?? 0;
      }
    } else {
      available_stock_number = Number(available_stock) || 0;
    }

    if (available_stock_number < quantity) {
      const { data: item_data } = await supabase.from('items').select('name').eq('id', item_id).single();
      let display_name = item_data?.name || 'Item';
      if (variant_id) {
        const { data: v_data } = await supabase.from('variants').select('name').eq('id', variant_id).single();
        if (v_data?.name) display_name += ` (${v_data.name})`;
      }
      return { error: `Insufficient stock for "${display_name}". Only ${Math.max(0, available_stock_number)} available.`, code: 'OUT_OF_STOCK' };
    }

    // 2. Partner Mismatch Check (Swiggy 2026: Single Partner Enforcement)
    if (cart_items && cart_items.length > 0) {
      const existing_item_id = cart_items[0].item_id;
      const { data: existing_item_data } = await supabase.from('items').select('partner_id').eq('id', existing_item_id).maybeSingle();
      const current_cart_partner_id = existing_item_data?.partner_id;

      if (current_cart_partner_id && current_cart_partner_id !== item.partner_id) {
        return { error: 'Transaction already in progress with another partner', code: 'PARTNER_MISMATCH', requiresCartClear: true }
      }
    }

    const new_qty = duplicate_item ? Math.min(duplicate_item.quantity + quantity, MAX_ITEM_QUANTITY) : quantity
    let cart_item_id = duplicate_item?.id;

    if (duplicate_item) {
      await supabase.from('cart_items').update({ quantity: new_qty, updated_at: new Date().toISOString() }).eq('id', duplicate_item.id)
    } else {
      const { data: new_item, error: insert_error } = await supabase.from('cart_items').insert({
        user_id: user?.id ?? null,
        session_id: user ? null : session_id,
        item_id: item_id,
        quantity: new_qty,
        selected_variant_id: variant_id,
        personalization: normalized_personalization as unknown as Json,
        selected_addons: (selected_addons || []) as unknown as Json,
      }).select('id').single();
      if (insert_error) throw insert_error;
      cart_item_id = new_item.id;
    }

    if (cart_item_id) {
      const expires_at = new Date();
      expires_at.setMinutes(expires_at.getMinutes() + 10);
      const { data: existing_res } = await supabase.from('cart_reservations').select('id').eq('cart_item_id', cart_item_id).maybeSingle();
      if (existing_res) {
        await supabase.from('cart_reservations').update({ quantity: new_qty, expires_at: expires_at.toISOString(), reserved_at: new Date().toISOString() }).eq('id', existing_res.id);
      } else {
        await supabase.from('cart_reservations').insert({ cart_item_id: cart_item_id, item_id: item_id, variant_id: variant_id, quantity: new_qty, expires_at: expires_at.toISOString() } as any);
      }
    }

    revalidateCartPaths()
    const cart_result = await getCart();
    return cart_result.cart ? { success: true, cart: cart_result.cart } : { success: true };

  } catch (error) {
    logError(error, 'AddToDraftOrder')
    return handleActionError(error)
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    // WYSHKIT 2026: Strict UUID Guard
    if (!cartItemId || cartItemId.trim() === '') {
      return { error: 'Invalid Cart Item ID', code: 'INVALID_ID' }
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()
    const sessionId = !user ? await getGuestSessionId() : null

    const queryBase = supabase.from('cart_items');
    const cappedQty = Math.min(Math.max(0, Math.floor(Number(quantity) || 0)), MAX_ITEM_QUANTITY);

    // Get current item to check stock increase
    const { data: currentItem } = await queryBase.select('id, item_id, selected_variant_id, quantity').eq('id', cartItemId).single();
    if (!currentItem) return { error: 'Item not found' };

    if (cappedQty > currentItem.quantity) {
      const qtyNeeded = cappedQty - currentItem.quantity;

      // Unified Stock Check (Zero Reinvention)
      const { data: availableStock, error: stockError } = await supabase.rpc('get_available_stock', {
        p_item_id: !currentItem.selected_variant_id ? currentItem.item_id : undefined,
        p_variant_id: currentItem.selected_variant_id || undefined,
        p_exclude_user_id: user?.id || undefined,
        p_exclude_session_id: sessionId || undefined
      });

      if (stockError) {
        logger.error('Stock check failed', stockError);
        return { error: 'Stock check failed' };
      }

      if ((Number(availableStock) || 0) < qtyNeeded) {
        // Enrich error message
        const { data: itemData } = await supabase
          .from('items')
          .select('name')
          .eq('id', currentItem.item_id)
          .single();
        let displayName = itemData?.name || 'Item';
        if (currentItem.selected_variant_id) {
          const { data: vData } = await supabase
            .from('variants')
            .select('name')
            .eq('id', currentItem.selected_variant_id)
            .single();
          if (vData?.name) displayName += ` (${vData.name})`;
        }
        return { error: `Insufficient stock for "${displayName}". Only ${Number(availableStock)} more available.` };
      }
    }

    if (cappedQty <= 0) {
      await queryBase.delete().eq('id', cartItemId);
      // Cascade delete handles reservation
    } else {
      await queryBase.update({
        quantity: cappedQty,
        updated_at: new Date().toISOString()
      }).eq('id', cartItemId);

      // Update Reservation
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      const { data: existingRes } = await supabase.from('cart_reservations')
        .select('id')
        .eq('cart_item_id', cartItemId)
        .maybeSingle();

      if (existingRes) {
        await supabase.from('cart_reservations')
          .update({
            quantity: cappedQty,
            expires_at: expiresAt.toISOString(),
            reserved_at: new Date().toISOString()
          })
          .eq('id', existingRes.id);
      }
    }

    revalidateCartPaths()
    const cartResult = await getCart();
    return cartResult.cart
      ? { success: true, cart: cartResult.cart }
      : { success: true, error: cartResult.error };
  } catch (error) {
    logError(error, 'UpdateDraftOrderItemQuantity');
    return handleActionError(error);
  }
}

export async function removeCartItem(cartItemId: string) {
  return updateCartItemQuantity(cartItemId, 0)
}


export async function clearDraftOrder() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()
    const sessionId = !user ? await getGuestSessionId() : null

    let query = supabase.from('cart_items').delete()
    if (user) {
      query = query.eq('user_id', user.id)
    } else if (sessionId) {
      query = query.eq('session_id', sessionId)
    }
    await query

    // WYSHKIT 2026: Clear checkout state cookies
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.delete('applied_coupon')
    cookieStore.delete('use_wallet')
    cookieStore.delete('selected_address_id')
    cookieStore.delete('gstin')

    revalidateCartPaths()

    const emptyCart = { items: [], partner_id: null, subtotal: 0, total: 0, item_count: 0 };
    return { success: true, cart: emptyCart };
  } catch (error) {
    logError(error, 'ClearDraftOrder');
    return handleActionError(error);
  }
}

export async function getGuestCartDetails(payload: Array<{ item_id: string; quantity: number; variant_id?: string | null; personalization?: SelectedPersonalization; selected_addons?: SelectedAddon[] }>) {
  try {
    if (!payload.length) {
      return { cart: { items: [], partner_id: null, subtotal: 0, total: 0, item_count: 0 } }
    }

    const supabase = await createClient();
    const item_ids = payload.map(i => i.item_id)

    const query = supabase.from('v_item_listings')
      .select('id, name, image, base_price, partner_name, latitude, longitude')
      .eq('is_active', true)
      .in('id', item_ids);

    const { data: item_rows, error } = await query as { data: { id: string, name: string, image: string, base_price: number, partner_name: string, latitude: number, longitude: number }[] | null, error: any };

    if (error) throw error

    const items: DraftLineItem[] = payload.map(p => {
      const item = (item_rows || []).find((i: any) => i.id === p.item_id)
      if (!item) return null

      const base_price = Number(item.base_price) || 0;
      const selected_addons = p.selected_addons || [];
      const addons_price = (selected_addons).reduce((sum, addon) => sum + (Number(addon.price) || 0), 0);
      const personalization_price = (p.personalization?.price || 0);

      // Unit Price for UI (Base + Addons)
      const unit_price = base_price + addons_price;

      return {
        id: `guest-${p.item_id}`,
        item_id: p.item_id,
        item_name: item.name,
        item_image: item.image,
        quantity: p.quantity,
        unit_price: unit_price,
        total_price: (unit_price + personalization_price) * p.quantity,
        selected_variant_id: p.variant_id ?? null,
        personalization: p.personalization,
        selected_addons: selected_addons,
        partner_name: item.partner_name,
        // Hydration
        base_price: base_price,
        addons_price: addons_price,
        personalization_price: personalization_price,
        partner_latitude: item.latitude,
        partner_longitude: item.longitude
      } as DraftLineItem;
    }).filter((i): i is DraftLineItem => i !== null)

    // Verify items and compute totals atomicly if possible
    // (Actual placement happens in place_secure_order RPC)
    const { data: pricing, error: pricingError } = await (supabase as any).rpc('calculate_order_total', {
      p_cart_items: items.map(it => ({
        item_id: it.item_id,
        quantity: it.quantity,
        variant_id: it.selected_variant_id,
        has_personalization: !!it.personalization?.enabled,
        selected_addons: it.selected_addons
      })),
      p_delivery_fee_override: 40,
      p_distance_km: null,
      p_coupon_code: null,
      p_address_id: null,
      p_use_wallet: false,
      p_user_id: null
    }) as { data: any, error: any };


    if (pricingError) throw pricingError;

    return {
      success: true,
      data: {
        id: 'guest', // Placeholder for guest

        subtotal: pricing.subtotal,
        total: pricing.total,
        gst: pricing.gst,
        delivery_fee: pricing.delivery_fee,
        platform_fee: pricing.platform_fee,
        items
      }
    };
  } catch (error) {
    logError(error, 'GetGuestDraftOrderDetails')
    return { error: 'Failed to fetch guest draft order details' }
  }
}

export async function getItemPartner(itemId: string) {
  const supabase = await createClient();
  const query = supabase.from('items')
    .select('partner_id')
    .eq('id', itemId)
    .eq('is_active', true)
    .eq('approval_status', 'approved');

  const { data, error } = await query.maybeSingle();

  if (error || !data) return { data: null, error: 'Item not found' };
  return { data: data as { partner_id: string } };
}

export async function getPartnerInfo(partnerId: string) {
  try {
    const supabase = await createClient();
    const query = supabase.from('partners')
      .select('id, name, gstin, city') // Use city as address is missing
      .eq('id', partnerId)


    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return { data: null, error: 'Partner not found' };
    }

    return {
      data: {
        id: data.id,
        name: data.name,
        gstin: data.gstin || null,
        address: data.city || 'Bangalore, India'

      }
    };
  } catch (error) {
    logError(error, 'GetPartnerInfo');
    return { data: null, error: 'Failed to fetch partner info' };
  }
}

export async function getTransactionData(draft_items: Array<{ item_id: string; variant_id: string | null; personalization: SelectedPersonalization; selected_addons?: SelectedAddon[]; quantity: number }>) {
  try {
    const supabase = await createClient();

    if (draft_items.length === 0) {
      return {
        hydratedItems: [],
        upsellItems: [],
        error: null
      };
    }

    const item_ids = draft_items.map(item => item.item_id);

    // Fetch items with all needed relations
    // Using simple query structure for maximum reliability
    const [itemsRes, optionsRes, addonsRes] = await Promise.all([
      supabase.from('items')
        .select('id, name, images, partner_id, base_price, partners(latitude, longitude), variants(id, name, price)')
        .eq('is_active', true)
        .eq('approval_status', 'approved')
        .in('id', item_ids),
      supabase.from('personalization_options')
        .select('id, item_id, name, price, input_type')
        .in('item_id', item_ids)
        .eq('is_active', true),
      supabase.from('item_addons')
        .select('*')
        .in('item_id', item_ids)
        .eq('is_active', true)
    ]);

    const { data: itemsData, error: itemsError } = itemsRes;

    if (itemsError || !itemsData || itemsData.length === 0) {
      return {
        hydratedItems: [],
        upsellItems: [],
        error: 'Items not found'
      };
    }

    const typedItemsData = itemsData as ItemWithVariants[];

    // Map options by item
    const optionsByItem = new Map<string, Array<{ id: string, name: string, price: number, type: string }>>();
    ((optionsRes?.data as any[]) || []).forEach((o) => {
      const list = optionsByItem.get(o.item_id) || [];
      list.push({
        id: o.id,
        name: o.name,
        price: Number(o.price) || 0,
        type: o.input_type || 'text'
      });
      optionsByItem.set(o.item_id, list);
    });

    // Map addons by item
    const addonsByItem = new Map<string, any[]>();
    ((addonsRes?.data as any[]) || []).forEach((a: any) => {
      const list = addonsByItem.get(a.item_id) || [];
      list.push(a);
      addonsByItem.set(a.item_id, list);
    });

    const partnerIds = new Set<string>();
    typedItemsData.forEach((item) => {
      if (item.partner_id) partnerIds.add(item.partner_id);
    });

    const firstPartnerId = Array.from(partnerIds)[0];

    const hydratedItems = draft_items.map(draft_item => {
      const item_data = typedItemsData.find(i => i.id === draft_item.item_id);
      if (!item_data) return null;

      const item_base_price = Number(item_data.base_price || 0);
      const variant = (item_data as any).variants?.find((v: any) => v.id === draft_item.variant_id);
      const variant_price = variant?.price != null ? Number(variant.price) : null;
      const unit_price = variant_price !== null ? variant_price : item_base_price;

      const selected_addons = draft_item.selected_addons || [];
      const addons_price = selected_addons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
      const personalization_price = (draft_item.personalization?.price || 0);
      const total_price = (unit_price + addons_price + personalization_price) * draft_item.quantity;

      return {
        id: `draft-${draft_item.item_id}`,
        item_id: draft_item.item_id,
        item_name: item_data.name,
        item_image: (item_data.images || [])[0] || '/images/logo.png',
        base_price: item_base_price,
        variant_price: variant_price,
        variant_name: variant?.name,
        personalization_price: personalization_price,
        addons_price: addons_price,
        partner_id: item_data.partner_id ?? null,
        partner_latitude: (item_data as any).partners?.latitude ?? null,
        partner_longitude: (item_data as any).partners?.longitude ?? null,
        unit_price: unit_price,
        total_price: total_price,
        quantity: draft_item.quantity,
        selected_variant_id: draft_item.variant_id,
        personalization: draft_item.personalization,
        selected_addons: selected_addons
      } as DraftLineItem;
    }).filter(Boolean);

    // Upsells removed for Swiggy 2026 Purification

    return {
      hydratedItems: hydratedItems as any,
      error: null
    };
  } catch (error) {
    logError(error, 'GetTransactionData');
    return {
      hydratedItems: [],
      error: 'Failed to fetch transaction data'
    };
  }
}

/**
 * WYSHKIT 2026: Update existing cart item (Section 4 Pattern 5)
 * Handles "Portal Editing" flow from checkout.
 */
export async function updateCartItem(
  cart_item_id: string,
  payload: {
    variant_id?: string | null;
    personalization?: SelectedPersonalization;
    selected_addons?: SelectedAddon[];
    quantity?: number;
  }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Authorization check
    let query = supabase.from('cart_items').select('id').eq('id', cart_item_id);
    if (user) query = query.eq('user_id', user.id);
    else {
      const sessionId = await getGuestSessionIdReadOnly();
      if (!sessionId) return { error: 'No session found' };
      query = query.eq('session_id', sessionId);
    }

    const { data: existing, error: authError } = await query.maybeSingle();
    if (authError || !existing) return { error: 'Item not found or unauthorized' };

    const { variant_id, personalization, selected_addons, quantity } = payload;

    const update_data: any = {};
    if (variant_id !== undefined) update_data.selected_variant_id = variant_id;
    if (personalization !== undefined) update_data.personalization = personalization as unknown as Json;
    if (selected_addons !== undefined) update_data.selected_addons = selected_addons as unknown as Json;
    if (quantity !== undefined) update_data.quantity = Math.min(Math.max(1, Math.floor(Number(quantity))), MAX_ITEM_QUANTITY);

    update_data.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('cart_items')
      .update(update_data)
      .eq('id', cart_item_id);

    if (error) throw error;

    revalidateCartPaths();
    return { success: true };
  } catch (err) {
    logError(err, 'UpdateCartItem');
    return { error: 'Failed to update item' };
  }
}
