# WyshKit 2026: Principles & Mental Models

> *"We don't invent. We borrow only the best."*

All principles below are borrowed from the academy, Swiggy, Stripe, Zepto, Uber, and Nir Eyal. 
Zero reinvention. Every principle has a concrete WyshKit implementation note.

---

## 🧠 COGNITIVE LOAD & DECISION ARCHITECTURE

### Hick's Law (W.E. Hick, 1952)
> *Decision time grows logarithmically with the number of choices.*

**The Rule**: The more options, the longer it takes to decide. Every extra option has a conversion cost.

| ❌ Violation | ✅ WyshKit Application |
|---|---|
| 50 product variants on one sheet | Max 6 variant chips visible; "Show more" collapsed |
| All categories visible on home | CIRCLE_RAIL: max 8 categories above fold |
| 4 payment methods at checkout | One method: Razorpay. Zero choice. No COD. |
| Long personalisation input forms | Personalisation schema: ≤3 fields per product |

**Implementation Law**: If a screen has more than 5 primary choices, it's broken. Fix it with Progressive Disclosure.

---

### Miller's Law (George A. Miller, 1956)
> *Working memory holds 7±2 chunks of information at once.*

Already documented in SWIGGY_2026_ENGINEERING_CONVENTIONS.md. Enforced via Progressive Disclosure.

---

### The Paradox of Choice (Barry Schwartz, 2004)
> *More choice → more anxiety → lower satisfaction → lower conversion.*

**WyshKit's answer**: Neighbourhood curation model — 50–100 SKUs per area. Not 10,000 pan-India SKUs.
The constraint *is* the product differentiator. A curated local shortlist beats a global marketplace list.

**Never say**: "We'll add more products to improve conversion." 
**Always say**: "We'll curate better products to improve conversion."

---

### Dual Process Theory — System 1 vs System 2 (Daniel Kahneman, 2011)
> *System 1: fast, emotional, automatic. System 2: slow, deliberate, rational.*

WyshKit is a System 1 product purchased by System 1 triggers.

| System 1 Triggers (Lean into these) | System 2 Friction (Minimise these) |
|---|---|
| "Forgot anniversary" panic at 4 PM | Registration walls before browsing |
| "That glass looks beautiful" impulse | Calculating personalisation cost manually |
| "Arriving in 45 mins" urgency signal | Reading T&Cs before ordering |
| Haptic feedback on payment success | Account creation forms |

**Copy rule**: Emotional → transactional → rational. In that order. Never start with a spec.

---

## 🔁 HABIT & ENGAGEMENT

### Nir Eyal's Hook Model (2014)
> *Trigger → Action → Variable Reward → Investment. Repeat.*

WyshKit's Hook Loop is the **Cashback Flywheel**, but it must be instrumented as a full Hook:

```
TRIGGER (External):  "Festival coming up" notification + Instagram ad
   ↓
ACTION:              Open app → browse → add to cart (low friction, 3 taps)
   ↓
VARIABLE REWARD:     Preview mockup quality (unpredictable, emotionally resonant)
                     Cashback amount (varies: 2–5%)
   ↓  
INVESTMENT:          Saved address + review left + wallet balance accumulated
   ↓
TRIGGER (Internal):  Next anniversary → user "remembers" WyshKit without prompt
```

**Implementation Requirement**: 
- `wallet_transactions` must be prominently surfaced post-delivery (not buried)
- The success moment ("Your preview is ready!") is the Variable Reward. Make it feel special. Not a plain toast.
- Earned wallet balance = the Investment. Show it prominently on home ("₹48 WyshKit Money — use today")

---

### The Zeigarnik Effect (Bluma Zeigarnik, 1927)
> *People remember and are drawn back to incomplete tasks more than completed ones.*

**Application**: The "Active Order" card on the home screen exists precisely for this reason.
An in-flight order creates psychological open loops that pull the user back to the app.

**Implementation Rules**:
- A user with an active order MUST see the order status widget at the top of the home feed (above the banner bento). This is non-negotiable.
- Status language must be conversational and unresolved-feeling: "Your vendor is working on the preview…" not "Status: DETAILS_RECEIVED"
- Never auto-dismiss the success overlay at payment — let the user tap to continue. They want to linger.

---

