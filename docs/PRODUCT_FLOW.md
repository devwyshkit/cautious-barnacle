# WyshKit Product Flow — Definitive v2
### "Swiggy for Products with Optional Personalisation"
### Updated: February 23, 2026

---

## The Three Beliefs (Non-Negotiable)

1. **Commitment Before Creativity** — Pay first, personalise after. Always.
2. **Hyperlocal Time > Distance** — Show "Arriving by 5:15 PM", never "2.4 km away".
3. **Preview Trust > Price** — A digital mockup (not a product photo) before production starts. This is the moat.
4. **Anticipatory UX** — Eliminate typing. One-tap presets for delivery (Silence Mode, Gate Drop).

---

## What Personalisation Means Here

> **Personalisation** = Adding identity to an existing product. "Rahul" engraved on a whiskey glass.
> **Customisation** = Changing the product's specs. We don't do this.

The vendor has a glass. The customer adds a name. That's it. The preview shows what the engraving *will look like on* the glass — a digital overlay. Not a photo of the engraved glass. Never confuse the two.

Engraving takes 1–5 minutes. Build the SLA accordingly.

---

## Sheet vs Page (Non-Negotiable)

| Surface | Pattern | Reason |
|-|-|-|
| Product detail | **Sheet** (intercepted route) | Browsing context, no domain shift |
| Cart | **Floating bar + Cart Drawer (Sheet)** | Transient; immersive review; no URL needed |
| Location picker | **Sheet** | Sub-decision within home |
| Address picker | **Sheet** (within checkout) | Sub-decision within checkout |
| Vendor storefront | **Page** `/vendor/[id]` | Domain shift |
| Checkout | **Page** `/checkout` | Money commitment |
| Order tracking | **Page** `/orders/[id]` | URL-addressable, support deep-links |
| Preview mockup | **Inline in tracking page** | NOT a new sheet/screen |
| Post-delivery rating | **Inline in tracking page** | Deferred section, NOT a separate screen |
| Support | **Sheet** | Overlay on current context |

---

## Canonical Flow (Complete, Linear)

### Step 1 — HOME FEED `/`
- Location resolved at session start (not per page)
- Feed: `BANNER_BENTO → CIRCLE_RAIL (categories) → VENDOR_GROUPED_GRID / INFINITE_GRID`
- Each product card shows: photo · name · price · **"~40 min"** (ETA chip, never km) · add button
- First tap on add → opens product sheet

---

### Step 2 — PRODUCT SHEET (intercepted route, no page reload)

Content order (mandatory):
1. **Image carousel** (3–5 product photos)
2. **Name** · vendor badge ("By [Vendor], [Area]") · star rating
3. **Price** (large, prominent)
4. **Variants** — size/colour/material chips (select one)
5. **Add-ons** — toggles or steppers (gift wrap, express prep, etc.)
6. **"Add personalisation +₹X"** — toggle only. No input. No design canvas. (Commitment Before Creativity)
7. **Product info** — dimensions, weight, material (collapsible)
8. **ETA** — "Arriving by 5:15 PM" (never km)
9. **Return policy** — "Personalised products: no returns after preview approval | All others: 24 hrs (damaged/wrong only)"
10. **"Add to cart" button** (sticky at bottom)

**Cart switch rule**: If cart has products from a different vendor → bottom sheet: two buttons: "Start new order" (destructive) + "Continue with [Previous Vendor]".

---

### Step 3 — CART (floating bar + expandable mini-sheet)

- Persistent floating bar at bottom of feed showing: product count · total
- Tap → expands to **CartDrawer** (Sheet): product list · relative quantity controls · subtotal · "Checkout Now"
- One vendor per cart. Always.
- "Checkout Now" → navigates to `/checkout` (domain shift → full page)
- Pricing is real-time high-precision, fetched via `v_active_cart_totals` (Database = Single Source of Truth).

---

### Step 4 — CHECKOUT PAGE `/checkout`

**The One-Trip Promise.** `get_checkout_context` returns everything: products, addresses, pricing, wallet, coupons. No multi-step loading or state drift.

Section order (BlocksEngine):
1. **CHECKOUT_ITEMS** — product names, quantities, personalisation flag, add-on flag
2. **CHECKOUT_ADDRESS** — saved addresses (select) or add new (Google Autocomplete)
3. **CHECKOUT_SUMMARY** — full bill line by line:
   - Product total
   - Personalisation fee(s)
   - Add-on fee(s)
   - Delivery fee (+ ETA)
   - Platform fee
   - GST
   - Coupon discount (if applied)
   - WyshKit Wallet deduction (if toggled)
   - **"You'll earn ₹X WyshKit Money"** ← Flywheel shown, motivates completion
   - **TOTAL**
