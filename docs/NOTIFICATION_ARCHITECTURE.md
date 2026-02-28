# WyshKit 2026: Notification Architecture

> *Notify when signal matters. Never for the sake of notifying.*

Borrowed from: Stripe (transactional clarity), Swiggy (SLA urgency model), Zomato (deferred rating).
Zero reinvention.

---

## The Hierarchy of Channels

Never use a higher-cost channel when a lower-cost one works.

```
Push Notification  (most interruptive, lowest open %)
     ↓
In-App Banner      (contextual, high relevance)
     ↓
WhatsApp Message   (high open %, use sparingly or for critical)
     ↓
SMS                (fallback only — cost + regulatory overhead)
     ↓
Email              (invoices, legal documents only)
```

**Rule**: Sending a push AND a WhatsApp AND an SMS for the same event is spam.
One event = one channel. The channel is chosen by urgency tier below.

---

## Urgency Tiers

| Tier | Description | Channel | Max Delay |
|---|---|---|---|
| **P0 — Critical** | Order cancellation, refund issued, payment failed | Push + WhatsApp | Immediate |
| **P1 — Transactional** | Order placed, preview ready, rider assigned, delivered | Push | Immediate |
| **P2 — Operational** | SLA reminder (T-30min), vendor accepted | Push | <2 min |
| **P3 — Deferred** | Rating prompt, cashback credited, wallet expiry | In-App Banner | 30 min post-trigger |
| **P4 — Marketing** | Festival campaign, re-engagement | Push (batched) | Operator-scheduled |

---

## Canonical Trigger Matrix

### Customer Notifications

| Trigger | Tier | Channel | Copy Template |
|---|---|---|---|
| Order placed successfully | P1 | Push | "Order #{num} placed! Your vendor will confirm shortly." |
| Vendor confirms order | P1 | Push | "[Vendor] has accepted your order. Personalisation starts soon." |
| Personalisation details requested | P1 | Push | "Tell [Vendor] what to write! Open to submit details." |
| Preview is ready | P1 | Push | "Your preview is ready! Approve or request a change." |
| Preview approved, production starts | P1 | In-App | "Production started. Your [product] is being made." |
| Rider assigned | P1 | Push | "[Name] is picking up your order. Arriving by [time]." |
| Delivered | P0 | Push | "Delivered! ₹X WyshKit Money added to your account." |
| SLA breach (vendor hasn't uploaded) | P0 | Push + WhatsApp | "Your vendor is running late. Wait or cancel for full refund." |
| Order cancelled + refund | P0 | Push + WhatsApp | "Order cancelled. ₹X refunded to your original payment method." |
| Rating prompt | P3 | In-App | Shown 30 mins after delivered or next app open. Never both. |
| Wallet expiry warning | P3 | In-App | "₹X WyshKit Money expires in 7 days. Use it on your next gift." |

### Vendor Notifications

| Trigger | Tier | Channel | Copy Template |
|---|---|---|---|
| New order received | P0 | Push + WhatsApp | "New order! #{num} — [Product]. Accept now." |
| Personalisation details submitted | P1 | Push | "[Customer] submitted details for order #{num}. Upload preview." |
| Preview change requested | P1 | Push | "[Customer] requested a revision. Check the feedback." |
| Preview approved | P1 | Push | "Preview approved! Start production now." |
| SLA warning (T–30 min) | P2 | Push | "Reminder: preview due in 30 mins for #{num}." |
| SLA breach (T+0) | P0 | Push + WhatsApp | "URGENT: Preview overdue for #{num}. Customer notified." |
| Order cancelled by customer | P0 | Push | "Order #{num} cancelled. No action needed." |
| Payout processed | P3 | In-App | "₹X payout processed for [date range]." |

---

## Deferred Feedback — The Non-Interruption Law

> *Never interrupt a user mid-flow with a rating or NPS prompt.*
> Borrowed from Krug's "Don't Make Me Think" and Zomato's post-delivery rating pattern.

**Rating prompt rules**:
1. Show **30 minutes** after `DELIVERED` status, OR
2. On next app open (if user doesn't return within 24h), OR
3. Via push notification (24h after delivery, if rating not submitted)

Never at all three. First condition met → trigger once → mark as `rating_prompted = true` on the order.

**NPS (when introduced)**:
- Only for users with 3+ orders.
- Shown after 5th order, not after 1st.
- In-app only. Never email.

---

## SLA Breach Protocol (Operational Escalation)

```
T + 0h       → Vendor accepts order
T + (SLA - 30min) → Silent push reminder to vendor (P2)
T + SLA      → Urgent push + WhatsApp to vendor (P0)
               In-app banner to customer: "Vendor running late. We're following up."
T + SLA + 30min → Customer sees: "Wait (free) or Cancel + instant refund"
               Ops team alerted via internal Slack webhook
T + SLA + 60min → If no action: auto-escalate to ops for manual intervention
```

Ops Slack webhook payload:
```json
{
  "event": "SLA_BREACH_CRITICAL",
  "order_id": "...",
  "order_number": "WSH-260225-ABCD12",
  "vendor_name": "...",
  "vendor_phone": "...",
  "customer_name": "...",
  "minutes_overdue": 60
}
```

---

## Notification Data Model

Notifications are stored in the `notifications` table with the following contract:

```sql
-- Canonical notification record
{
  user_id: UUID,           -- recipient (customer or vendor user)
  type: TEXT,              -- e.g. 'PREVIEW_READY', 'ORDER_PLACED'
  title: TEXT,             -- push title
  body: TEXT,              -- push body / WhatsApp message
  entity_type: TEXT,       -- 'ORDER', 'ORDER_PRODUCT', 'PAYOUT'
  entity_id: UUID,         -- deep link target
  channel: TEXT,           -- 'PUSH', 'WHATSAPP', 'IN_APP'
  is_read: BOOLEAN,        -- in-app read state
  sent_at: TIMESTAMPTZ,    -- when dispatched
  read_at: TIMESTAMPTZ     -- when opened
}
```

**Deep link standard**: All push notifications link to a specific entity.
- Order push → `/orders/[id]`
- Preview push → `/orders/[id]#preview`
- Payout push → `/vendor/earnings`
- No push notification ever links to the home feed.

---

## What We Never Do

- ❌ Promotional push during 10 PM–8 AM (DND window)
- ❌ More than 2 pushes in the same order lifecycle within 60 minutes
- ❌ Push notification without a deep link (ghost pushes destroy trust)
- ❌ WhatsApp message that doesn't have an unsubscribe path (TRAI compliance)
- ❌ Rating prompt before delivery confirmation is logged in DB
- ❌ Generic "You have a new notification" — always be specific

---

*Last updated: February 2026*
*Follow the best. Don't reinvent. This is the Swiggy 2026 way.*
