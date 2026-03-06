# WyshKit 2026: DOCTRINE — The Strategy

> *"We are what Swiggy would be if they delivered trust instead of biryani."*

---

## ❌ WHAT WE'RE **NOT**
- **NOT** a gifting marketplace (gifting is just ONE category)
- **NOT** quick commerce (we don't own inventory/dark stores)
- **NOT** customization platform (it's **personalization**)
- **NOT** a custom design tool (no Canva bullshit)

## ✅ WHAT WE **ARE**
**"Swiggy for Products with Optional Personalization"**

Just like:
- Swiggy Food = Hyperlocal restaurant marketplace where restaurants provide food, Swiggy provides delivery
- **WyshKit = Hyperlocal product marketplace where vendors provide products (with optional personalization), WyshKit provides delivery**

---

## The Differentiation Problem (Research-Backed)

WyshKit is built on the **Swiggy 2026 substrate**: hyperlocal logistics, SLA discipline, neighbourhood density. But we are not a commodity delivery app.

**The WyshKit Delta: Trust → Personalisation.**

| | Swiggy / Blinkit | WyshKit |
|---|---|---|
| **Core delivery** | Food / Goods | Personalised goods |
| **Trust mechanism** | Ratings, ETA | The Preview (digital mockup before production) |
| **Return risk** | Low (edible/consumable) | High without preview (engraved = unsellable) |
| **Disappointment Tax** | Low | Very high (wrong name engraved = destroyed product) |
| **Solution** | Standard delivery SLA | **Preview Workflow** — customer approves before production |

**The Preview Moat**: Once a customer sees their name engraved on a digital mockup and taps "Slide to Approve," the product is theirs. Return rate → ~0. Premium pricing justified.

---

## The Apple Example: Personalization vs. Customization (CRITICAL)

The WyshKit mental model follows the **Apple Pattern**: **Inventory + 10-minute Identity Layer.**

- **Customization** = Changing the product itself (Making iPhone in pink, custom chip, different specs). **WyshKit does NOT do this.**
- **Personalization** = Adding identity to an existing product (Engraving "Rahul" on existing Space Grey AirPods). **THIS is what we do.**

We are the Apple Engraving Service, scaled to every local vendor. We Source → Identify → Deliver.

## The Cleartax Insight: Trust → Personalisation

The WyshKit mental model was born from 5 years of corporate gifting data. The industry error is treating personalized products as "custom manufacturing" (slow, expensive, centralized).

The **WyshKit Reality** is the convergent pattern:
- **Inventory** is sourced locally (Swiggy pattern).
- **Service** is applied via neighbourhood workshop nodes (Fiverr pattern).
- **Trust** is established via the digital preview (Identity pattern).

---

## The 7 Product Laws of Swiggy 2026

> These are the **implementation rules** (the HOW). For the **product beliefs** (the WHY), see [WORKFLOW.md → The Four Beliefs](./WORKFLOW.md).

1. **Commitment Before Creativity** — Pay first, personalise after. Eliminate the "Creative Tax" pre-payment.
2. **Law of the One-Page Checkout** — Address, Bill, Coupon, GST, and Payment on ONE scroll. No drawers. No intermediate screens. 
3. **Law of Address Gravity** — Pre-select the destination. State "Delivering to [X]", don't ask "Where?".
4. **Law of Late-Bind Auth** — Guests are kings. Login is the final gate at checkout entry (OTPSheet over `/checkout`). Browse and cart are fully anonymous.
5. **Instamart Cataloging** — Selection via Chips/Toggles only. **Zero pre-payment typing.**
6. **One-Trip Promise** — Every data point needed for checkout (Pricing, ETA, Addresses) must load in ONE RPC.
7. **Law of Physical Transparency** — Dimensions, Weight, Material, and Return Window are mandatory chips on the product sheet.

---

## The Master Principle: Zero Reinvention
WyshKit is the hyperlocal marketplace for products with **optional personalization**. We treat personalization not as custom manufacturing, but as a **10-minute service applied to existing inventory**. We mirror Swiggy Food (Operations), Instamart (Cataloging), and Fiverr (Creativity).

---

## Engineering & Product Ideology
We follow the **DRY KISS YAGNI** triad:
- **DRY (Don't Repeat Yourself)**: Single Source of Truth in the Database. UI is a stateless projection.
- **KISS (Keep It Simple, Stupid)**: If it takes more than 5 seconds to understand a screen, the design has failed.
- **YAGNI (You Ain't Gonna Need It)**: No "Future-proofing" features. Build only what drives the current order.

---

## The Hyperlocal Growth Flywheel

```
More Demand
  → More Vendor Nodes
    → Higher Density
      → Lower Delivery Time (Rider Efficiency)
        → Higher Satisfaction
          → More Demand (Repeat)
```

**WyshKit lever**: Cashback sits at the bottom as the "Investment" in the Hook Model. It accelerates the repeat cycle without discounting the product.

---

## The 4W Decision Filter

Every product decision must pass the 4W test. If one W is missing, the feature is rejected.

1. **Win for Customer** — Faster delivery, higher quality personalisation, lower anxiety.
2. **Win for Vendor** — Higher margins, zero ghost orders, faster payouts, inventory protection.
3. **Win for Delivery Executive** — Predictable pickups, high-density zones, minimal dead miles.
4. **Win for WyshKit** — Healthy commission, zero inventory risk, defensible preview moat.

---

## Behavioral Science Laws (Implementation-Backed)

### Hick's Law — Every Extra Choice is a Conversion Tax
- Max 4 variant groups, max 4 options per group (matches WORKFLOW + OPERATIONS).
- Max 8 categories in CIRCLE_RAIL.
- Single payment method: Razorpay. No COD. Ever.
- Personalisation selection: Single toggle on Product Sheet.
- Personalisation requirements: ≤3 fields per product (**Post-Payment ONLY**).

### Miller's Law — 7±2 Cognitive Slots
Never show more than 7 primary items in a single view. All secondary options collapse via Progressive Disclosure.

### Fitts' Law — Tap Targets
All interactive elements: minimum **44×44px** tap target. Primary actions (Add to Cart, Slide to Pay) are large, high-contrast, thumb-reachable.

### Nir Eyal's Hook Model — The Cashback Flywheel
```
TRIGGER   → "Anniversary tomorrow" push / Instagram ad
ACTION    → Open app → browse → add to cart (3 taps)
REWARD    → Preview mockup (variable, emotionally resonant)
            + Cashback credit (variable %, feels like a bonus)
INVEST    → Saved address + review left + wallet balance
    ↓
INTERNAL TRIGGER → Next occasion → user remembers WyshKit without a prompt
```
- Surface wallet balance on home: "₹48 WyshKit Money — use today."
- Hidden wallet = broken Hook.

### Peak-End Rule (Kahneman) — Memory, Not Average
Users remember the peak moment and the final moment. Not the average.

| Moment | What it must feel like |
|---|---|
| **Peak** (Preview Approval) | Full-bleed preview, haptic on slide, instant animation. Not a plain button. |
| **End** (Delivery + Cashback) | Brief confetti (≤2s), large cashback credit display, wallet balance update. Not a plain toast. |

### Zeigarnik Effect — Open Loops Pull Users Back
A user with an active order MUST see their order status widget at the top of the home feed, above the Banner Bento. It creates psychological open loops. Never de-prioritise it.

### Doherty Threshold — 400ms Budget
Every user action must produce visual feedback within 400ms. Below this, users enter flow.

| Action | Target | How |
|---|---|---|
| Add to Cart | <100ms | Optimistic UI + haptic. RPC fires in background. |
| Slide to Pay | <200ms | Razorpay modal opens instantly. Order creation is async. |
| Search | <300ms | Debounced `search_products_atomic` RPC + skeleton. |
| Page nav | <400ms | Next.js prefetch + RSC streaming. No blank screens. |

### Jakob's Law — Borrow, Never Invent Gestures
| Pattern | Source | WyshKit Implementation |
|---|---|---|
| Bottom sheet product detail | Swiggy / Zomato | Sheet slides up from bottom, swipe-down to dismiss |
| Slide-to-pay | Swiggy / Uber | Horizontal slider with haptic on release |
| Float cart button | Swiggy / Blinkit | Bottom-right FAB with item count badge |
| Pull-to-refresh | iOS / Android | All feed pages: `router.refresh()` |
| Order tracking timeline | Swiggy / Amazon | Vertical stepper: completed / active / pending |

### Tesler's Law — Complexity Belongs in the Kernel
| Complexity | Who Bears It |
|---|---|
| GST (5/12/18/28% per HSN) | `calculate_order_total` RPC. User sees: "GST: ₹XX." |
| Delivery fee (distance, vendor, min order) | Postgres. User sees: "Delivery: ₹30" or "FREE." |
| Commission tiers | `platform_settings` table. Vendor sees "Commission: 12%." |
| Coupon validation (min order, expiry, usage limit) | Atomic RPC. User taps "Apply" → sees green or red. |

### Customisation vs. Personalisation

> Full definition in [WORKFLOW.md](./WORKFLOW.md). Summary below.

| Term | Meaning | When | Where |
|---|---|---|---|
| **Customisation** | Selecting pre-defined options (Size/Color) | Before payment | Product Sheet |
| **Personalisation Add-on** | Toggling the "Add Engraving" service | Before payment | Product Sheet |
| **Personalisation Details** | Submitting text/image/name | After payment | Order Tracking |
| **Personalisation Preview** | Seeing the digital render | After payment | Order Tracking |
| **Personalisation Approval** | Tapping "Slide to Approve" | After payment | Order Tracking |

### Von Restorff Effect — The Isolation Rule
If everything is highlighted, nothing is highlighted. One primary CTA per screen. One primary colour per screen. Everything else is muted.

### Weber's Law — Price Perception
₹30 delivery on a ₹200 order = painful (15%). Same ₹30 on ₹2000 = invisible (1.5%).
- Subsidize delivery on low-AOV orders.
- Minimum cashback floor: ₹10. Below that, round up. The variable reward must feel meaningful.

### Anti-Dark-Pattern Doctrine (Absolute)
| Dark Pattern | WyshKit Position |
|---|---|
| Confirmshaming | **Forbidden**. Decline CTAs say "No thanks." Never guilt-laden copy or tiny "I don't need this" text. |
| Hidden fees | **Forbidden**. Delivery fee visible on the product card chip. No surprises at payment. |
| Cancellation | 100% fee after order placement for personalised items. Must be clearly stated at pay-slide. |
| Return Window | 24 hours for damaged/incorrect physical items. Visible on product sheet. |
| Mandatory Sign-up | **Forbidden**. Late-bind auth only. Let them see the bill before asking for ID. |
| Urgency theatre | "Only 3 left!" requires `stock_quantity <= 3 AND stock_quantity IS NOT NULL`. Never fabricated. Technical enforcement: query must verify real stock before rendering any scarcity indicator. |
| Forced continuity | No subscription tiers for customers. Zero. |
| Disguised ads | Promoted vendors carry a visible "Promoted" badge. Always. |
| Pre-checked opt-ins | All checkboxes unchecked by default. Always. |
| `window.confirm()` | **Forbidden**. All destructive confirmations use inline styled double-confirm. Never native browser dialogs. |
| Promotional push 10PM–8AM | **Forbidden**. DND window enforced in notification scheduler. |

---

## Messaging Playbook

### To Customers: Emotional → Transactional → Rational
- *"Forgot a birthday? Personalised gift before the party starts."*
- *"See a preview before we make it. Don't like it — instant refund."*
- *"Last-minute. Lifetime memory."*

| Use | Never Use |
|---|---|
| "personalised", "personalisation", "preview" | "customised", "mockup", "Design Hub", "builder" |
| "by 5:15 PM", "~40 min" | "2.4 km away", "distance" |
| "local vendor" | "platform", "marketplace", "e-commerce" |

### To Vendors: Clear ROI, Zero Jargon
- *"Every order you receive is already paid. 100%. No ghost orders."*
- *"We bring the customer. You do the 5-minute engraving. Rider picks up. You get paid."*
- *"Once the customer approves your preview, the sale is final. No returns."*

| Use | Never Use |
|---|---|
| "orders", "your shop", "earnings" | "vendor panel", "dashboard", "merchant" |

---

## GTM: Phase 1 — Bengaluru

**Target zones**: Koramangala, Indiranagar, HSR Layout, Jayanagar, Whitefield.

**Target moments**: 
- **Personal**: Last-minute birthdays, forgotten anniversaries, festivals (Diwali, Valentine's, Mother's Day).
- **Professional**: Corporate awards, employee kits, speaker mementos, branded event merchandise.
- **Identity**: Personal keepsakes, nameplates, heritage items, sports trophies.

Corporate gifting is a major vertical, but not the identity. WyshKit is the utility for *any* product that needs to be personal, fast.

**Customer acquisition**: Instagram/Meta hyperlocal ads to 25–40yo professionals in these pin codes. Zero generic ads. Every creative shows a real vendor, real product, real ETA.

**Vendor acquisition**: Direct BD to trophy shops, print studios, engraving shops. Pitch: *"You have the machine. We have the customers."* Zero commission on first 10 orders.

**Market position**: *"We are what Swiggy would be if they delivered personalised gifts instead of biryani."*

---

## Operational Guardrails

### Wallet Balance Display Rule
Wallet balance shown on home screen for logged-in users. Position: above Banner Bento. Format: "₹48 WyshKit Money — use today."

Hidden wallet = broken Hook Model. If the user can't see their balance, the Investment phase of the Hook cycle fails silently.

### Minimum Vendor Density
`platform_settings.min_vendor_density_per_zone` — ops alert if < 5 live vendors per 3km zone.

Below this threshold, delivery ETAs become unreliable and the hyperlocal promise breaks. Alert triggers Slack notification to BD team for that zone.
