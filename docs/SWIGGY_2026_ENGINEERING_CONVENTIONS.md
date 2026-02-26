# Swiggy 2026: Engineering Conventions & Principles

This document formalizes the "Swiggy 2026" engineering culture. These are not suggestions; they are the laws of the Wyshkit kernel.

## 🧠 Mental Models

### 1. The Swiggy Equation
`WyshKit = [Swiggy Food Logistics] + [Instamart Product Catalog] + [Personalization Workflow]`
- **Logistics**: Time > Distance. SLA-driven. Never show km. Always show "Arriving by 5:15 PM".
- **Catalog**: Physical hard goods. Neighbourhood curation (50-100 SKUs). Depth over breadth.
- **Workflow**: Preview Trust Moat. Liability shift on approval. Production Time = Cooking Time.

### 2. Miller's Law (7±2 Rule)
Limit cognitive load. Never show more than 7 primary navigation or action items in a single view. Reveal complexity via **Progressive Disclosure**.

### 3. Fitts' Law (Tap Targets)
Primary actions (e.g., `Slide to Pay`, `Add to Cart`) must be large, high-contrast, and positioned for thumb-reach on mobile. Min touch target: 44×44px.

### 4. Hick's Law (Decision Time)
Decision time grows logarithmically with the number of choices. **Every extra option is a conversion tax.**
- Max 6 variant chips visible above fold (collapse rest)
- Max 8 categories in CIRCLE_RAIL
- Single payment method (Razorpay). Zero friction. No COD.
- Personalisation schema: ≤3 fields per product

### 5. Nir Eyal's Hook Model (Habit Formation)
`Trigger → Action → Variable Reward → Investment`
- The cashback flywheel IS the Hook. The preview mockup IS the variable reward.
- Surface wallet balance prominently after every delivery. It IS the investment.
- See `docs/PRINCIPLES_AND_MENTAL_MODELS.md` for full implementation.

### 6. Peak-End Rule (Kahneman)
Users remember experiences by their peak (most intense moment) and their end.
- **Peak** = Preview approval (`Slide to Approve`). Make it emotionally resonant.
- **End** = Delivery + cashback credit. Confetti (≤2s). Large cashback display. Not a plain toast.

### 7. Zeigarnik Effect (Open Loops)
Active orders MUST appear at the top of the home feed (above banner bento).
They create psychological pull. Never de-prioritise the active order widget.

### 8. Recovery UX (The Salvation Model)
In hyperlocal, failures are inevitable. Recovery is the product.
- **Rule**: If a primary path fails (Rider fail, Vendor breach), proactively offer an "SLA Salvation" (Credit + Auto-shift).
- **Goal**: Turn an error into an investment moment.

### 9. Anticipatory Design (Pre-Emptive UX)
Elite products eliminate typing by predicting intent.
- **Rule**: Provide "One-Tap Presets" for high-frequency instructions (e.g., "Gate Drop", "Silence Mode").
- **Goal**: Reduce cognitive load from "Input" to "Confirmation".

### 10. Von Restorff Effect (Isolation)
The different thing is the remembered thing. Only ONE element per screen gets the primary highlight (colour, size, animation). Everything else is muted. If everything screams, nothing is heard.

### 11. Doherty Threshold (400ms Budget)
Every user action must produce visual feedback within 400ms. Below that, users enter flow. Above that, they notice lag.
- **Enforcement**: 
  - All page transitions MUST show skeletons within 200ms.
  - All mutations MUST use Optimistic UI (e.g., cart quantity updates instantly, RPC confirms in background).
  - Every transactional intent MUST trigger Haptic Feedback (Resonance).

### 12. Jakob's Law (Familiarity)
Borrow interaction patterns from Swiggy, Zomato, Blinkit — apps our users already know. Bottom sheets, slide-to-pay, vertical steppers, floating cart. Zero invention of new gestures.

