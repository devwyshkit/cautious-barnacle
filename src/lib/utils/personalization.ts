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
 * Universal check to see if an item requires personalization input.
 * Supports both Legacy (is_personalized flag) and New (Add-ons with requires_preview).
 */
/**
 * Checks if an item has active personalization requirements.
 * Swiggy 2026: Narrowed to prevent over-triggering badges.
 */
export function hasItemPersonalization(item: any): boolean {
  if (!item) return false;

  // 1. Explicit Personalization Options (JSONB array from DB - Items table)
  const persOptions = item.personalization_options || [];
  if (Array.isArray(persOptions) && persOptions.length > 0) return true;

  // 2. Order Items Schema (Post-Payment Success JSON)
  // Check for explicit flags used in order_items table
  if (item.is_personalized === true) return true;
  if (item.personalization_config && Object.keys(item.personalization_config).length > 0) return true;

  // 3. Addons that require a preview (implies a design/approval step)
  const addons = item.item_addons || item.selected_addons || item.selectedAddons || [];
  if (Array.isArray(addons) && addons.some((a: any) => !!a.requires_preview)) return true;

  // 4. Legacy check for specific metadata
  const pers = item.personalization || {};
  if (pers.enabled && (pers.option_id || pers.fields)) return true;

  return false;
}

/**
 * Checks if a list of items contains any that require personalization.
 */
export function hasAnyPersonalization(items: PersonalizationCheckItem[]): boolean {
  return items.some(hasItemPersonalization);
}

/**
 * Checks if an order or a list of items has any personalized components.
 * Supports both order object (direct flag) and item list (iterative check).
 */
export function orderHasPersonalizedItems(input: { has_personalization?: boolean | null } | Array<{ has_personalization?: boolean | null }>): boolean {
  if (Array.isArray(input)) {
    return input.some(item => !!item.has_personalization);
  }
  return !!input.has_personalization;
}