### The Peak-End Rule (Kahneman, 1993)
> *People judge an experience by its most intense moment (peak) and how it ends — not the average.*

**WyshKit's Peak**: `Slide to Approve` — the digital preview approval. This is the emotional climax of the product experience.
**WyshKit's End**: The delivery confirmation + cashback credit. This is the experience's final memory.

**Implications for both**:

| Moment | Current | Required |
|---|---|---|
| **Peak** (Preview Approval) | "Slide to Approve" button | Full-bleed mockup image, haptic on slide, instant status update animation |
| **End** (Delivery) | Toast notification | Confetti micro-animation (brief, ≤2s), large cashback credit display, "Share your gift" prompt |

**Never show a generic "Order Delivered" push only.** The end matters. Make it memorable.

---

## 🎨 VISUAL DESIGN LAWS

### Fitts' Law (Paul Fitts, 1954)
Already documented. Primary actions are large, high-contrast, thumb-friendly.

---

### Gestalt Laws (Wertheimer, Köhler, Koffka, 1920s)
> *The human eye groups visual elements. Design with the groups, not against them.*

| Law | WyshKit Application |
|---|---|
| **Proximity** | Cart item + quantity stepper + line total must be tightly grouped. If they appear separated, users miss the controls. |
| **Similarity** | All "primary CTA" buttons must share the same colour, radius, and weight across the entire app. No exceptions. |
| **Continuity** | Horizontal scroll rails (categories, vendor chips) signal "swipe for more." Never mix horizontal and vertical scroll in the same rail. |
| **Figure-Ground** | Product sheet overlay must dim the background (0.6 opacity black). This signals "you are in a sub-context." |
| **Closure** | Humans prefer seeing the complete picture over fragments. Single-page checkout: Address → Bill → Payment → [Pay] — all visible on one page. User sees the complete journey = reduced anxiety. Multi-step wizards (Step 1 → 2 → ???) violate this — the user can't see the end, feels uncertain. Progress indicators help, but **showing everything at once** eliminates the problem entirely. WyshKit checkout is a single scrollable page, not a wizard. |

---

### The Law of Aesthetic-Usability Effect (Masaaki Kurosu, 1995)
> *Attractive interfaces are perceived as more usable, even when they're not.*

**WyshKit standard**: A visually premium product justifies premium pricing. If the UI looks like a WhatsApp forward,
₹600 for a glass feels expensive. If the UI looks like Zomato + Apple, ₹600 feels reasonable.

**Rule**: Every screen must pass "Would a VC forward a screenshot of this?" test before shipping.

---

### Von Restorff Effect — The Isolation Effect (Hedwig von Restorff, 1933)
> *Among a group of similar items, the one that differs most is best remembered.*

| Where It Applies | WyshKit Implementation |
|---|---|
| Home feed | The "Promoted" vendor card has a subtle gold border + badge. It looks *slightly different* from organic cards — enough to catch the eye, not enough to feel like an ad. |
| Checkout bill | The **discount line** is green while all other lines are neutral zinc. The savings stand out. |
| Order tracking | The **current status step** is highlighted with brand colour + pulse dot while past/future steps are muted. |
| CTA buttons | Only ONE button per screen is the primary colour. Everything else is secondary (outlined or muted). |

**Rule**: If everything is highlighted, nothing is highlighted. Isolate the ONE thing the user must notice.

---

### Doherty Threshold (Walter J. Doherty & Ahrvind J. Thadani, 1982)
> *Productivity soars when system response time is under 400ms. Users enter a "flow state" and perceive the system as instantaneous.*

**WyshKit Standard**: Every user-initiated action must provide visual feedback within 400ms.

| Action | Target Response | How |
|---|---|---|
| Add to Cart tap | <100ms | Optimistic UI update + haptic. RPC fires in background. |
| Slide to Pay release | <200ms | Razorpay modal opens immediately. Order creation is async. |
| Search keystroke | <300ms | Debounced `search_products_atomic` RPC. Show skeleton during load. |
| Page navigation | <400ms | Next.js prefetching + RSC streaming. No blank white screens. |

**Rule**: If the user can perceive a delay, add a skeleton or animation. Never show a blank void.

---

### Jakob's Law (Jakob Nielsen, 2000)
> *Users spend most of their time on **other** apps. They prefer your app to work the same way as all the others they already know.*