### 13. Tesler's Law (Complexity Absorption)
The system bears ALL irreducible complexity. GST, delivery fees, commissions, coupon validation — all computed in the Postgres kernel. The user sees only the result. Zero Shadow Math is Tesler's Law applied to commerce.

### 14. Postel's Law (Robustness)
Be liberal in what you accept (messy phone numbers, mixed-case GSTIN), conservative in what you store (normalized, clean). Never reject input for formatting.

### 15. Serial Position Effect (First & Last)
In any list, the first and last items are remembered. Put the best product first, the CTA last. The middle is for details the user scans, not memorizes.

### 16. Weber's Law (Price Perception)
₹30 delivery on ₹200 order = painful (15%). Same ₹30 on ₹2000 = invisible (1.5%). Subsidize delivery on low-AOV. Set a minimum cashback floor (₹10) so the variable reward always feels meaningful.

### 17. Gestalt Closure (Complete Picture Checkout)
Humans prefer the complete picture over fragments. WyshKit checkout is a **single scrollable page** (Address → Bill → Payment → [Slide to Pay]), NOT a multi-step wizard. The user sees the entire journey = reduced anxiety = higher conversion.

See `docs/PRINCIPLES_AND_MENTAL_MODELS.md` for full implementation tables.

## ⚖️ The Laws of 2026 (Canonical)

1.  **The Law of Zero Shadow Math**: All commerce arithmetic (GST, platform fees, delivery) is the exclusive domain of the Postgres kernel. Frontend math is prohibited.
2.  **The Law of Atomic Intent**: Every user decision (Address select, Coupon apply) must be a single, transactional RPC trip. No "Shadow Sessions".
3.  **The Law of Perpetual State Purity**: The UI is a stateless projection of the database. Hydration barriers must enforce that the first render is always the "Authored Source".
4.  **The Law of Flush Symmetry**: Borders and headers are one surface. No padding leakage. No "Drawer-within-a-Drawer" artifacts.
5.  **The Law of Healthy Friction**: Digital commitment (Slide to Pay) creates physical value. Friction is only a bug if it blocks the decision; it is a feature if it validates the intent.
6.  **The Law of Visual Gravity**: Surfaces that contain money (Wallets, Bill) must have higher visual elevation (Shadows/Borders) than static information.
7.  **The Law of Haptic Resonance**: Every transactional intent (Confirm, Toggle, Slide) must echo in the physical hand. No vibration, no transaction.

## 🛠️ Hard Engineering Rules

1. **Zero Shadow Math**: The database is the only computer. Frontend is only for display. If you are calculating a total or an ETA in TypeScript, you have failed.
2. **Atomic RPC First**: One user intent = One RPC. No multi-trip mutations.
3. **Commitment Before Creativity**: Payment first, personalization second. This eliminates ghost orders and protects vendor bandwidth.
4. **The Liability Shift**: No physical item is touched until the customer "Slides to Approve" the digital mockup. Once `liability_shifted_at` is set, the item is non-refundable.
5. **SECURITY DEFINER + explicit search_path**: Every RPC that is `SECURITY DEFINER` MUST have `SET search_path = public, extensions`. No exceptions. Missing `search_path` = search_path injection risk.
6. **Structured Error Codes, Not Raw SQLERRM**: Never expose raw database error strings to the API response. Always return machine-readable codes like `ORDER_ALREADY_EXISTS`. See `docs/PRINCIPLES_AND_MENTAL_MODELS.md` for the full error code table.
7. **No silent EXCEPTION swallowing**: `EXCEPTION WHEN OTHERS THEN RETURN json_build_object('success', false, 'error', SQLERRM)` is forbidden in production RPCs that modify state. RAISE the exception. Let the transaction roll back. Never silently succeed on a partial write.
8. **RLS-First Architecture**: All tables exposed to PostgREST must have RLS enabled. `SECURITY DEFINER` functions bypass RLS intentionally — treat them as privileged kernel operations, not general-purpose shortcuts.
9. **FK Indexes**: PostgreSQL does NOT auto-index foreign keys. Every FK column must have a covering index.
10. **Docs-First Onboarding**: Friction is a bug. OCR (IDfy) extraction must pre-fill all KYB forms. The vendor is a verifier, not an inputter.
11. **The ETA Contract**: Time > Distance.
    - **Formula**: `ETA = vendor.avg_prep_time_mins + (distance_km * 5) + 5 [buffer]`
    - **Usage**: Product Card: "~40 min" | Checkout: "Arriving in ~45 mins" | Tracking: "Arriving by 5:15 PM".