4. **CouponSlot** — collapsed ("Have a promo code?" → tap to expand). Never always-visible.
5. **Wallet toggle** — shown only if balance > 0. One tap. No friction.
6. **GstinSection** — collapsed ("Business purchase? Add GSTIN" → tap to expand). Optional.
7. **EstimateButton** — shows only after valid GSTIN entered. "Download Estimate" (Proforma invoice used for internal corporate approvals *before* payment. Not a legal tax document).
8. **Final Invoice** (Tax Invoice) — Generated and downloaded only *after* delivery. Legal document for GST claims.

**Footer (sticky)**:
- Mobile: `SlideToPay` gesture
- Desktop: "Place Order · ₹XXX" button
- Disabled states: no address selected → greyed out | pricing error → retry button

**Payment**: 100% advance. Razorpay. No COD. Ever.

---

### Step 5 — POST-PAYMENT SUCCESS

Immediate redirect to `/orders/[id]?success=true`.

Success overlay shows briefly (~2–3 seconds):
- ✅ large green checkmark
- "Order Confirmed!"
- "Taking you to your order..."
- Then collapses inline — user lands on the order tracking page

No "Design Hub" jargon. No 5-second loaders.

---

### Step 6 — ORDER TRACKING PAGE `/orders/[id]` — THE HEARTBEAT

**Single page. Everything is inline. No modals. No extra navigation.**

#### Section A — STATUS CARD
- Current status + icon + colour
- Order ref: `#WK-YYYYMMDD-XXXX`
- ETA: "Arriving by 5:15 PM" (once rider assigned)

#### Section B — IDENTITY FORM (personalised products only)
Auto-opens if `?success=true` and order has personalised products.

Vendor-defined fields (schema from `personalization_schema` config):
- Text field with character limit + instructions
- Image/creative upload
- Select (dropdown choice)

No design canvas. No Canva. Just input collection.

After submission → `DETAILS_RECEIVED`
Toast: "Details sent to your vendor. Preview coming soon."

#### Section C — THREE-LAYER PREVIEW HISTORY (per personalised product)

For each personalised product, shows:

```
┌─ WHAT YOU SENT ─────────────────────────── [timestamp]
│  Customer's submitted details (text fields, image thumbnails)
│
├─ WHAT YOU RECEIVED ─────────────────────── [timestamp]
│  [Mockup thumbnail — digital overlay, NOT real product photo]
│  Vendor note (optional message from vendor)
│  
│  Pre-approval notice:
│  "This is a digital preview. Minor variations in rendering may occur.
│   Once approved, personalisation starts immediately and cannot be undone."
│  
│  [Slide to Approve] ← Liability shifts to customer on approval
│  [Request a change — X free remaining]
│  [Purchase a revision — ₹49] ← appears only after free revisions exhausted
│  [Reject & get instant refund] ← inline double-confirm (not window.confirm)
│
└─ WHAT CHANGED ──────────────────────────── [timestamp] (if revision)
   Customer's revision request text
   → New "WHAT YOU RECEIVED" entry when vendor uploads next mockup
```

**Approval → liability shift**: once customer approves, the product is non-refundable unless the physical product is damaged or factually wrong on delivery.

**Reject flow**: immediate line-product refund. Remaining products in the order continue independently.

