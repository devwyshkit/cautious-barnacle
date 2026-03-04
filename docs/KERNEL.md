# WyshKit 2026: KERNEL — The Engineering Law

> *The database is the only computer. The frontend is a high-fidelity display. Everything else is noise.*

---

## The 7 Laws of 2026

1. **Zero Shadow Math** — All commerce arithmetic (GST, platform fees, delivery, coupons, wallet) is the exclusive domain of the Postgres kernel. Frontend math is prohibited. *Total price on "Add to Cart" must be indicative or server-fetched.*
2. **Atomic Intent** — Every user decision maps to exactly one RPC round-trip. No chaining. No "Shadow Sessions."
3. **Perpetual State Purity** — The UI is a stateless projection of the database. The first render is always the Authored Source.
4. **No Surface Nesting** — Sheets never open inside sheets. Cart sheet closes before checkout loads. Borders and headers form one continuous surface.
5. **Healthy Friction** — `Slide to Pay` validates intent. Friction is a bug only when it blocks a decision; it is a feature when it confirms one.
6. **Visual Gravity** — Surfaces containing money (Wallets, Bill) always carry higher visual elevation (shadows, borders) than static surfaces.
7. **Haptic Resonance** — Every transactional intent (Confirm, Toggle, Slide) must echo in the hand. No vibration = no transaction.

---

## Hard Engineering Rules

> The 7 Laws above are the WHY. These rules are the HOW. No overlap.

1. **SECURITY DEFINER + explicit search_path** — Every `SECURITY DEFINER` RPC must include `SET search_path = public, extensions`. No exceptions. Missing this = search-path injection risk.
2. **Structured Errors, Not Raw SQLERRM** — API responses always use machine-readable codes. Never expose raw DB error strings.
   | Code | Trigger | Frontend Action |
   |---|---|---|
   | `ORDER_ALREADY_EXISTS` | Idempotency hit | Return existing order silently |
   | `VENDOR_OFFLINE` | Vendor closed | "This vendor is currently closed." |
   | `VENDOR_MISMATCH` | Multi-vendor cart | Show Cart Switch Sheet |
   | `INSUFFICIENT_STOCK` | Stock depleted | "Sorry, [Product] just sold out." |
   | `COUPON_INVALID` | Expired/wrong | "This code isn't valid" inline |
   | `PAYMENT_UNAUTHORIZED` | Auth failed | Show error, let user retry. Never auto-retry. |
   | `PERSONALISATION_SCHEMA_INVALID` | Schema validation failed | "Please check your personalisation details" inline |
   | `DETAILS_ALREADY_SUBMITTED` | Duplicate submission | Return existing details silently |
3. **No Silent Exception Swallowing** — `EXCEPTION WHEN OTHERS THEN RETURN json_build_object('success', false)` is forbidden in state-modifying RPCs. RAISE. Let Postgres roll back.
4. **RLS-First Architecture** — All tables exposed to PostgREST have RLS enabled. `SECURITY DEFINER` functions bypass RLS intentionally — treat them as privileged kernel operations, not shortcuts.
5. **FK Indexes** — PostgreSQL does NOT auto-index foreign keys. Every FK column must have a covering index.
6. **ETA Contract — Time > Distance**
    - Formula: `ETA = vendor.avg_prep_time_mins + (distance_km × 5) + 5 [buffer]`
    - `vendor.avg_prep_time_mins` is seeded during the onboarding dummy order, then updated via running average after 10 real orders.
    - Product Card: "~40 min" | Checkout: "Arriving in ~45 mins" | Tracking: "Arriving by 5:15 PM"
    - Never show km. Ever.
7. **Slug-First Architecture** — All customer-facing URLs must use human-readable slugs (`/vendor/bakery-name/product/chocolate-cake`) instead of standard IDs/UUIDs for SEO and trust. *Passing a UUID to a slug-based route results in a 400 architecture guard.*
    - **HARDENING 2026**: Fallback to UUID in customer-facing links is a P0 failure. Always fetch `vendor_slug` and `product_slug` (aliased as `slug`) in the One-Trip context. 
    - **POLYMORPHIC RESOLUTION**: RPCs like `get_product_surface_v1` and `get_vendor_surface` MUST support dual resolution (ID or Slug) via regex-based input detection to prevent routing failures during the 2026 transition. 
8. **Realtime-First** — Order tracking uses Supabase Realtime (`public:orders:id=eq.$order_id`). Fallback: 30s polling if WebSocket fails 3×. If polling fails 3× → show "Connection lost. Pull to refresh."
9. **Anti-Fragile State** — A Shadowfax/Porter API failure must NOT block a vendor from marking an order `PACKED`. Decouple 3PL from the order state machine.

---

## Commerce Intent Engine

> **Target architecture.** Currently RPCs are called directly from server actions. This is the convergence pattern.

Every user mutation flows through one validated entry point:

```typescript
type CommerceIntent =
  | { intent: 'ADD_TO_CART';      payload: { product_id, quantity, ... } }
  | { intent: 'PLACE_ORDER';      payload: { razorpay_order_id, ... } }
  | { intent: 'TRANSITION_ORDER'; payload: { order_id, target_status } }
  | { intent: 'APPLY_COUPON';     payload: { code } }
  | { intent: 'TOGGLE_WALLET';    payload: { enabled } }
  // see src/lib/commerce/ for complete list

executeCommerceIntent(intent) // Zod-validated → OpenTelemetry-traced → single RPC
```

