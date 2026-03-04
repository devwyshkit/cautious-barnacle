# WyshKit 2026: KERNEL — The Engineering Law

> *The database is the only computer. The frontend is a high-fidelity display. Everything else is noise.*

---

## The 7 Laws of 2026

1. **Zero Shadow Math** — All commerce arithmetic (GST, platform fees, delivery, coupons, wallet) is the exclusive domain of the Postgres kernel. Frontend math is prohibited. *Total price on "Add to Cart" must be indicative or server-fetched.*
2. **Atomic Intent** — Every user decision maps to exactly one RPC round-trip. No chaining. No "Shadow Sessions."
3. **Perpetual State Purity** — The UI is a stateless projection of the database. The first render is always the Authored Source.
4. **Flush Symmetry** — No padding leakage. No Drawer-within-a-Drawer. Borders and headers form one surface.
5. **Healthy Friction** — `Slide to Pay` validates intent. Friction is a bug only when it blocks a decision; it is a feature when it confirms one.
6. **Visual Gravity** — Surfaces containing money (Wallets, Bill) always carry higher visual elevation (shadows, borders) than static surfaces.
7. **Haptic Resonance** — Every transactional intent (Confirm, Toggle, Slide) must echo in the hand. No vibration = no transaction.

---

## Hard Engineering Rules

1. **Zero Shadow Math** — If you're computing a total or ETA in TypeScript, you've already failed.
2. **Atomic RPC First** — One user intent = one RPC. `execute_cart_mutation`, `place_atomic_order`, `get_checkout_context` — all atomic.
3. **Commitment Before Creativity** — Payment first, personalisation after. Eliminates ghost orders. Protects vendor bandwidth.
4. **Liability Shift** — Nothing is produced until the customer "Slides to Approve" the digital mockup. `liability_shifted_at` is the point of no return.
5. **SECURITY DEFINER + explicit search_path** — Every `SECURITY DEFINER` RPC must include `SET search_path = public, extensions`. No exceptions. Missing this = search-path injection risk.
6. **Structured Errors, Not Raw SQLERRM** — API responses always use machine-readable codes. Never expose raw DB error strings.
   | Code | Trigger | Frontend Action |
   |---|---|---|
   | `ORDER_ALREADY_EXISTS` | Idempotency hit | Return existing order silently |
   | `VENDOR_OFFLINE` | Vendor closed | "This vendor is currently closed." |
   | `VENDOR_MISMATCH` | Multi-vendor cart | Show Cart Switch Sheet |
   | `INSUFFICIENT_STOCK` | Stock depleted | "Sorry, [Product] just sold out." |
   | `COUPON_INVALID` | Expired/wrong | "This code isn't valid" inline |
   | `PAYMENT_UNAUTHORIZED` | Auth failed | Show error, let user retry. Never auto-retry. |
7. **No Silent Exception Swallowing** — `EXCEPTION WHEN OTHERS THEN RETURN json_build_object('success', false)` is forbidden in state-modifying RPCs. RAISE. Let Postgres roll back.
8. **RLS-First Architecture** — All tables exposed to PostgREST have RLS enabled. `SECURITY DEFINER` functions bypass RLS intentionally — treat them as privileged kernel operations, not shortcuts.
9. **FK Indexes** — PostgreSQL does NOT auto-index foreign keys. Every FK column must have a covering index.
10. **ETA Contract — Time > Distance**
    - Formula: `ETA = vendor.avg_prep_time_mins + (distance_km × 5) + 5 [buffer]`
    - Product Card: "~40 min" | Checkout: "Arriving in ~45 mins" | Tracking: "Arriving by 5:15 PM"
    - Never show km. Ever.
11. **Slug-First Architecture** — All customer-facing URLs must use human-readable slugs (`/vendor/bakery-name/product/chocolate-cake`) instead of standard IDs/UUIDs for SEO and trust. *Passing a UUID to a slug-based route results in a 400 architecture guard.*
    - **HARDENING 2026**: Fallback to UUID in customer-facing links is a P0 failure. Always fetch `vendor_slug` and `product_slug` (aliased as `slug`) in the One-Trip context. 
    - **POLYMORPHIC RESOLUTION**: RPCs like `get_product_surface_v1` and `get_vendor_surface` MUST support dual resolution (ID or Slug) via regex-based input detection to prevent routing failures during the 2026 transition. 
12. **Realtime-First** — Order tracking uses Supabase Realtime (`public:orders:id=eq.$order_id`). Fallback: 30s polling if WebSocket fails.
13. **Anti-Fragile State** — A Shadowfax/Porter API failure must NOT block a vendor from marking an order `PACKED`. Decouple 3PL from the order state machine.

---

## Commerce Intent Engine

Every user mutation flows through one validated entry point:

```typescript
type CommerceIntent =
  | { intent: 'ADD_TO_CART';      payload: { product_id, quantity, ... } }
  | { intent: 'PLACE_ORDER';      payload: { razorpay_order_id, ... } }
  | { intent: 'TRANSITION_ORDER'; payload: { order_id, target_status } }
  | { intent: 'APPLY_COUPON';     payload: { code } }
  | { intent: 'TOGGLE_WALLET';    payload: { enabled } }
  // ... 9 more intents

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
| Checkout | `get_checkout_context()` |
| Order history | `get_user_orders_v1()` |

Multi-trip = failure. If you're making two calls for one screen, there is a design error.

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
| Personalisation | **Personalisation** | Customisation, Design |
| Order Line | **Order Product** | Order Item, Line Item |
| Rider | **Delivery Executive** | Delivery Partner, Driver |
| Order ref | **`#WK-YYYYMMDD-XXXX`** | `#WSH-` or any other prefix |

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
