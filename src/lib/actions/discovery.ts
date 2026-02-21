'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { logError } from '@/lib/utils/error-handler';
import { DBPartner, DBItem, ItemWithFullSpec, Tables } from '@/lib/supabase/types';
import { Database } from '@/lib/supabase/database.types';
import { MappedPartner } from '@/lib/types/partner';
import { WyshkitItem } from '@/lib/types/item';

// WYSHKIT 2026: Zero Reinvention - Consuming native snake_case directly

export const getNearbyDiscovery = cache(async (lat: number, lng: number, radiusKm: number = 5) => {
  const supabase = await createClient();

  const { data: nearbyItems, error } = await supabase.rpc('get_nearby_items', {
    user_lat: lat,
    user_lng: lng,
    radius_km: radiusKm,
    include_out_of_stock: false
  });

  if (error) {
    logger.error('Failed to get nearby items in getNearbyDiscovery', error);
    return { items: [], error: error.message };
  }

  const items = (nearbyItems as any[] || []).map((item: any) => ({
    ...item,
    id: item.item_id || item.id,
    name: item.item_name || item.name,
    image_url: item.images?.[0] || item.image_url,
    distance_km: item.distance_km
  })) as WyshkitItem[];

  return { items, error: null };
});

export const getHomeDiscovery = cache(async (lat?: number, lng?: number) => {
  try {
    const supabase = await createClient();

    // Categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug, image_url, display_order')
      .eq('is_active', true)
      .order('display_order');

    if (catError) {
      logError(catError, 'GetHomeDiscoveryCategories');
    }

    let trendingItems: WyshkitItem[] = [];

    if (lat && lng) {
      const { data: nearbyItems, error: nearbyError } = await supabase.rpc('get_nearby_items', {
        user_lat: lat,
        user_lng: lng,
        radius_km: 10,
        include_out_of_stock: false
      });

      if (nearbyError) {
        logError(nearbyError, 'GetHomeDiscoveryNearby');
      } else if (nearbyItems && (nearbyItems as any[]).length > 0) {
        trendingItems = (nearbyItems as any[]).map((item: any) => ({
          ...item,
          id: item.item_id || item.id,
          name: item.item_name || item.name,
          distance_km: item.distance_km
        })) as WyshkitItem[];
      }
    }

    return {
      categories: categories || [],
      trendingItems,
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
  // WYSHKIT 2026: Consuming purified view (Zero Reinvention)
  const { data } = await supabase
    .from('v_trending_items')
    .select('*')
    .limit(15);

  return (data || []) as unknown as WyshkitItem[];
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
  const uniquePartnersMap = new Map<string, any>();

  if (data) {
    (data as any[]).forEach((p) => {
      if (!uniquePartnersMap.has(p.id)) {
        uniquePartnersMap.set(p.id, p);
      }
    });
  }

  return { data: Array.from(uniquePartnersMap.values()) as MappedPartner[], error: null };
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

    return { items: (data || []) as WyshkitItem[], error: null };
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

    // WYSHKIT 2026: Parallel Fetching
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

    const partner = partnerData;
    const items = (itemsData || []).sort((a: any, b: any) => {
      const aOut = a.is_active === false || a.stock_status === 'out_of_stock' || (typeof a.stock_quantity === 'number' && a.stock_quantity <= 0);
      const bOut = b.is_active === false || b.stock_status === 'out_of_stock' || (typeof b.stock_quantity === 'number' && b.stock_quantity <= 0);
      if (aOut && !bOut) return 1;
      if (!aOut && bOut) return -1;
      return 0;
    }) as WyshkitItem[];

    return {
      partner,
      items,
      error: null
    };
  } catch (error) {
    logger.error('Unexpected error in getPartnerStoreData', error, { partnerId });
    return { partner: null, items: [], error: 'Failed to fetch partner store data' };
  }
});