One function to test. One function to audit. One function to trace.

---

## One-Trip Promise

Every surface loads its entire context in exactly **one** database round-trip:

| Surface | RPC |
|---|---|
| Home / Global Init | `get_global_init_surface()` |
| Vendor storefront | `get_vendor_surface()` |
| Product detail | `get_product_surface_v1()` |
| Checkout | `get_checkout_context(p_guest_lat, p_guest_lng, p_guest_cart_items)` |
| Order history | `get_user_orders_v1()` |

> For guests, `p_guest_cart_items` (JSONB) contains the session cart. For authenticated users, cart is read from DB and this param is ignored.

## The One-Trip Promise (Checkout Context)
`get_checkout_context()` must return:
1. `items`: Cart state + current DB prices/stock.
2. `address`: Auto-resolved suggested address based on GPS/History.
3. `bill`: Complete line-item breakdown (Zero Shadow Math).
4. `vouchers`: Applicable coupons.
5. `wallet`: Current balance.

**Atomic Failure Contract**:

| Type | Behaviour | UX |
|---|---|---|
| READ failure | Skeleton stays visible. No blank screens. | "Couldn't load [Component] [↺ Retry]" |
| WRITE failure | Toast with human-readable error. | Error message + `Retry same method` (primary) + `Try another method` (secondary) |
| Network failure | Optimistic UI reverts. | Toast: "Action failed. Please try again." |

**Frictionless Logic**: `get_checkout_context` must perform **Address Gravity** resolution: if `user_id` is null but `p_guest_lat/lng` is provided, return the closest matching serviceability node. If `user_id` exists, auto-select the most relevant saved address based on distance to vendor. Returns `suggested_address_id` — frontend pre-selects it.

Multi-trip = failure. If you're making two calls for one screen, there is a design error.

---

## Guest Cart Contract

- **Storage**: Cart persisted in session storage (not localStorage) while guest.
- **Merge**: On OTP verify, `merge_guest_cart_atomic` RPC merges session cart into the authenticated user's DB cart.
- **Conflict**: If user already has a DB cart from a different vendor, CartSwitchSheet triggers.
- **Expiry**: Guest cart expires after 24 hours of inactivity.

---

## Scroll Architecture

- **Mobile**: `body { overflow: hidden }`. All scroll happens within the active sheet or page content area. No body scroll when sheet is open.
- **Desktop**: Correction applied — standard `overflow: auto` on main content. Sheets become right-panel or modal pattern.
- **Sheet behaviour**: ProductSheet, CartDrawer, OTPSheet — all prevent background scroll when open.

---

## Schema-Driven Development

The database is the Single Source of Truth. Never hand-roll types.

1. All domain names (`vendors`, `products`, `cart_products`) are defined in Supabase.
2. After every schema change: `supabase gen types typescript` → updates `src/lib/supabase/database.types.ts`.
3. Map RPC outputs directly to generated interfaces. Never duplicate.

---

## Nomenclature (Zero Drift)

| Concept | Canonical | Forbidden |
|---|---|---|
| Vendor | **Vendor** | Partner, Merchant, Seller |
| Product | **Product** | Item, SKU, Good |
| Variant | **Variant** | SKU (as config ID) |
| Customisation | **Customisation** | — |
| Personalisation | **Personalisation** | Design, Custom |
| Order Line | **Order Product** | Order Item, Line Item |
| Rider | **Delivery Executive** | Delivery Partner, Driver |
| Order ref | **`#WK-YYYYMMDD-XXXX`** | `#WSH-` or any other prefix |

**Customisation** = selecting vendor-defined options (size, colour, material) before payment. **Personalisation** = submitting unique inputs (text, image, name) after payment. These are NOT interchangeable.

**Automated guard [Phase 2]**: `npm run lint:nomenclature` will fail CI if any forbidden term is detected in `src/`.

---

## Security

- **Webhook Verification** — All Razorpay webhooks verify `x-razorpay-signature` via HMAC-SHA256. Never process unsigned webhooks.
- **Rate Limiting** — API: max 60 req/min per IP. Cart mutations: max 10 req/min per user (Vercel edge).
- **No Secrets in Code** — All secrets via environment variables. Never committed to git.
- **CSP Headers** — Set in `next.config.ts`. `frame-ancestors 'none'`. `script-src 'self' cdn.razorpay.com maps.googleapis.com`.
- **API Key Rotation** — `SUPABASE_SERVICE_ROLE_KEY` and `RAZORPAY_KEY_SECRET` rotated every 90 days.

---

## Observability

- Every commerce intent is traced via **OpenTelemetry**. One trace per intent, tagged with `intent_type`, `user_id`, `vendor_id`.
- All logs go through the structured **`logger`**. Zero `console.log` / `console.warn` / `console.error` in production.
- Structured logging fields: `level`, `event`, `order_id`, `user_id`, `duration_ms`, `error_code`.

---

## Testing Standards

- **Unit tests** (Vitest): All RPC callers in `src/lib/actions/`. Coverage gate: 80%.
- **Mutation testing**: All commerce intent functions tested for error branches (`VENDOR_OFFLINE`, `INSUFFICIENT_STOCK`, `VENDOR_MISMATCH`).
- **Nomenclature Standards**: Zero forbidden terms = green.
