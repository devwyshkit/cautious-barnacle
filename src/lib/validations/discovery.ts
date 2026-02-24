import { z } from 'zod';

/**
 * WYSHKIT 2026: Discovery Validation Schemas
 * Pattern: Deterministic Boundaries
 * - Every database response is parsed by Zod.
 * - This prevents "Shadow Errors" where UI fails due to undefined fields.
 */

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    image_url: z.string().nullable(),
});

export const EliteSignalsSchema = z.object({
    delivery_signal: z.string().nullable().optional(),
    urgency_signal: z.string().nullable().optional(),
    is_personalizable: z.boolean().optional(),
    badges: z.array(z.object({
        text: z.string(),
        variant: z.enum(["default", "fast", "scarcity", "elite"])
    })).nullable().optional(),
    // Vendor specific
    city_short: z.string().nullable().optional(),
    estimate: z.object({
        min: z.number(),
        max: z.number()
    }).nullable().optional(),
});

export const PartnerSchema = z.object({
    id: z.string(),
    name: z.string(),
    image_url: z.string().nullable().optional(),
    rating: z.number().nullable().optional(),
    city: z.string().nullable().optional(),
    avg_prep_time_mins: z.number().nullable().optional(),
    base_delivery_charge: z.number().nullable().optional().default(0),
    slug: z.string().nullable().optional(),
    business_type: z.string().nullable().optional(),
    is_online: z.boolean().optional().default(true),
    description: z.string().nullable().optional(),
    elite_signals: EliteSignalsSchema.optional(),
    gstin: z.string().nullable().optional(),
}).passthrough();

export const WyshkitItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    base_price: z.number(),
    images: z.array(z.string()).nullable().optional(),
    image_url: z.string().nullable().optional(), // Synthetic field
    vendor_id: z.string(),
    category: z.string().nullable(),
    stock_quantity: z.number().nullable(),
    is_active: z.boolean().default(true),
    has_personalization: z.boolean().default(false),
    elite_signals: EliteSignalsSchema.optional(),

    // Joins
    vendor_name: z.string().nullable().optional(),
    vendors: PartnerSchema.nullable().optional(),
    variants: z.array(z.any()).nullable().optional(), // Will refine later
    item_addons: z.array(z.any()).nullable().optional(),
    personalization_options: z.array(z.any()).nullable().optional(),

    // Search Metadata
    distance_km: z.number().nullable().optional(),
    is_promoted: z.boolean().nullable().optional(),
}).passthrough();

export const SectionTypeSchema = z.enum(["CIRCLE_RAIL", "CARD_RAIL", "GRID", "BANNER_BENTO"]);

export const SurfaceSectionSchema = z.object({
    id: z.string(),
    type: SectionTypeSchema,
    title: z.string().optional(),
    subtitle: z.string().optional(),
    data: z.array(z.any()), // Products, Vendors, or Categories
    metadata: z.record(z.string(), z.any()).optional(),
});

export const HomeSurfaceSchema = z.object({
    sections: z.array(SurfaceSectionSchema),
    categories: z.array(CategorySchema), // Keep for navigation
    activeOrders: z.array(z.any()),
});

export const SearchResultsSchema = z.object({
    products: z.array(WyshkitItemSchema),
    vendors: z.array(PartnerSchema),
    total: z.number(),
});

export type ValidatedCategory = z.infer<typeof CategorySchema>;
export type ValidatedPartner = z.infer<typeof PartnerSchema>;
export type ValidatedWyshkitItem = z.infer<typeof WyshkitItemSchema>;
export type ValidatedHomeSurface = z.infer<typeof HomeSurfaceSchema>;
export type ValidatedSearchResults = z.infer<typeof SearchResultsSchema>;