12. **The Realtime Contract (Subscriptions)**: Never force a pull when the system can push.
    - **Rule**: Order tracking MUST use Supabase Realtime subscriptions.
    - **Channel**: `public:orders:id=eq.$order_id`
    - **Events**: `UPDATE` (status, eta)
    - **Fallback**: 30s background polling if WebSocket fails.

13. **Anti-Fragile State**: Decouple 3PL logistics from the order state machine. A Shadowfax API failure must NOT block a vendor from marking an order as 'PACKED'.

## 💬 Nomenclature Guard (Purified)

| Concept | Canonical Name | Forbidden Terms |
|---|---|---|
| Vendor | **Vendor** | Partner, Merchant, Seller |
| Product | **Product** | Item, SKU, Good |
| Personalization| **Personalization** | Customization, Design |
| Line Item | **Order Product** | Order Item, Line |
| Delivery Executive | **Delivery Executive** | Delivery Partner, Driver |

## 📐 Design Patterns

- **Progressive Disclosure**: Collapse coupons, GSTIN, and secondary info by default.
- **Sheet vs Page**: Use Sheets for browsing context (Product Detail, Cart). Use Pages for commitment (Checkout, Tracking).
- **Interaction-Decision Architecture**: Every screen has ONE primary decision. One CTA per screen.
- **Anti-Dark-Patterns**: No confirmshaming. No urgency theatre. No hidden fees. No pre-checked opt-ins. See `docs/PRINCIPLES_AND_MENTAL_MODELS.md` for the full prohibition list.
- **Zero-State Design**: Every screen must have a designed empty state. A blank page is a broken page.
- **Accessibility Baseline**: All interactive elements meet WCAG 2.1 AA. Min contrast 4.5:1 for body text. All images have `alt` text. Tap targets ≥44px.

## 🔒 Security Principles

- **RLS as Policy Engine**: All tables exposed to PostgREST have RLS enabled. `SECURITY DEFINER` bypasses RLS intentionally, only for trusted internal operations.
- **Webhook Signature Verification**: All Razorpay webhooks MUST verify `x-razorpay-signature` using HMAC-SHA256. Never process an unsigned webhook.
- **Rate Limiting**: API endpoints accept max 60 req/min per IP (Next.js middleware + Vercel edge config). Cart mutation RPCs: max 10 req/min per user (enforced at edge).
- **API Key Rotation**: `SUPABASE_SERVICE_ROLE_KEY` and `RAZORPAY_KEY_SECRET` must be rotated every 90 days. Scheduled in ops calendar.
- **No Secrets in Code**: All secrets via environment variables only. Never committed to git.
- **CSP Headers**: `Content-Security-Policy` header set in `next.config.ts`. `frame-ancestors 'none'`. `script-src 'self' cdn.razorpay.com maps.googleapis.com`.

## 🧪 Testing Standards

- **Unit tests** (Vitest): All RPC caller functions in `src/lib/actions/` must have unit tests. Coverage gate: 80%.
- **E2E tests**: Playwright was removed in Round 4 (multi-framework bloat). E2E happy-path coverage (browse → cart → checkout → payment → tracking) is a **known gap** and a priority for the next engineering cycle.
- **Mutation testing**: Commerce intent functions must be tested for all error branches (vendor offline, insufficient stock, vendor mismatch).

---

*Follow the best. Don't reinvent. This is the Swiggy 2026 way.*