**SLA Breach** (vendor hasn't uploaded mockup after vendor-defined window):
- Automatic notification (in-app + push)
- Customer sees: "Vendor running late. Wait for free? Or cancel this product for a full refund."
- **Instant Refund Logic**: Triggered via `cancel_order_product` RPC which handles liability checks and auto-credits WyshKit Wallet.
- No auto-cancel. Customer decides.

#### Section D — ORDER PRODUCTS LIST
Each product with independent status badge:
- Non-personalised: `CONFIRMED → IN_PRODUCTION → PACKED → SHIPPED → DELIVERED`
- Personalised: `AWAITING_DETAILS → DETAILS_RECEIVED → PREVIEW_READY → IN_PRODUCTION → PACKED → SHIPPED → DELIVERED`

#### Section E — DELIVERY INFO (once `SHIPPED`)
- "Arriving in ~22 mins"
- Rider name + masked phone
- No map embed for 3PL deliveries (Shadowfax/Porter handle routing)

#### Section F — BILL SUMMARY

#### Section G — ORDER TIMELINE
Chronological, newest first. Every state transition logged with timestamp.

#### Section H — RATING (deferred)
Not shown immediately.
Appears: 30 mins post-delivery, OR on next app open, OR via push notification.
Simple 5-star + optional text. No forced prompt at delivery moment.

#### Section I — SUPPORT
"Need help?" → Chat (WhatsApp) + Call buttons.
Only shown if `NEXT_PUBLIC_SUPPORT_WHATSAPP` and `NEXT_PUBLIC_SUPPORT_PHONE` are set.
Buttons hidden if env vars missing — no dead links.

---

### Step 7 — DELIVERED

- Haptic + brief confetti (not 5+ seconds)
- Invoice PDF downloadable
- Cashback credited: "₹X WyshKit Money added to your account" (toast + section in page)
- Rating deferred to Step 8

---

## Handling Mixed Orders (Partial Fulfillment)

Order with 2 products: 1 personalised + 1 non-personalised.

| Product | Path |
|-|-|
| Non-personalised | Fast-tracks: CONFIRMED → IN_PRODUCTION → PACKED → separate delivery or combined |
| Personalised | Goes through preview loop independently |

If personalised product is rejected:
- That line product is instantly refunded
- Non-personalised product(s) continue unaffected
- Order status stays ACTIVE (not fully cancelled)

If all products cancelled → full order CANCELLED + full refund.

---

## SLA Table (Vendor-Configurable)

| Metric | Default | Vendor-Configurable |
|-|-|-|
| Preview upload time | 2 hours | Yes — up to 6 hours |
| Free revisions | 2 | Yes — 0 to 5 |
| Paid revision fee | ₹49 | Yes — ₹0 to ₹500 |
| Production time (post-approval) | 5 mins | Yes — up to 60 mins |
| Total delivery SLA | 60–120 mins | N/A (set by location + 3PL) |

**SLA Breach Protocol**:
1. **T + 0h** — vendor accepts order
2. **T + (SLA - 30min)** — silent reminder to vendor
3. **T + SLA** — urgent alert to vendor + customer notified
4. **T + SLA + 30min** — customer given choice: wait (no penalty) or cancel + instant refund

---

## Refund Policy (Clear, Final)

| Scenario | Refund |
|-|-|
| Cancel before any production starts (non-personalised) | Full refund incl. delivery fee |
| Cancel after dispatch | No refund (delivery completed) |
| Preview rejected (any stage) | Full product refund; delivery fee non-refundable if other products shipped |
| Preview approved, then product delivered damaged | Full refund or replacement |
| Preview approved, product delivered correctly | No refund (liability shifted on approval) |
| All products cancelled | Full order refund incl. delivery fee |
| SLA breach → customer cancels | Full refund incl. delivery fee (vendor bears cost) |

---

## Vendor-Defined Configuration (Per-Product)

```json
{
  "personalization_schema": [
    { "field_id": "name", "type": "text", "label": "Name to engrave", "max_chars": 15, "instructions": "English only, no special characters" },
    { "field_id": "logo", "type": "image_upload", "label": "Upload your logo", "instructions": "PNG with transparent background, min 300x300px" }
  ],
  "max_free_revisions": 2,
  "paid_revision_fee": 49,
  "preview_sla_hours": 2,
  "production_sla_mins": 10
}
```

---

## Cashback Flywheel

Triggers: ORDER DELIVERED → automatic credit → visible in wallet + transaction history.

Surface at:
- **Checkout bill summary**: "You'll earn ₹X WyshKit Money on this order"
- **Order success**: "₹X WyshKit Money credited"
- **Wallet balance**: "₹X available — use at next checkout"

Usage: wallet toggle at checkout → `TOGGLE_WALLET` intent → deducted from total.

Rate configuration: in `platform_settings` DB table (not hardcoded). Current: 2%, min ₹10, max ₹500.

---

## Estimate + GSTIN (B2B Layer)

Standard in every major platform. WyshKit supports:
- GSTIN entry (collapsed accordion at checkout, verified via IDfy in real time)
- Pro-forma estimate PDF (appears after valid GSTIN is entered)
- Estimate includes: vendor GSTIN, customer GSTIN, line products with HSN, GST breakdown

---

## Naming (Enforced)

### Backend / DB / Code
| Concept | Symbol |
|-|-|
| Store | `vendors` table |
| Line product in order | `order_products` |
| Cart line | `cart_products` |
| Personalisation details | `personalization_details` column |

### Customer-Facing UI
| Use | Never use |
|-|-|
| "personalisation" | "customisation", "Design Hub", "Identity" |
| "vendor", "local store" | "partner", "merchant", "SKU", "item" |
| "Arriving by 5:15 PM" | "2.4 km away", "distance" |
| "preview" | "mockup", "proof", "design" |
| Human-readable status ("Your vendor is making it") | Raw DB enum ("IN_PRODUCTION") |

### Vendor-Facing UI
| Use | Never use |
|-|-|
| "orders", "your shop", "earnings" | "vendor panel", "dashboard", "portal", "merchant" |
