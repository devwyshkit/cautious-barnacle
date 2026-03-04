---
description: How to implement checkout, payment, and post-payment flows in WyshKit
---

# Checkout & Payment Flow

## The One-Page Checkout

Checkout is ONE page. ONE scroll. No sub-pages. No drawers inside checkout.

### Route: `/checkout`

### Auth Gate
- If not logged in → `OTPSheet` slides UP over `/checkout`.
- Page renders behind it, greyed out.
- OTP verified → sheet closes → checkout loads with authenticated context.
- User closes OTPSheet → back to `/`. Cart preserved in session.

### Data Loading
ONE RPC: `get_checkout_context(p_guest_lat, p_guest_lng, p_guest_cart_items)`

Returns:
1. `items` — cart state with current DB prices/stock
2. `address` — auto-resolved `suggested_address_id` based on GPS
3. `bill` — complete line-item breakdown (Zero Shadow Math)
4. `vouchers` — applicable coupons
5. `wallet` — current balance

### Section Layout
```
[Items] → [Delivery Address] → [Bill] → [Coupons] → [Slide to Pay]
```

All on one scroll. No tabs. No steps.

### Address Auto-Selection
- `suggested_address_id` from RPC → frontend pre-selects.
- Nearest saved address matched to GPS.
- User taps to change → `AddressSheet`.
- No address saved → "Add delivery address" CTA.

### Coupon UX (Swiggy Pattern)
- `[Have a promo code? ▾]` — collapsed by default.
- Tap → show all available coupons with benefits.
- **Tap to apply** (Recognition over Recall). Text field as secondary fallback.
- Applied → green badge + discount shown in bill.
- Invalid → red inline text: "This code isn't valid."

### Bill Breakdown (Complete Transparency)
```
Product total           ₹X
Personalisation (×N)    ₹X
Delivery                ₹X
Platform fee            ₹5
GST (X%)                ₹X
───────────────────────
TOTAL                   ₹X
```
All amounts from `get_checkout_context`. Never computed in frontend.

### Payment
- **Slide to Pay** (mobile) / **Place Order** button (desktop).
- Razorpay handles the payment sheet — WyshKit doesn't own that UX.
- 100% advance. No COD. Ever.

### Payment Error States
```
Success         → redirect /orders/[id]?success=true
Failure         → Error sheet: "Payment failed. Try again?"
                  [Retry same method]  ← primary
                  [Try another method] ← secondary
Pending         → "Confirming payment..." → Razorpay webhook resolves (max 30s)
```

Never auto-retry. User decides.

## Post-Payment Flow

### Success → `/orders/[id]?success=true`
1. Brief success overlay (~2s): ✅ green checkmark + order number
2. Overlay collapses → user lands on tracking page
3. If personalised products → Section B (requirements form) auto-opens
4. No separate success page. No redirect to home.

### Personalisation Requirements (Section B)
- Auto-opens only on `?success=true` + personalised products.
- Fields from vendor's `personalization_schema` (max 3 fields).
- Inline validation. Character counter.
- Submit → status: `DETAILS_RECEIVED` → Toast: "Details sent ✓"
- Section collapses: "✓ Submitted · 14:32 [Edit]"

### Preview Thread (Section C)
- Chat-like display: what user sent, what vendor delivered.
- Preview image tap → full-screen.
- Three actions: Approve (slide) / Request change / Reject & refund.
- **Slide to Approve** → haptic → `IN_PRODUCTION` → thread freezes.
- **Approval = liability shift.** Non-refundable after this unless physically damaged.

## Key Technical Rules

1. **Zero Shadow Math** — every number on checkout comes from Postgres.
2. **Idempotency** — `place_atomic_order` uses idempotency key. Double-tap is safe.
3. **Webhook verification** — all Razorpay webhooks verified via HMAC-SHA256.
4. **Cart → checkout must close CartDrawer** — no sheet nesting.