**WyshKit Application**: We don't invent interaction patterns. We borrow from Swiggy, Zomato, and Blinkit — the apps our users open 10× more than ours.

| Pattern | Borrowed From | WyshKit Implementation |
|---|---|---|
| Bottom sheet for product detail | Swiggy/Zomato | Product sheet slides up from bottom, swipe-down to dismiss |
| Slide-to-pay gesture | Swiggy/Uber | Horizontal slider with haptic confirmation |
| Pull-to-refresh | iOS/Android system | All feed pages support native pull-to-refresh via `router.refresh()` |
| Floating cart button | Swiggy/Blinkit | Bottom-right cart FAB with item count badge |
| Order tracking timeline | Swiggy/Amazon | Vertical stepper with completed/active/pending states |

**Rule**: If a user has to *learn* an interaction, it's wrong. The best UX is invisible because it's already muscle memory.

---

### Tesler's Law — The Law of Conservation of Complexity (Larry Tesler, 1984)
> *Every system has irreducible complexity. The question is who bears it — the user or the system.*

**WyshKit Doctrine**: The system bears ALL complexity. The user sees only decisions.

| Complexity | Who Bears It |
|---|---|
| GST calculation (5%/12%/18%/28% per HSN code) | Postgres `calculate_order_total` RPC. User sees one line: "GST: ₹XX" |
| Delivery fee (distance-based, vendor-specific, minimum order override) | Postgres. User sees: "Delivery: ₹30" or "FREE" |
| Personalization schema (text vs image vs multi-field) | Product's `personalization_schema` JSONB drives a dynamic form. User fills fields, doesn't think about schema. |
| Vendor tier commission rates | `platform_settings` table. Vendor sees "Commission: 12%" — never calculates it. |
| Coupon validation (min order, expiry, usage limit, vendor-specific) | Atomic RPC. User taps "Apply" → sees green/red. No manual checks. |

**Rule**: If the user is calculating, we've failed. Zero Shadow Math is Tesler's Law applied to commerce.

---

### Postel's Law — The Robustness Principle (Jon Postel, 1980)
> *Be conservative in what you send, be liberal in what you accept.*

**WyshKit Application**: Accept messy input, return clean output.

| Input | Liberal Accept | Conservative Send |
|---|---|---|
| Phone number | `+91 98765 43210`, `09876543210`, `9876543210` → all accepted | Always store as `9876543210` (10 digits, no prefix) |
| GSTIN | `29AADCW1234F1ZA` or `29aadcw1234f1za` → uppercase normalize | Always return uppercase |
| Search query | `"laser glass"`, `"lazer glas"`, `"LASER GLASS"` → FTS with websearch handles all | Return properly cased product names |
| Delivery instructions | Free text, emojis, presets, combinations → all accepted | Store as-is, display as-is |

**Rule**: Never reject user input for formatting reasons. Normalize silently.

---

### Serial Position Effect (Hermann Ebbinghaus, 1885)
> *People best remember the first (primacy) and last (recency) items in a list. The middle is forgotten.*

**WyshKit Application**:

