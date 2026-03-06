# WyshKit 2026: DOCTRINE — The Strategy

> *"Inventory + 10-minute service. Delivered at Swiggy speed."*

---

## ❌ WHAT WE'RE **NOT**
- **NOT** a gifting marketplace (gifting is just ONE category)
- **NOT** a customization platform (it's **personalisation**)
- **NOT** a custom design tool (no Canva-style builders)
- **NOT** quick commerce in the Blinkit/Zepto sense — we own **zero inventory, zero dark stores**. Vendors own the stock. WyshKit delivers.

## ✅ WHAT WE **ARE**
**"Swiggy for Products with Optional Personalization"**

Just like:
- Swiggy Food = Hyperlocal restaurant marketplace where restaurants provide food, Swiggy provides delivery
- **WyshKit = Hyperlocal product marketplace where vendors provide products (with optional personalization), WyshKit provides delivery**

---

## The Differentiation Problem (Research-Backed)

WyshKit is built on the **Swiggy 2026 substrate**: hyperlocal logistics, SLA discipline, neighbourhood density. But we are not a commodity delivery app.

| Feature | Traditional E-com | Quick Commerce (Instamart/Blinkit) | WyshKit |
|---|---|---|---|
| **Inventory** | Central Warehouse | Dark Stores (Owned/Managed) | **Local Brand Stores / Artisan Nodes** |
| **Logistics** | 2-Day Courier | 10-Min Fleet | **Local 3PL (WareIQ)** |
| **Selection** | Global SKU | Local Convenience SKU | **Local Inventory + Identity Layer** |
| **Logic** | Multi-Vendor Cart | Multi-Warehouse Cart | **One Vendor, One Cart (Point-to-Point)** |
| **Persona** | Bulk Gifting | Urgent Grocery | **Identity & Spontaneous High-Value** |
| **Trust mechanism** | Ratings, ETA | Standard SLA; + Preview Workflow for personalised orders |
| **Return risk** | Low (edible/consumable) | Low for plain products; high for personalised (engraved = unsellable without preview) |
| **Solution** | Standard delivery SLA | Standard SLA for all; **Preview Workflow** for personalised products |

> **On quick commerce**: WyshKit is NOT quick commerce in the ownership model (zero dark stores, zero inventory). However, like Instamart routing from a Decathlon outlet instead of a dark store, WyshKit IS in the same delivery speed category by using vendor stores as local fulfillment nodes. The difference: we are the marketplace, not the warehouse.

**The Preview Moat**: Once a customer sees their name engraved on a digital mockup and taps "Slide to Approve," the product is theirs. Return rate → ~0. Premium pricing justified.

---

### The Foundational Insight (2026)
WyshKit sits at the intersection of **Retail Inventory** and **Rider Networks**.

In 2026, brands like Apple, boAt, and Decathlon are turning their experience stores into Dark Stores to compete with 10-minute delivery apps. WyshKit is the **Marketplace Layer** for this shift. We provide the "Identity Layer" (Personalisation) on top of existing local stock.

**The Arbitrage**:
1.  **Inventory**: Already exists in the store (Apple Resellers, Trophy shops).
2.  **Logistics**: Already exists in the neighborhood (WareIQ).
3.  **WyshKit**: The interface that makes it reachable with a "Preview Moat".

### Personalization vs. Customization (The Apple Pattern)
The WyshKit mental model follows the **Apple Pattern**: **Inventory + Optional Identity Layer.**

- **Customization** = Changing the product itself (Making iPhone in pink, custom chip). **WyshKit does NOT do this.**
- **Personalization** = Adding identity to an existing product (Engraving "Rahul" on Space Grey AirPods). **THIS is what we optionally offer.**

Apple sells AirPods to everyone. Only some buyers add engraving. **An Apple Premium Reseller in Koramangala is a valid WyshKit vendor** — they hold AirPods stock, can engrave in ~10 minutes, and are within delivery range. WyshKit provides the demand, the order management, and the delivery. The APR provides the product and the service.

This is not a small-artisan-only model. It is any vendor — artisan or brand — with:
1. **Physical stock** they can dispatch today
2. A **location** within the serviceable zone
3. **Optional** personalisation capability

**The WyshKit Vendor Spectrum:**
```
ARTISAN END                                          BRAND END
✔ Local trophy shop + engraver                       ✔ Apple Premium Reseller (AirPods + engraving)
✔ Print studio with mugs/cases in stock              ✔ boAt experience zone (headphones + laser etching)
✔ Leather goods shop with stock                      ✔ Decathlon outlet (sports gear, in-store stock)
✔ Specialty gift shop (stock-first, no personalisation) ✔ Samsung brand store (phones + accessories)
❌ Engraver with zero stock → NOT a vendor            ❌ Online-only brand with no local stock → NOT a vendor
```

Personalisation is the **moat**, not the **minimum**. A vendor without stock is a freelancer. A vendor with local stock is a WyshKit node — whether they are a one-machine artisan or a brand experience store.

## The Supply-Side Convergence
The last-mile gap in India is not creativity — it's **discoverability and delivery**. There are Apple Resellers, boAt zones, and professional engravers within 3km of virtually every urban resident. WyshKit connects them to the Swiggy rails.

**The 2026 market convergence WyshKit is riding:**
- **Store-as-Dark-Store**: Brands are expanding experience-store footprints in Tier 1 India, creating dense local inventory nodes.
- **Personalisation at Scale**: Personalisation is now a brand-level feature (Apple, boAt, Nike).
- **WareIQ Logistics**: Neighbourhood-level 3PL is viable in 2026 without fleet ownership.

---

## The 4 Laws of WyshKit Product

> These are the **implementation rules** (the HOW). For the **product beliefs** (the WHY), see [PHILOSOPHY.md](./PHILOSOPHY.md).

1.  **One Vendor, One Cart (The Swiggy Food Corollary)**
    - You cannot mix products from different vendors in one order.
    - Why? Hyperlocal logistics is a point-to-point race. Stopping at two shops doubles ETA and rider friction.
    - Order 1: AirPods (Apple Store). Order 2: Trophy (Local Engraver). Parallel tracks.

2.  **Address Gravity (Zero-Ask UX)**
    - The app pre-resolves destination based on GPS/History.
    - Checkout starts with a serviceability check, not an address form.

3.  **Commitment Before Creativity (Pay First)**
    - Personalisation is a post-payment work loop.
    - We capture intent with money, then solve the "Identity Layer".

4.  **Preview > Production (The Legal Anchor)**
    - *(Personalised orders only)* A vendor cannot move an order to `PRODUCTION` until the customer explicitly approves the `PREVIEW`.
    - This digitizes trust. The render is the contract.

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

**WyshKit lever**: Loyalty sits at the bottom as the "Investment" in the Hook Model. We reward **frequency over volume**, building habit without the "Dark Pattern" of deep discounting.

---

## The 4W Decision Filter

Every product decision must pass the 4W test. If one W is missing, the feature is rejected.

1. **Win for Customer** — Faster delivery, higher quality personalisation, lower anxiety.
2. **Win for Vendor** — Higher margins, zero ghost orders, faster payouts, inventory protection.
3. **Win for Delivery Executive** — Predictable pickups, high-density zones, minimal dead miles.
4. **Win for WyshKit** — Healthy commission, zero inventory risk, defensible preview moat.

---

## Product Design Laws (Implementation-Backed)

> For full visual and interaction patterns (Spatial UI, Bento, Haptics), see [DESIGN.md](./DESIGN.md).

1. **High-Density, Low-Noise**: Maximize information per millimeter. If a user has to scroll to see the "Primary Action", the layout has failed.
2. **Spatial Modularization**: UI elements are floating "modules" with weight. They are not flat page sections.
3. **Skeleton Precision**: Skeletons must match the exact layout of the arriving JSON. Zero layout shift.
4. **Haptic Confirmation**: Every transactional intent must echo in the user's hand. No haptics = no trust.

### Hick's Law — Every Extra Choice is a Conversion Tax
- Max 4 variant groups, max 4 options per group.
- Max 8 categories in feed rail.
- Single payment method: Razorpay. No COD. Ever.
- Personalisation: single toggle on Product Sheet. Zero pre-payment typing.
- Personalisation requirements form: ≤3 fields per product, post-payment only.

### Fitts' Law — Tap Target Mandate
All interactive elements: minimum **44×44px** tap target. Primary actions (Add to Cart, Slide to Pay) are full-width, high-contrast, thumb-reachable.

### Doherty Threshold — 400ms Budget
Every user action must produce visual feedback within 400ms.

| Action | Target | How |
|---|---|---|
| Add to Cart | <100ms | Optimistic UI + haptic. RPC fires in background. |
| Slide to Pay | <200ms | Razorpay modal opens instantly. Order creation is async. |
| Search | <300ms | Debounced `search_products_atomic` RPC + skeleton. |
| Page nav | <400ms | Next.js prefetch + RSC streaming. No blank screens. |

### The Hook Model — Cashback as Repeat Engine
```
TRIGGER   → "Your award is ready for collection" / urgent product need
ACTION    → Open app → browse → add to cart (3 taps)
REWARD    → Delivered product + optional preview approval (emotionally resonant)
            + Cashback credit (variable %, feels like a bonus)
INVEST    → Saved address + review left + wallet balance
    ↓
INTERNAL TRIGGER → Next need → user opens WyshKit first
```
- Surface wallet balance on home: "₹48 WyshKit Money — use today."
- Hidden wallet = broken Hook.

### Anti-Dark-Pattern Doctrine (Absolute)
| Dark Pattern | WyshKit Position |
|---|---|
| Confirmshaming | **Forbidden**. Decline CTAs say "No thanks." |
| Hidden fees | **Forbidden**. Delivery fee visible on product card. No surprises at payment. |
| Cancellation | 100% fee after placement for personalised items. Stated clearly at pay-slide. |
| Return Window | 24 hours for damaged/incorrect physical items. On product sheet. |
| Mandatory Sign-up | **Forbidden**. Late-bind auth only. |
| Urgency theatre | "Only 3 left!" requires `stock_quantity <= 3 AND NOT NULL`. Never fabricated. |
| Forced continuity | No subscription tiers for customers. Zero. |
| Disguised ads | Promoted vendors carry visible "Promoted" badge. Always. |
| Pre-checked opt-ins | All checkboxes unchecked by default. Always. |
| `window.confirm()` | **Forbidden**. Inline styled double-confirm only. |
| Promotional push 10PM–8AM | **Forbidden**. DND window enforced in notification scheduler. |

### Customisation vs. Personalisation

| Term | Meaning | When | Where |
|---|---|---|---|
| **Customisation** | Selecting pre-defined options (Size/Color) | Before payment | Product Sheet |
| **Personalisation Add-on** | Toggling the service (e.g. "Add engraving +₹X") | Before payment | Product Sheet |
| **Personalisation Details** | Submitting text/image/name | After payment | Order Tracking |
| **Personalisation Preview** | Seeing the digital render | After payment | Order Tracking |
| **Personalisation Approval** | Tapping "Slide to Approve" | After payment | Order Tracking |

---

## Messaging Playbook

### To Customers: Practical → Personal → Fast

> **Rule**: Lead with the product or the moment, not the word "gift". Not every WyshKit order is a gift. A trophy, a nameplate, a corporate award, a personalised notebook — these are products with identity. Lead with that.

| Occasion | Copy |
|---|---|
| Last-minute occasion | *"Your product, personalised, before [time]."* |
| Corporate | *"50 branded awards. Delivered to your office by 6 PM."* |
| Personal keepsake | *"Your name. Their memory. 40 minutes."* |
| Generic | *"Local products. Optional personalisation. Delivered fast."* |

- *"See a preview before we make it. Don't like it — instant refund."*
- *"Arriving by 5:15 PM. Not '2.4 km away.'"*

| Use | Never Use |
|---|---|
| "personalised", "personalisation", "preview", "product" | "gift", "customised", "mockup", "Design Hub", "builder" |
| "by 5:15 PM", "~40 min" | "2.4 km away", "distance" |
| "local vendor", "local shop" | "platform", "marketplace", "e-commerce" |

> **Why not "gift"?** Because gifting is ONE use case. A customer ordering a crystal award for their office wall is not "gifting". A customer ordering a leather nameplate is not "gifting". Framing everything as gifting is an identity error that narrows the addressable market.

### To Vendors: Clear ROI, Zero Jargon
- *"Every order you receive is already paid. 100%. No ghost orders."*
- *"We bring the customer. You provide the product — and if you offer personalisation, you do the 5-minute work. Rider picks up. You get paid."*
- *"Once the customer approves your preview, the sale is final. No returns."*
- *"You already have the stock. You already have the skill. WyshKit just brings the order."*

| Use | Never Use |
|---|---|
| "orders", "your shop", "earnings", "your products" | "vendor panel", "dashboard", "merchant", "gifting" |

---

## GTM: Phase 1 — Bengaluru

**Target zones**: Koramangala, Indiranagar, HSR Layout, Jayanagar, Whitefield.

**Target use cases (in order of strategic priority)**:
- **Identity**: Nameplates, trophies, personal keepsakes, heritage items, sports awards — products where the owner's name is the value.
- **Corporate**: Employee recognition kits, speaker mementos, branded event merchandise, office awards — B2B repeat orders with high AOV.
- **Occasions**: Last-minute products for birthdays, festivals, and personal milestones — high-urgency, high-conviction buyers.

Corporate orders are a major vertical, but not the identity. WyshKit is the utility for *any* product that benefits from being local, fast, and optionally personal.

**Customer acquisition**: Instagram/Meta hyperlocal ads to 25–40yo professionals in these pin codes. Zero generic ads. Every creative shows a real vendor, real product, real ETA.

**Vendor acquisition — two BD tracks:**

**Track A — Artisan & Local Shop BD** (immediate pipeline):
Direct BD to trophy shops, print studios, embroidery workshops, leather goods shops, specialty gift stores.
Pitch: *"You have the stock. You have the skill. We have the customers. First 10 orders: zero commission."*

**Track B — Brand Partnership BD** (parallel, higher AOV):
Partner with Apple Premium Resellers, boAt experience zones, organised retail outlets (Decathlon, Nykaa, Chroma) that hold local stock.
Pitch: *"Your store becomes a 40-minute delivery node. We bring the orders. Your staff handles fulfillment. We handle the last mile."*

> **Vendor Qualifier (both tracks)**: Physical stock that can be dispatched today + within serviceable zone. Personalisation is optional. An online-only brand with no local stock does not qualify.

**Market position**: *"We are what Swiggy would be if they delivered local products — with optional personalisation — instead of biryani."*

---

## Operational Guardrails

### Wallet Balance Display Rule
Wallet balance shown on home screen for logged-in users. Position: above Banner Bento. Format: "₹48 WyshKit Money — use today."

Hidden wallet = broken Hook Model. If the user can't see their balance, the Investment phase of the Hook cycle fails silently.

### Minimum Vendor Density
`platform_settings.min_vendor_density_per_zone` — ops alert if < 5 live vendors per 3km zone.

Below this threshold, delivery ETAs become unreliable and the hyperlocal promise breaks. Alert triggers Slack notification to BD team for that zone.
