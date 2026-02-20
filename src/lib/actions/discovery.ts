'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { logError } from '@/lib/utils/error-handler';
import { DBPartner, DBItem, ItemWithFullSpec, Tables } from '@/lib/supabase/types';
import { Database } from '@/lib/supabase/database.types';
import { MappedPartner } from '@/lib/types/partner';
import { WyshkitItem } from '@/lib/types/item';

import { mapPartner, mapWyshkitItem } from '@/lib/utils/mappers';

// WYSHKIT 2026: Mapping interfaces now centralized in mappers.ts

export const getNearbyDiscovery = cache(async (lat: number, lng: number, radiusKm: number = 5) => {
  const supabase = await createClient();

  // WYSHKIT 2026: Bypass generated type issue for RPC with arguments
  const { data: nearbyItems, error } = await (supabase as any).rpc('get_nearby_items', {
    user_lat: lat,
    user_lng: lng,
    radius_km: radiusKm,
    include_out_of_stock: false // WYSHKIT 2026: Zero Reflection
  });

  if (error) {
    logger.error('Failed to get nearby items in getNearbyDiscovery', error);
    return { items: [], error: error.message };
  }

  // RPC returns any (Json), so we map it safely
  const items = (nearbyItems as any[] || []).map(mapWyshkitItem).map((item: any, idx: number) => ({
    ...item,
    distance_km: (nearbyItems as any[])[idx].distance_km
  }));
  return { items, error: null };
});

export const getHomeDiscovery = cache(async (lat?: number, lng?: number) => {
  try {
    const supabase = await createClient();

    // Categories
    const { data: categories, error: catError } = await (supabase as any)
      .from('categories')
      .select('id, name, slug, image_url, display_order')
      .eq('is_active', true)
      .order('display_order');

    if (catError) {
      logError(catError, 'GetHomeDiscoveryCategories');
    }


    let trendingItems: any[] | undefined;

    if (lat && lng) {
      const { data: nearbyItems, error: nearbyError } = await (supabase as any).rpc('get_nearby_items', {
        user_lat: lat,
        user_lng: lng,
        radius_km: 10,
        include_out_of_stock: false // WYSHKIT 2026: Push to RPC if supported, fallback below
      });

      if (nearbyError) {
        logError(nearbyError, 'GetHomeDiscoveryNearby');
      } else if (nearbyItems && (nearbyItems as any[]).length > 0) {
        trendingItems = (nearbyItems as any[]).map(mapWyshkitItem).map((item: any, idx: number) => ({
          ...item,
          distance_km: (nearbyItems as any[])[idx].distance_km
        }));
      }
    }

    if (!trendingItems) {
      trendingItems = [];
    }

    return {
      categories: categories || [],
      trendingItems: trendingItems || [],
    };
  } catch (error) {
    logError(error, 'GetHomeDiscovery');
    return {
      categories: [],
      trendingItems: [],
      error: error instanceof Error ? error.message : 'Failed to fetch discovery data',
    };
  }
});

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('is_active', true)
    .order('display_order');
  return (data || []) as Tables<'categories'>[];
}

export const getTrendingItems = cache(async (): Promise<WyshkitItem[]> => {
  const supabase = await createClient();
  // WYSHKIT 2026: Cast to any because v_trending_items is missing in types
  const { data } = await (supabase as any)
    .from('v_trending_items')
    .select('id, name, "basePrice", images, "partnerId", "businessName", stock_status')
    .neq('stock_status', 'out_of_stock') // WYSHKIT 2026: Zero Reflection
    .limit(15);

  return (data || []).map(mapWyshkitItem);
});

export const getFeaturedPartners = cache(async (limit: number = 8) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('partners')
    .select('id, name, display_name, image_url, rating, city, prep_hours, delivery_fee, slug, business_type, is_online, description')
    .eq('status', 'active')
    .limit(limit);

  if (error) {
    logger.error('Failed to get featured partners', error);
    return { data: [], error: error.message };
  }

  // WYSHKIT 2026: Strict deduplication by ID to prevent repeated store cards
  const uniquePartnersMap = new Map<string, MappedPartner>();

  if (data) {
    (data as any[]).forEach((p) => {
      if (!uniquePartnersMap.has(p.id)) {
        uniquePartnersMap.set(p.id, mapPartner(p));
      }
    });
  }

  return { data: Array.from(uniquePartnersMap.values()), error: null };
});