| List | First Item (Primacy) | Last Item (Recency) | Middle |
|---|---|---|---|
| Home feed | **Best-selling or promoted** vendor | **"Explore More" CTA** to discovery | Standard organic results |
| Checkout bill | **Products subtotal** (what you're buying) | **Total to pay** (what you owe) | Fees, taxes, discounts (important but secondary) |
| Order tracking timeline | **"Order Placed" with timestamp** | **Current status with ETA** | Intermediate states (Confirmed, In Production) |
| Category rail | **"All" or "For You"** | **"More →" button** | Category chips (browsing) |

**Rule**: Put the most important thing FIRST. Put the CTA or summary LAST. The middle is for details.

---

### Weber's Law (Ernst Heinrich Weber, 1834)
> *The just-noticeable difference (JND) between two stimuli is proportional to the magnitude of the stimuli.*

**WyshKit Application**: Price perception.
- On a ₹200 product, ₹30 delivery feels steep (15%). On a ₹2000 product, ₹30 feels negligible (1.5%).
- **Rule**: For low-AOV orders, subsidize or waive delivery. For high-AOV, delivery fee is invisible.
- **Cashback perception**: 5% cashback on ₹500 = ₹25. Feels good. 2% on ₹200 = ₹4. Feels pointless.
- **Rule**: Minimum cashback floor: ₹10. Below that, round up. The Hook Model's variable reward must feel meaningful.

**Implementation**: `platform_settings.min_cashback_amount` governs this. Never hardcoded.

---

## ⚡ CONVERSION & BEHAVIOUR

### BJ Fogg's Behavior Model (2009)
> *Behavior = Motivation × Ability × Prompt. All three must be present simultaneously.*

```
B = M × A × P
  = Motivation (emotional need: gift urgency)
  × Ability (low friction: 3-tap order)
  × Prompt (trigger: right time, right channel)
```

**WyshKit Conversion Leaks**:
- **Low Motivation**: If the home feed shows irrelevant products (wrong neighbourhood), motivation drops. → Location must be resolved before products are shown.
- **Missing Prompt**: Push notifications must be sent at the right moment (anniversary morning, not midnight). → Notification timing is a product decision, not an infra decision.

**The "Healthy Friction" Addition**:
> *Sometimes, slowing down the user is the best UX.*
- **WyshKit Note**: The **"Slide to Pay"** button (borrowed from Swiggy/Stripe) adds healthy friction to prevent accidental 1-tap orders while maintaining a high-quality feel. It forces a deliberate physical gesture before a financial commitment.

---

## 🚀 HYPERLOCAL BUSINESS LAWS (The Swiggy 2026 Playbook)

### The Law of Locality (Density > Reach)
> *Winning a neighbourhood is better than losing a city.*
- **Principle**: Hyperlocal success is a function of node density, not geographic reach. 
- **The Rule**: 50 vendors in 5km is a business; 50 vendors in 50km is a logistics nightmare.
- **WyshKit Application**: We prioritize depth (SKUs per vendor) and density (vendors per pin code) over expanding to new cities prematurely.

### The 4W Framework (The Win-Win-Win-Win)
Every product decision must pass the 4W test:
1. **Win for Customer**: Faster delivery, higher quality personalization.
2. **Win for Vendor**: Higher margins, zero ghost orders, faster payouts.
3. **Win for Rider**: Predictable pickups, high density of orders in one zone.
4. **Win for WyshKit**: Healthy commission, zero inventory risk, brand moat.
*If one W is missing, the feature is rejected.*

### The Hyperlocal Growth Flywheel
```
More Demand 
  → More Vendors 
    → Higher Node Density 
      → Lower Delivery Time (Rider Efficiency)
        → Higher Customer Satisfaction
          → More Demand (Repeat)
```
- **WyshKit Lever**: Cashback credited post-delivery (`Investment` in Hook model) accelerates the "More Demand" phase of the flywheel.

### Commitment & Consistency Bias (Cialdini, 1984)
> *People follow through on commitments, especially public ones.*

**Application**: "Commitment Before Creativity" isn't just about avoiding ghost orders.
It's a psychological design: once a user pays ₹600, their System 2 kicks in to justify the choice.
They will engage with the personalisation form. They will not abandon mid-flow.

Payment is the commitment anchor. Everything after is consistency behaviour.

---

## 🛡️ ANTI-DARK-PATTERN DOCTRINE (Non-Negotiable)

We do not use dark patterns. Ever. Not even the "acceptable" ones.

| Dark Pattern | Why Tempting | WyshKit Ban |
|---|---|---|
| Roach Motel | Easy to subscribe, hard to cancel | No subscriptions exist. Wallet credited by system only. |
| Confirmshaming | "No thanks, I hate saving money" | Decline CTAs always say "No thanks" — never guilt-laden copy. |
| Hidden fees | Reveal delivery fee at final step | Delivery fee shown in product card ETA chip. No surprises at checkout. |
| Urgency theatre | "Only 3 left!" when inventory is infinite | Stock warnings must reflect true DB stock_quantity. Never fabricated. |
| Forced continuity | Auto-enroll in paid tier | No subscription tiers for customers. Zero. |
| Disguised ads | Promoted vendors look organic | Promoted vendors carry a visible "Promoted" badge. Always. |
| Trick questions | Pre-checked newsletter opt-in | All opt-in checkboxes unchecked by default. Always. |

---

## 🔄 ZERO-STATE UX (New User Experience)

Every screen must be designed for the zero-state: a new user with no history, no cart, no addresses.

| Screen | Zero State Design |
|---|---|
| Home feed | Location prompt → show products after resolution. Never show empty grid. |
| Cart | "Your cart is empty. Find a gift →" with a single CTA to home feed. |
| Orders page | "No orders yet. Your first gift is waiting →" |
| Wallet | "Complete your first order to earn WyshKit Money" (hidden if balance = 0 and no history) |
| Vendor reviews | "Be the first to review this vendor" with star-select UI visible |

**The Golden State Rule**: Zero state is a marketing moment, not an error state. Never show a blank page.

---

## 🚨 ERROR RECOVERY DOCTRINE (Stripe Standard)

### Structured Error Codes
Every API error returned to the frontend must be a structured error code, NOT a raw database error string.

```typescript
// ❌ Wrong: leaks DB internals, unactionable
{ success: false, error: "duplicate key value violates unique constraint orders_razorpay_order_id_key" }

// ✅ Right: machine-readable, human-friendly
{ success: false, error: "ORDER_ALREADY_EXISTS", message: "This order was already placed", order_id: "..." }
```

| Error Code | Description | User Action |
|---|---|---|
| `ORDER_ALREADY_EXISTS` | Idempotency hit | Return existing order silently |
| `VENDOR_OFFLINE` | Vendor closed | Show: "This vendor is currently closed. Try again later." |
| `VENDOR_MISMATCH` | Multi-vendor cart attempt | Show: Cart Switch Sheet |
| `INSUFFICIENT_STOCK` | Stock depleted mid-order | Show: "Sorry, [Product] just sold out." |
| `ADDRESS_NOT_FOUND` | Address deleted | Prompt: address picker |
| `COUPON_INVALID` | Expired/wrong coupon | Show: "This code isn't valid" inline |
| `PAYMENT_UNAUTHORIZED` | Auth failed | DO NOT retry auto. Show error, let user retry. |
| `PRODUCT_UNAVAILABLE` | Product pulled | Show: "This product is no longer available." |

### Razorpay Failure Recovery
1. Payment modal dismissed by user → **No order created** (idempotency key not consumed). Safe to retry.
2. Payment succeeded, webhook delayed → App polls `/api/orders/pending` endpoint for 30s, then shows "Payment received — processing your order." splash.
3. Webhook arrives late → `place_atomic_order` idempotency check catches duplicate. Returns existing order. No double charge.

### 3PL API Failure Recovery
When Shadowfax/Porter API is unavailable at `PACKED` → `SHIPPED`:
- Do NOT block the vendor from packing.
- Queue the rider assignment request with exponential backoff (1s, 2s, 4s).
- If 3 retries fail: alert ops channel (Slack/internal) + notify vendor to call helpline.
- Never block the order lifecycle on 3PL availability. Decouple.

---

## 📐 CONTENT STRATEGY LAWS

### Jobs-to-be-Done Theory (Clayton Christensen)
Already documented in README.md. Sell the outcome, not the feature.

### The Pyramid Principle (Barbara Minto, McKinsey)
> *Lead with the answer. Then support it.*

Applied to all copy: CTA first, explanation second.
- ✅ "Order by 4 PM → Get it by 7 PM [details]"
- ❌ "Our flagship personalisation studio in Koramangala offers same-day delivery for most products."

---

## ⚡ HYPERLOCAL OPERATIONAL MODELS

### The "Inventory + 10-Minute Service" Model
> *Personalization is not manufacturing; it is a service applied to stock.*

**The Industry Error**: Treating personalized products as **custom manufacturing**. This creates a mental model of "Slow, Centralized, Expensive."

**The WyshKit Reality**: Personalization is an **edge service** (laser engraving, digital transfer, embroidery) on **instantly available local inventory**. 
- **Stock**: Blank high-quality items kept at vendor nodes.
- **Service**: 10-minute operation post-payment.
- **Velocity**: Same-hour delivery (Swiggy/Blinkit speeds).

| Feature | Custom Manufacturing (❌) | Inventory + 10m Service (✅) |
|---|---|---|
| **Inventory** | Build-to-order | Stocked-on-shelf (Blanks) |
| **Logistics** | Central Factory → Courier | Local Hub → Hyperlocal Rider |
| **Lead Time** | 3–7 Days | 45 Minutes |
| **Price** | Premium (In-situ) | Standard + Service Fee |

---

---

## � ONBOARDING & TRUST

### The "Extraction-First" Principle (The IDFC First Pattern)
> *Friction is a choice. Ask for documents, not data.*

**The Doctrine**: Manual data entry is the #1 drop-off point for vendors.
- **Rule**: Upload document → Extract via OCR (IDfy) → Pre-fill form → Vendor Corrects.
- **Mental Model**: The vendor is a "Verifier" of data, not an "Inputter" of data.
- **Implementation**: `executeVendorIntent` (SUBMIT_KYC) accepts raw extraction JSON and pre-fills the vendor profile.

---

## 🛠️ RECOVERY UX (The Swiggy/Stripe Resilience Standard)

### Anti-Fragile Recovery (The "Salvation" Model)
> *The brand is not defined by the order that went right, but by the recovery of the order that went wrong.*

**The Principle**: In hyperlocal, things *will* break (riders cancel, machines jam, rains start).
- **Rule 1: Proactive Transparency**: If the SLA is breached, tell the user *before* they ask.
- **Rule 2: The "Gift Salvation" Alternative**: If a vendor fails to upload a preview on time, offer an instant shift to a nearby vendor who *already has* the stock.

| Scenario | Standard UX (❌) | Recovery UX (✅) |
|---|---|---|
| Rider Cancelled | "Looking for new rider..." | "Rider changed. No action needed. We're still on track for 5:15 PM." |
| Vendor SLA Breach | "Order delayed." | "Vendor is running slow. Tap here to move your order to [Nearby Vendor] + get ₹50 credit." |
| Payment Failed | "Transaction failed." | "Razorpay had a hiccup. Your cart is saved. Tap to try again with UPI." |

**Implementation Requirement**: `transition_order` must trigger automated "SLA Breach" tokens that the frontend can use to show recovery CTAs.

---

## 📐 VENDOR TIER ARCHITECTURE (Lived Model)

The `vendor_tier` column exists. Here's the canonical model:

| Tier | Name | Requirements | Benefits |
|---|---|---|---|
| 0 | **Onboarding** | KYC submitted, not verified | Visible to ops only. Zero orders. |
| 1 | **Active** | KYC verified, first order done | Listed publicly. Standard commission rate. |
| 2 | **Trusted** | 50+ orders, ≥4.0 rating | Priority in feed ranking. Reduced commission. |
| 3 | **Elite** | 200+ orders, ≥4.5 rating, SLA ≤5% breach | "Elite Vendor" badge. Top feed position. Promotional support. |

**Commission Structure** (stored in `platform_settings`, never hardcoded):
- Default: 15% of order subtotal (excl. delivery fee)
- Tier 2 discount: 12%
- Tier 3 discount: 10%
- First 10 orders: 0% (acquisition incentive)

---

## 🎨 SHADCN & DESIGN SYSTEM PURITY

### 1. The Shadcn Directive (Composition Over Customisation)
> *Shadcn is a starting point, not a dependency.*

- **Rule**: Never modify `src/components/ui/` files unless it's to fix a multi-theme accessibility issue.
- **Implementation**: Wrap Shadcn primitives in `ResponsiveSurface` or local feature components.
- **Purity**: Avoid "Component Bloat". If a primitive doesn't exist (e.g., a "Swipeable Card"), build it from Radix primitives directly, following Shadcn's visual language.

### 2. Mobile-First & The 44px Law
> *Desktop is just a wide mobile.*

- **Rule**: Every interactive element (Button, Input, Toggle) MUST have a minimum tap target of **44×44px** on mobile.
- **Responsive Logic**: 
  - Mobile (<640px): Full-bleed sheets, bottom-sticky CTAs, 16px horizontal safe areas.
  - Desktop (>1024px): Max-width containers (e.g., `max-w-md` for checkout), hover-states, keyboard shortcuts.
- **Typography**: Sub-14px text is prohibited for primary content. Minimum body: 16px.

### 3. Glassmorphism & Elevation
- Use `backdrop-blur` for sheets and overlays to maintain spatial context.
- Elevation is defined by **Money Density**: Higher monetary impact = higher visual shadow/blur.

---
