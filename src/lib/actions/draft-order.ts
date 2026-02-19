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

// Define interfaces for View and Join results
interface CartItemView {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  quantity: number;
  variantPrice: number | null;
  basePrice: number | null;
  selectedVariantId: string | null;
  personalization: SelectedPersonalization | null;
  selectedAddons: SelectedAddon[] | null;
  partnerName: string | null;
  partnerId: string | null;
  userId?: string | null;
  sessionId?: string | null;
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
        cart: { items: [], partnerId: null, subtotal: 0, total: 0, itemCount: 0 },
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

    const dbPricing = (totalsData?.pricing as any) || { subtotal: 0, total: 0 };

    // Map DB items to frontend MappedCartItem objects
    const items: DraftLineItem[] = (itemRows as any[] || []).map(row => {
      const itemBasePrice = Number(row?.items?.base_price || 0);
      const variantPrice = row?.variants?.price != null ? Number(row.variants.price) : null;
      const unitPrice = variantPrice !== null ? variantPrice : itemBasePrice;
      const quantity = Number(row.quantity) || 1;

      // Extract Addons Price
      const selectedAddons = row.selected_addons || [];
      const addonsPrice = (selectedAddons as any[]).reduce((sum, a) => sum + (Number(a.price) || 0), 0);

      // Extract Personalization Price
      const personalization = row.personalization || undefined;
      const personalizationPrice = (personalization?.price || 0);

      return {
        id: row.id,
        itemId: row.item_id,
        itemName: row?.items?.name || 'Product',
        itemImage: row?.items?.images?.[0] || '/placeholder.png',
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: (unitPrice + addonsPrice + personalizationPrice) * quantity,
        selectedVariantId: row.selected_variant_id,
        personalization: personalization,
        selectedAddons: selectedAddons,
        partnerName: row?.items?.partners?.name || 'Store',
        partnerId: row?.items?.partner_id,
        partnerLatitude: row?.items?.partners?.latitude,
        partnerLongitude: row?.items?.partners?.longitude,
        // Hydration
        basePrice: itemBasePrice,
        variantPrice: variantPrice,
        variantName: row?.variants?.name,
        personalizationPrice,
        addonsPrice,
        personalization_options: row?.items?.personalization_options || [],
        item_addons: row?.items?.item_addons || [],
        is_personalized: !!row.personalization?.enabled,
        personalization_details: row.personalization?.enabled ? row.personalization : null
      };
    });

    const partnerIds = new Set(items.map(item => item.partnerId).filter(Boolean));
    const partnerId = partnerIds.size === 1 ? Array.from(partnerIds)[0] as string : null;

    const cart: DraftTransaction = {
      items,
      partnerId: partnerId as string | null,
      subtotal: Number(dbPricing.subtotal) || 0,
      total: Number(dbPricing.total) || 0,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };

    return {
      cart,
      cartIdentity,
      guestSessionId
    };
  } catch (error) {
    logError(error, 'GetCart');
    return {
      cart: { items: [], partnerId: null, subtotal: 0, total: 0, itemCount: 0 },
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
  itemId: string
  variantId?: string | null
  personalization?: SelectedPersonalization
  selectedAddons?: SelectedAddon[]
  quantity?: number
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()
    const sessionId = !user ? await getGuestSessionId() : null

    const { itemId, variantId, personalization, selectedAddons, quantity: rawQty = 1 } = payload
    const quantity = Math.min(Math.max(1, Math.floor(Number(rawQty) || 1)), MAX_ITEM_QUANTITY)

    const [itemRes, cartRes, variantsRes] = await Promise.all([
      supabase.from('items')
        .select('partner_id, is_active')
        .eq('id', itemId)
        .eq('is_active', true)
        .maybeSingle(),
      (async () => {
        let query = supabase.from('cart_items')
          .select('id, item_id, quantity, selected_variant_id, personalization, selected_addons')

        if (user) {
          query = query.eq('user_id', user.id)
        } else if (sessionId) {
          query = query.eq('session_id', sessionId)
        }
        return query;
      })(),
      supabase.from('variants').select('id, stock_quantity').eq('item_id', itemId).limit(1),
    ])

    const { data: item, error: itemError } = itemRes as { data: { partner_id: string; is_active: boolean } | null, error: any }
    const { data: cartItems, error: cartError } = (await cartRes) as { data: CartItemRawRow[] | null; error: any }
    const { data: variantRows } = variantsRes as { data: { id: string; stock_quantity: number }[] | null }

    if (itemError || !item) return { error: 'Item not found' }
    if (cartError) throw cartError

    // WYSHKIT 2026: Require variant when item has variants (Swiggy-style)
    let hasVariants = Array.isArray(variantRows) && variantRows.length > 0
    if (hasVariants && (variantId == null || variantId === '')) {
      return { error: 'Please select an option', code: 'VARIANT_REQUIRED' }
    }

    // 0. STOCK CHECK (Swiggy 2026: Inventory Soft-Lock)
    // 0. STOCK CHECK (Swiggy 2026: Direct Inventory Check - Zero Reinvention)
    const normalizedVariantId = (variantId as string) || '';

    // 2. Duplicate Item Check (In-Memory)
    const normalizedPersonalization = personalization || { enabled: false }
    const personalizationKey = normalizedPersonalization.enabled
      ? `enabled:${(normalizedPersonalization as any).option_id || (normalizedPersonalization as any).optionId || 'default'}`
      : 'disabled'

    // Addons Key Generation (Sorted IDs for consistency)
    const addonsKey = (selectedAddons || [])
      .map(a => a.id)
      .sort()
      .join(',');

    const duplicateItem = cartItems?.find((ci) => {
      if (ci.item_id !== itemId) return false

      const ciVariant = ci.selected_variant_id || null
      const payloadVariant = variantId || null
      if (ciVariant !== payloadVariant) return false

      const ciPers = ci.personalization || { enabled: false }
      const ciKey = ciPers.enabled
        ? `enabled:${(ciPers as any).option_id || (ciPers as any).optionId || 'default'}`
        : 'disabled'

      const ciAddonsKey = (ci.selected_addons || [])
        .map((a) => a.id)
        .sort()
        .join(',')

      return ciKey === personalizationKey && ciAddonsKey === addonsKey
    })

    // 1. Stock Check (Zero Reinvention)
    hasVariants = !!normalizedVariantId;
    const { data: stockData, error: stockError } = await supabase
      .from(hasVariants ? 'variants' : 'items')
      .select('stock_quantity')
      .eq('id', hasVariants ? normalizedVariantId : itemId)
      .single();

    if (stockError || !stockData) {
      return { error: 'Stock information unavailable', code: 'STOCK_ERROR' };
    }

    // Get active reservations for this item/variant (excluding current user's cart if any)
    let reservationQuery = supabase
      .from('cart_reservations')
      .select('*', { count: 'exact', head: true })
      .eq(hasVariants ? 'variant_id' : 'item_id', hasVariants ? normalizedVariantId : itemId)
      .gt('expires_at', new Date().toISOString());

    if (duplicateItem) {
      reservationQuery = reservationQuery.neq('cart_item_id', duplicateItem.id);
    }

    const { count: reservedCount } = await reservationQuery;

    const availableStock = (stockData.stock_quantity || 0) - (reservedCount || 0);

    const isAvailable = (Number(availableStock) || 0) >= quantity;

    if (!isAvailable) {
      // Fetch item/variant name for better error message
      const { data: itemData } = await supabase
        .from('items')
        .select('name')
        .eq('id', itemId)
        .single();

      let displayName = itemData?.name || 'Item';
      if (variantId) {
        const { data: vData } = await supabase
          .from('variants')
          .select('name')
          .eq('id', variantId)
          .single();
        if (vData?.name) displayName += ` (${vData.name})`;
      }

      return {
        error: `Insufficient stock for "${displayName}". Only ${Number(availableStock)} available.`,
        code: 'OUT_OF_STOCK'
      };
    }
    if (cartItems && cartItems.length > 0) {
      const existingItemId = cartItems[0].item_id;
      const { data: existingItemData } = await supabase.from('items')
        .select('partner_id')
        .eq('id', existingItemId)
        .maybeSingle();

      const currentCartPartnerId = (existingItemData as { partner_id: string } | null)?.partner_id;

      if (currentCartPartnerId && currentCartPartnerId !== item.partner_id) {
        return {
          error: 'Transaction already in progress with another partner',
          code: 'PARTNER_MISMATCH',
          requiresCartClear: true
        }
      }
    }


    // 3. Mutation (Insert or Update)
    // 3. Mutation (Insert or Update) with Reservation
    const currentQty = duplicateItem ? duplicateItem.quantity : 0;
    const qtyNeeded = duplicateItem ? (quantity) : quantity; // Wait, addToCart ADDS to existing. So we need `quantity` more.

    // Check if we have enough for the INCREASE
    if ((Number(availableStock) || 0) < qtyNeeded) {
      return {
        error: `Insufficient stock. Only ${Number(availableStock)} available.`,
        code: 'OUT_OF_STOCK'
      };
    }

    const newQty = duplicateItem ? Math.min(duplicateItem.quantity + quantity, MAX_ITEM_QUANTITY) : quantity

    let cartItemId = duplicateItem?.id;

    if (duplicateItem) {
      await supabase.from('cart_items')
        .update({
          quantity: newQty,
          updated_at: new Date().toISOString()
        })
        .eq('id', duplicateItem.id)
    } else {
      const { data: newItem, error: insertError } = await supabase.from('cart_items')
        .insert({
          user_id: user?.id ?? null,
          session_id: user ? null : sessionId,
          item_id: itemId,
          quantity: newQty,
          selected_variant_id: variantId,
          personalization: normalizedPersonalization as any,
          selected_addons: (selectedAddons || []) as any,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      cartItemId = newItem.id;
    }

    // 4. RESERVE STOCK (10 Minutes Soft-Lock)
    // We strictly upsert reservation based on cart_item_id
    if (cartItemId) {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 min expiry

      // Check if reservation exists
      const { data: existingRes } = await supabase.from('cart_reservations')
        .select('id')
        .eq('cart_item_id', cartItemId)
        .maybeSingle();

      if (existingRes) {
        await supabase.from('cart_reservations')
          .update({
            quantity: newQty,
            expires_at: expiresAt.toISOString(),
            reserved_at: new Date().toISOString()
          })
          .eq('id', existingRes.id);
      } else {
        await supabase.from('cart_reservations')
          .insert({
            cart_item_id: cartItemId,
            item_id: itemId,
            variant_id: normalizedVariantId as any,
            quantity: newQty, // Reservation holds FULL quantity of the item in cart
            expires_at: expiresAt.toISOString()
          });
      }
    }

    revalidateCartPaths()

    logger.info('Item added to cart', {
      itemId,
      partnerId: item.partner_id,
      userId: user?.id,
      sessionId: user ? null : sessionId,
      quantity: newQty
    })

    try {
      const cartResult = await getCart();
      return cartResult.cart ? { success: true, cart: cartResult.cart } : { success: true };
    } catch (cartError) {
      logError(cartError, 'GetCartAfterAdd')
      return { success: true };
    }
  } catch (error) {
    logError(error, 'AddToDraftOrder')
    return handleActionError(error)
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
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
      // Direct Stock Check (Zero Reinvention)
      const { data: stockData } = await supabase
        .from(currentItem.selected_variant_id ? 'variants' : 'items')
        .select('stock_quantity')
        .eq('id', currentItem.selected_variant_id || currentItem.item_id)
        .single();

      const { count: reservedCount } = await supabase
        .from('cart_reservations')
        .select('*', { count: 'exact', head: true })
        .eq(currentItem.selected_variant_id ? 'variant_id' : 'item_id', currentItem.selected_variant_id || currentItem.item_id)
        .neq('cart_item_id', cartItemId)
        .gt('expires_at', new Date().toISOString());

      const availableStock = (stockData?.stock_quantity || 0) - (reservedCount || 0);


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

    const emptyCart = { items: [], partnerId: null, subtotal: 0, total: 0, itemCount: 0 };
    return { success: true, cart: emptyCart };
  } catch (error) {
    logError(error, 'ClearDraftOrder');
    return handleActionError(error);
  }
}

export async function getGuestCartDetails(payload: Array<{ itemId: string; quantity: number; variantId?: string | null; personalization?: SelectedPersonalization; selectedAddons?: SelectedAddon[] }>) {
  try {
    if (!payload.length) {
      return { cart: { items: [], partnerId: null, subtotal: 0, total: 0, itemCount: 0 } }
    }

    const supabase = await createClient();
    const itemIds = payload.map(i => i.itemId)

    const query = supabase.from('v_item_listings')
      .select('id, name, image, base_price, partner_name, latitude, longitude')
      .eq('is_active', true)
      .in('id', itemIds);

    const { data: itemsData, error } = await query as { data: { id: string, name: string, image: string, base_price: number, partner_name: string, latitude: number, longitude: number }[] | null, error: any };

    if (error) throw error

    const items: DraftLineItem[] = payload.map(p => {
      const item = (itemsData || []).find((i: any) => i.id === p.itemId)
      if (!item) return null

      const basePrice = Number(item.base_price) || 0;
      const selectedAddons = p.selectedAddons || [];
      const addonsPrice = (selectedAddons).reduce((sum, addon) => sum + (Number(addon.price) || 0), 0);
      const personalizationPrice = (p.personalization?.price || 0);

      // Unit Price for UI (Base + Addons)
      const unitPrice = basePrice + addonsPrice;

      return {
        id: `guest-${p.itemId}`,
        itemId: p.itemId,
        itemName: item.name,
        itemImage: item.image,
        quantity: p.quantity,
        unitPrice: unitPrice,
        totalPrice: (unitPrice + personalizationPrice) * p.quantity,
        selectedVariantId: p.variantId ?? null,
        personalization: p.personalization,
        selectedAddons: selectedAddons,
        partnerName: item.partner_name,
        // Hydration
        basePrice: basePrice,
        addonsPrice: addonsPrice,
        personalizationPrice: personalizationPrice,
        partnerLatitude: item.latitude,
        partnerLongitude: item.longitude
      } as DraftLineItem;
    }).filter((i): i is DraftLineItem => i !== null)

    // Verify items and compute totals atomicly if possible
    // (Actual placement happens in place_secure_order RPC)
    const { data: pricing, error: pricingError } = await (supabase as any).rpc('calculate_order_total', {
      p_cart_items: items.map(it => ({
        item_id: it.itemId,
        quantity: it.quantity,
        variant_id: it.selectedVariantId,
        has_personalization: !!it.personalization?.enabled,
        selected_addons: it.selectedAddons
      })),
      p_delivery_fee_override: 40,
      p_distance_km: null,
      p_coupon_code: null,
      p_address_id: null,
      p_use_wallet: false,
      p_user_id: null
    });


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

export async function getTransactionData(draftItems: Array<{ itemId: string; variantId: string | null; personalization: any; selectedAddons?: SelectedAddon[]; quantity: number }>) {
  try {
    const supabase = await createClient();

    if (draftItems.length === 0) {
      return {
        hydratedItems: [],
        upsellItems: [],
        error: null
      };
    }

    const itemIds = draftItems.map(item => item.itemId);

    // Fetch items with all needed relations
    // Using simple query structure for maximum reliability
    const [itemsRes, optionsRes, addonsRes] = await Promise.all([
      supabase.from('items')
        .select('id, name, images, partner_id, base_price, partners(latitude, longitude), variants(id, name, price)')
        .eq('is_active', true)
        .eq('approval_status', 'approved')
        .in('id', itemIds),
      supabase.from('personalization_options')
        .select('id, item_id, name, price, input_type')
        .in('item_id', itemIds)
        .eq('is_active', true),
      supabase.from('item_addons')
        .select('*')
        .in('item_id', itemIds)
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
    const optionsByItem = new Map<string, any[]>();
    ((optionsRes?.data as any[]) || []).forEach((o: any) => {
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

    const hydratedItems = draftItems.map((draftItem: any) => {
      // Find the corresponding item from the already hydrated cart if available
      // Actually, getTransactionData is used in checkout.ts which already has 'cart'
      // But we need to ensure consistency.

      const itemData = typedItemsData.find((i) => i.id === draftItem.itemId);
      if (!itemData) {
        return { ...draftItem, name: 'Item', image: '/images/logo.png' };
      }

      const variant = (itemData.variants || []).find((v) => v.id === draftItem.variantId);
      const itemBasePrice = Number(itemData.base_price) || 0;
      const variantPrice = Number(variant?.price) || 0;

      // Calculate Legacy Pers Price (Fallback if not in draftItem)
      const personalizationOptions = optionsByItem.get(draftItem.itemId) || [];
      const personalizationPrice = (draftItem.personalization?.price || 0);

      // Calculate Addons Price
      const addonsPrice = (draftItem.selectedAddons || []).reduce((sum: number, addon: any) => sum + (Number(addon.price) || 0), 0);

      const baseUnitPrice = variant ? variantPrice : itemBasePrice;
      const unitPrice = baseUnitPrice + addonsPrice + (personalizationPrice / (draftItem.quantity || 1));
      const totalPrice = unitPrice * (draftItem.quantity || 1);

      return {
        ...draftItem,
        id: draftItem.id || `draft-${draftItem.itemId}`,
        name: itemData.name,
        image: (itemData.images || [])[0] || '/images/logo.png',
        basePrice: itemBasePrice,
        variantPrice: variantPrice,
        variantName: variant?.name,
        personalizationPrice,
        addonsPrice,
        partnerId: itemData.partner_id ?? null,
        partnerLatitude: (itemData as any).partners?.latitude ?? null,
        partnerLongitude: (itemData as any).partners?.longitude ?? null,
        itemName: itemData.name,
        unitPrice,
        totalPrice
      };
    });

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
  cartItemId: string,
  payload: {
    variantId?: string | null;
    personalization?: SelectedPersonalization;
    selectedAddons?: SelectedAddon[];
    quantity?: number;
  }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Authorization check
    let query = supabase.from('cart_items').select('id').eq('id', cartItemId);
    if (user) query = query.eq('user_id', user.id);
    else {
      const sessionId = await getGuestSessionIdReadOnly();
      if (!sessionId) return { error: 'No session found' };
      query = query.eq('session_id', sessionId);
    }

    const { data: existing, error: authError } = await query.maybeSingle();
    if (authError || !existing) return { error: 'Item not found or unauthorized' };

    const { variantId, personalization, selectedAddons, quantity } = payload;

    // Update mutation
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({
        selected_variant_id: variantId,
        personalization: (personalization || { enabled: false }) as any,
        selected_addons: (selectedAddons || []) as any,
        quantity: quantity || 1,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', cartItemId);

    if (updateError) throw updateError;

    revalidateCartPaths();
    return { success: true };
  } catch (err) {
    logError(err, 'UpdateCartItem');
    return { error: 'Failed to update item' };
  }
}
