# WyshKit 2026: DOCTRINE — The Strategy

> *"We are what Swiggy would be if they delivered trust instead of biryani."*

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

**The Preview Moat**: Once a customer sees their name engraved on a digital mockup and taps "Slide to Approve," the product is theirs. Return rate → ~0. Premium pricing justified. Vendor inventory protected. This is Fiverr's model applied to physical goods at Blinkit speeds.

**What we borrow from Swiggy** (Zero reinvention):
- SLA as the only unit of distance
- Hyperlocal node density model
- Cashback flywheel (Hook Model enforcement)
- One-tap ordering pattern
- Realtime status updates

**What we do NOT reinvent**:
- Auth → Supabase
- Delivery fleet → Shadowfax / Porter
- Payments → Razorpay
- Design system → shadcn/ui + Radix

---

## The 4 Business Laws

1. **Commitment Before Creativity** — Pay first, personalise after. Zero ghost orders. Zero unpaid vendor work.
2. **Time > Distance** — SLA is the only unit. "Arriving by 5:15 PM." Never "2.4 km away."
3. **Preview > Price** — A digital mockup before production is the moat. The customer approves it. The sale is then final.
4. **Density > Reach** — 50 vendors in 5km is a business. 50 vendors in 50km is a logistics nightmare. Win the neighbourhood before expanding.

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
- Max 6 variant chips visible; "Show more" collapses the rest.
- Max 8 categories in CIRCLE_RAIL.
- Single payment method: Razorpay. No COD. Ever.
- Personalisation schema: ≤3 fields per product.

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
| **Peak** (Preview Approval) | Full-bleed mockup, haptic on slide, instant animation. Not a plain button. |
| **End** (Delivery + Cashback) | Brief confetti (≤2s), large cashback credit display, "Share your gift" prompt. Not a plain toast. |

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
| Personalisation schema (text / image / select) | `personalization_schema` JSONB drives the form dynamically. |
| Commission tiers | `platform_settings` table. Vendor sees "Commission: 12%." |
| Coupon validation (min order, expiry, usage limit) | Atomic RPC. User taps "Apply" → sees green or red. |

### Von Restorff Effect — The Isolation Rule
If everything is highlighted, nothing is highlighted. One primary CTA per screen. One primary colour per screen. Everything else is muted.

### Weber's Law — Price Perception
₹30 delivery on a ₹200 order = painful (15%). Same ₹30 on ₹2000 = invisible (1.5%).
- Subsidize delivery on low-AOV orders.
- Minimum cashback floor: ₹10. Below that, round up. The variable reward must feel meaningful.

### Anti-Dark-Pattern Doctrine (Absolute)
| Dark Pattern | WyshKit Position |
|---|---|
| Confirmshaming | Decline CTAs say "No thanks." Never guilt-laden copy. |
| Hidden fees | Delivery fee visible on the product card chip. No surprises at payment. |
| Urgency theatre | "Only 3 left!" must reflect true `stock_quantity`. Never fabricated. |
| Forced continuity | No subscription tiers for customers. Zero. |
| Disguised ads | Promoted vendors carry a visible "Promoted" badge. Always. |
| Pre-checked opt-ins | All checkboxes unchecked by default. Always. |

---

## Messaging Playbook

### To Customers: Emotional → Transactional → Rational
- *"Forgot a birthday? Personalised gift before the party starts."*
- *"See a preview before we make it. Don't like it — instant refund."*
- *"Last-minute. Lifetime memory."*

| Use | Never Use |
|---|---|
| "personalised", "preview" | "customised", "mockup", "Design Hub" |
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

**Target moments**: Last-minute birthdays, forgotten anniversaries, festivals (Diwali, Valentine's, Mother's Day). Corporate gifting is Phase 2.

**Customer acquisition**: Instagram/Meta hyperlocal ads to 25–40yo professionals in these pin codes. Zero generic ads. Every creative shows a real vendor, real product, real ETA.

**Vendor acquisition**: Direct BD to trophy shops, print studios, engraving shops. Pitch: *"You have the machine. We have the customers."* Zero commission on first 10 orders.

**Market position**: *"We are what Swiggy would be if they delivered personalised gifts instead of biryani."*
