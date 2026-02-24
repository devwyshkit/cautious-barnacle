/**
 * WYSHKIT 2026: Shared Personalization Logic
 * Resolves DRY violation across orders.ts, payment.ts, and checkout.ts
 */

export interface PersonalizationCheckItem {
  has_personalization?: boolean;
  personalization?: { enabled?: boolean; option_id?: string } | null;
  selected_addons?: Array<{ id: string; name?: string; price?: number; requires_preview?: boolean }>;
}

/**
 * Universal check to see if an product requires personalization input.
 * Supports both Legacy (is_personalized flag) and New (Add-ons with requires_preview).
 */
/**
 * Checks if an product has active personalization requirements.
 * Swiggy 2026: Narrowed to prevent over-triggering badges.
 */
export function hasItemPersonalization(product: any): boolean {
  if (!product) return false;

  // 1. Explicit Personalization Options (JSONB array from DB - Products table)
  const persOptions = product.personalization_options || [];
  if (Array.isArray(persOptions) && persOptions.length > 0) return true;

  // 2. Order Products Schema (Post-Payment Success JSON)
  // Check for explicit flags used in order_products table
  if (product.is_personalized === true) return true;

  // 3. Addons that require a preview (implies a design/approval step)
  const addons = product.item_addons || product.selected_addons || product.selectedAddons || [];
  if (Array.isArray(addons) && addons.some((a: any) => !!a.requires_preview)) return true;

  // 4. Legacy check for specific metadata
  const pers = product.personalization || {};
  if (pers.enabled && (pers.option_id || pers.fields)) return true;

  return false;
}

/**
 * Checks if a list of products contains any that require personalization.
 */
export function hasAnyPersonalization(products: PersonalizationCheckItem[]): boolean {
  return products.some(hasItemPersonalization);
}

/**
 * Checks if an order or a list of products has any personalized components.
 * Supports both order object (direct flag) and product list (iterative check).
 */
export function orderHasPersonalizedItems(input: { has_personalization?: boolean | null } | Array<{ has_personalization?: boolean | null }>): boolean {
  if (Array.isArray(input)) {
    return input.some(product => !!product.has_personalization);
  }
  return !!input.has_personalization;
}