export const getFeaturedItems = cache(async (limit: number = 3) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('items')
      .select(`
        id,
        name,
        base_price,
        images,
        partner_id,
        stock_status,
        stock_quantity,
        partners:partners(name, display_name)
      `)
      .eq('is_active', true)
      .eq('approval_status', 'approved')
      .neq('stock_status', 'out_of_stock') // WYSHKIT 2026: Zero Reflection
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Failed to get featured items', error, { limit });
      return { items: [], error: error.message };
    }

    const items: WyshkitItem[] = (data as any[] || []).map((item) => mapWyshkitItem(item));

    return { items, error: null };
  } catch (error) {
    logger.error('Unexpected error in getFeaturedItems', error);
    return { items: [], error: 'Failed to fetch featured items' };
  }
});

/**
 * Swiggy 2026: Deduplicated Partner Fetcher
 * Wrapped in React cache() to prevent double-hydration flicker
 */
export const getPartnerStoreData = cache(async (partnerId: string, includeInactive = false) => {
  try {
    if (!partnerId || partnerId.trim() === '') {
      return { partner: null, items: [], error: 'Invalid Partner ID' };
    }

    const supabase = await createClient();

    // WYSHKIT 2026: Parallel Fetching - Parallelize partner and items fetch
    // This solves the waterfall problem and ensures sub-1s loads.
    const [partnerRes, itemsRes] = await Promise.all([
      supabase
        .from('partners')
        .select(`
          id,
          name,
          display_name,
          description,
          image_url,
          rating,
          city,
          prep_hours,
          delivery_fee,
          status,
          is_active,
          slug,
          business_type,
          is_online
        `)
        .eq('id', partnerId)
        .maybeSingle(),
      (async () => {
        let query = supabase
          .from('items')
          .select(`
            *,
            partners:partners(id, name, slug, city, rating, display_name, image_url, fssai_license, gstin),
            personalization_options(*),
            item_addons(*),
            variants(*)
          `)
          .eq('partner_id', partnerId)
          .eq('approval_status', 'approved');

        if (!includeInactive) {
          query = query.eq('is_active', true);
        }

        return query.order('category');
      })()
    ]);

    const { data: partnerData, error: partnerError } = partnerRes;
    const { data: itemsData, error: itemsError } = itemsRes;

    if (partnerError) {
      logger.error('Partner fetch failed in getPartnerStoreData', partnerError, { partnerId });
      return { partner: null, items: [], error: partnerError.message };
    }

    if (!partnerData) {
      return { partner: null, items: [], error: 'Partner not found' };
    }

    if (itemsError) {
      logger.error('Items fetch failed in getPartnerStoreData', itemsError, { partnerId });
    }

    const partner = mapPartner(partnerData);
    const rawItems = (itemsData || []) as any[];

    // WYSHKIT 2026: Zero Reflection - Sort out-of-stock to bottom server-side
    const items = rawItems.map(mapWyshkitItem).sort((a: any, b: any) => {
      const aOut = a.is_active === false || a.stock_status === 'out_of_stock' || (typeof a.stock_quantity === 'number' && a.stock_quantity <= 0);
      const bOut = b.is_active === false || b.stock_status === 'out_of_stock' || (typeof b.stock_quantity === 'number' && b.stock_quantity <= 0);
      if (aOut && !bOut) return 1;
      if (!aOut && bOut) return -1;
      return 0;
    });

    return {
      partner,
      items: items as WyshkitItem[],
      error: null
    };
  } catch (error) {
    logger.error('Unexpected error in getPartnerStoreData', error, { partnerId });
    return { partner: null, items: [], error: 'Failed to fetch partner store data' };
  }
});
