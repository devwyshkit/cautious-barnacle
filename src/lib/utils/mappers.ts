import { DraftTransaction, CartProduct, SelectedPersonalization, SelectedAddon } from '@/lib/types/personalization';
import { EMPTY_CART } from '@/lib/constants/cart';

/**
 * WYSHKIT 2026: Shared Mapping Utilities
 * 
 * Functions to transform raw Supabase RPC outputs into purified frontend models.
 * Zero Shadow Math: Mapping only, no calculations.
 */

interface RawHomeSurface {
    categories?: any[];
    featured_products?: any[];
    vendors?: any[];
    active_orders?: any[];
    recent_orders?: any[];
    cart_count?: number;
    system_status?: string;
    sections_data?: {
        best_sellers?: any[];
        new_arrivals?: any[];
        vendors?: any[];
    };
    metadata?: {
        location_name?: string;
        resolved_lat?: number;
        resolved_lng?: number;
        eta_minutes?: number;
    };
}

interface RawCartContext {
    products?: any[];
    pricing?: any;
    session?: any;
}

export function mapCartContext(data: RawCartContext | null): { cart: DraftTransaction, cartSessionId: string } {
    if (!data) return { cart: EMPTY_CART, cartSessionId: 'empty' };

    const productsRows = data.products || [];
    const dbRes = data.pricing || {};
    const sessionData = data.session || {};

    const cartProducts: CartProduct[] = productsRows.map((row: any) => {
        const quantity = Number(row.quantity) || 1;
        const personalization = (row.personalization as unknown as SelectedPersonalization) || { enabled: false };

        return {
            id: row.id || '',
            product_id: row.product_id || '',
            product_name: row.product_name || 'Product',
            product_slug: row.product_slug || null,
            product_image: (Array.isArray(row.product_images) && row.product_images[0]) || row.product_image || row.product_image_url || '/images/logo.png',
            quantity: quantity,
            unit_price: Number(row.calculated_unit_price || row.effective_unit_price || 0),
            line_total: Number(row.calculated_line_total || 0),
            personalization_fee: Number(row.personalization_fee || 0),
            variant_id: row.variant_id || row.selected_variant_id,
            personalization: personalization,
            selected_addons: (row.selected_addons as unknown as SelectedAddon[]) || [],
            vendor_name: row.vendor_name || 'Store',
            vendor_id: row.vendor_id || '',
            vendor_city: row.vendor_city || null,
            vendor_prep_mins: Number(row.vendor_prep_mins) || null,
            base_price: Number(row.base_price || 0),
            variant_price: row.variant_price != null ? Number(row.variant_price) : null,
            variant_name: row.variant_name || undefined,
            addons_price: Number(row.addons_price || 0),
            is_personalized: !!personalization?.enabled,
            personalization_options: (row.personalization_options as any[]) || [],
            product_addons: [], // Required by DraftProduct interface
        };
    });

    const vendorIds = new Set(cartProducts.map(product => product.vendor_id).filter(Boolean));
    const vendorId = vendorIds.size === 1 ? Array.from(vendorIds)[0] as string : null;

    const cart: DraftTransaction = {
        products: cartProducts,
        vendor_id: vendorId,
        subtotal: Number(dbRes.subtotal) || 0,
        personalization_charges: Number(dbRes.personalization_charges) || 0,
        addons_price: Number(dbRes.addons_price) || 0,
        delivery_fee: Number(dbRes.delivery_fee) || 0,
        platform_fee: Number(dbRes.platform_fee) || 0,
        gst: Number(dbRes.gst) || 0,
        discount: Number(dbRes.discount) || 0,
        wallet_discount: Number(dbRes.wallet_discount) || 0,
        total: Number(dbRes.total) || 0,
        total_paise: Number(dbRes.total_paise) || 0,
        cashback_amount: Number(dbRes.cashback_amount) || 0,
        wyshkit_money_earned: Number(dbRes.wyshkit_money_earned) || 0,
        total_savings: Number(dbRes.total_savings) || 0,
        product_count: cartProducts.reduce((sum, product) => sum + product.quantity, 0),
        applied_coupon: sessionData.applied_coupon,
        use_wallet: sessionData.use_wallet || false,
        selected_address_id: sessionData.selected_address_id,
        gstin: sessionData.gstin
    };

    return {
        cart,
        cartSessionId: 'active'
    };
}

export function mapHomeSurface(data: any | null) {
    if (!data) return {
        categories: [],
        trendingProducts: [],
        featuredVendors: [],
        activeOrders: [],
        recentOrders: [],
        metadata: { system_status: 'normal' }
    };

    const raw = data;
    const sectionsData = raw.sections_data || {};

    return {
        categories: raw.categories || [],
        trendingProducts: (raw.trendingProducts || raw.featured_products || sectionsData.best_sellers || []).map((p: any) => ({
            ...p,
            vendor_id: p.vendor_id || p.vendors?.id,
            vendor_slug: p.vendor_slug || p.vendors?.slug,
            vendor_name: p.vendor_name || p.vendors?.name
        })),
        newArrivals: (raw.newArrivals || sectionsData.new_arrivals || []).map((p: any) => ({
            ...p,
            vendor_id: p.vendor_id || p.vendors?.id,
            vendor_slug: p.vendor_slug || p.vendors?.slug,
            vendor_name: p.vendor_name || p.vendors?.name
        })),
        featuredVendors: (raw.featuredVendors || raw.vendors || sectionsData.vendors || []).map((v: any) => ({
            ...v,
            id: v.id || v.vendor_id,
            slug: v.slug || v.vendor_slug
        })),
        activeOrders: raw.activeOrders || raw.active_orders || [],
        recentOrders: raw.recentOrders || raw.recent_orders || [],
        cartCount: raw.cartCount || raw.cart_count || 0,
        metadata: {
            system_status: raw.system_status || 'normal',
            location_name: raw.metadata?.location_name,
            resolved_lat: raw.metadata?.resolved_lat,
            resolved_lng: raw.metadata?.resolved_lng,
            eta_minutes: raw.metadata?.eta_minutes
        }
    };
}
