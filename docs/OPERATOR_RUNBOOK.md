# WyshKit 2026: Operator Runbook

> *"The system handles the happy path. Operators handle everything else."*

Borrowed from: Swiggy ops playbook structure, Stripe incident response, Google SRE book.

---

## The Operator's Job

The system handles ~95% of the order lifecycle automatically.
This runbook covers the 5% where a human must intervene.

An operator is NOT a customer support agent. An operator is:
- The person who can directly update DB state via Supabase dashboard
- The person who escalates to vendor, 3PL, or Razorpay
- The person who issues refunds manually when the system cannot

---

## Incident Severity Levels

| Level | Description | Response Time | Who Acts |
|---|---|---|---|
| **SEV-1** | System down / payment loop / data loss | Immediate | Eng + Ops |
| **SEV-2** | SLA breach affecting 5+ active orders | < 15 min | Ops |
| **SEV-3** | Single order stuck, vendor offline | < 30 min | Ops |
| **SEV-4** | Refund request, rating dispute, vendor complaint | < 2 hours | Ops |

---

## Runbook 1: SLA Breach (Vendor Late on Preview)

**Trigger**: Ops Slack alert → `SLA_BREACH_CRITICAL` event

**Steps:**
1. Check `orders` table: confirm order is in `CONFIRMED` or `DETAILS_RECEIVED` status
2. Call vendor using masked phone in `vendor_users` table
3. If vendor responds: give 15 min extension. Set a manual reminder.
4. If vendor unreachable within 15 min:
   ```sql
   -- Mark vendor as offline temporarily
   UPDATE vendors SET is_online = false WHERE id = '[vendor_id]';
   ```
5. Contact customer via WhatsApp with options:
   - Option A: "Wait 30 more minutes — we're following up with the vendor"
   - Option B: "Cancel now for instant full refund"
6. If customer chooses cancel:
   ```sql
   -- Trigger via RPC, don't do manual UPDATE on orders
   SELECT transition_order('[order_id]', 'CANCELLED', '{"reason": "SLA_BREACH_OPS_CANCEL"}');
   ```
7. Issue refund (see Runbook 3)
8. Log incident in `#ops-incidents` Slack channel

---

## Runbook 2: Vendor Goes Offline Mid-Order

**Trigger**: Vendor signals unavailability OR ops detects no activity

**Decision tree:**
```
Is the order in PLACED status (not yet CONFIRMED)?
  YES → Cancel order → full refund → done
  NO (CONFIRMED or later) →
    Is there a personalised item with approved preview?
      YES → Production was committed. Contact vendor urgently.
      NO  → Can another vendor in area fulfill? (Phase 2 feature)
          → If no: cancel order → full refund
```

**DB action for cancelling post-CONFIRMED:**
```sql
-- Get current status first
SELECT id, status, has_personalization FROM orders WHERE id = '[order_id]';

-- Only if safe to cancel (no liability_shifted_at set on any order_products)
SELECT transition_order('[order_id]', 'CANCELLED', '{"reason": "VENDOR_UNAVAILABLE"}');
```

**NEVER** manually `UPDATE orders SET status = 'CANCELLED'` without using `transition_order` RPC.
The FSM audit trigger will not fire. History will be lost.

---

## Runbook 3: Issuing a Refund

**Refund source hierarchy:**
1. Razorpay API refund (for payment_status = PAID, preferred)
2. WyshKit Wallet credit (customer preference or partial refund)
3. Manual bank transfer (last resort, requires finance approval)

**Razorpay refund steps:**
```
Razorpay Dashboard → Payments → Find by payment_id → Refund → Enter amount
Wait for webhook: refund.processed → updates orders.refund_status in DB
```

**Wallet credit (if customer prefers WyshKit Money):**
```sql
-- Credit wallet directly (ops-initiated, not from cashback RPC)
INSERT INTO wallet_transactions (user_id, order_id, amount, type, reason, balance_after)
SELECT 
  user_id,
  '[order_id]',
  [REFUND_AMOUNT],
  'CREDIT',
  'Ops refund for order #[order_number]',
  balance + [REFUND_AMOUNT]
FROM user_wallets WHERE user_id = (SELECT user_id FROM orders WHERE id = '[order_id]');

UPDATE user_wallets 
SET balance = balance + [REFUND_AMOUNT], updated_at = NOW()
WHERE user_id = (SELECT user_id FROM orders WHERE id = '[order_id]');
```

**Refund SLA:**
- Razorpay → original payment method: 5–7 business days
- WyshKit Wallet: Instant
- Manual transfer: Up to 3 business days

---

## Runbook 4: Razorpay Webhook Failure

**Symptom**: Customer paid, app says "Processing…" forever. Order not appearing in `orders` table.

**Diagnosis:**
```sql
-- Check if Razorpay order ID exists in our system
SELECT id, status, payment_status, razorpay_order_id 
FROM orders 
WHERE razorpay_order_id = '[razorpay_order_id]';
```

**If no row found:**
1. Check Razorpay dashboard: confirm payment succeeded
2. Manually call `place_atomic_order` with the captured payment details:
   - This works because of idempotency: if the payment ID is valid, the order is created
3. Verify webhook is live in Razorpay dashboard (Settings → Webhooks → WyshKit endpoint)

**If row found but payment_status = PENDING:**
```sql
UPDATE orders 
SET payment_status = 'PAID', payment_id = '[razorpay_payment_id]', updated_at = NOW()
WHERE razorpay_order_id = '[razorpay_order_id]';
```

---

## Runbook 5: Double Order (Duplicate Charge)

**Check:**
```sql
SELECT * FROM orders 
WHERE user_id = '[user_id]' 
AND created_at > NOW() - INTERVAL '30 minutes'
ORDER BY created_at;
```

**If two orders exist with same products:**
1. Cancel the newer order (`transition_order` → CANCELLED)
2. Issue full refund for newer order via Razorpay
3. Confirm older order is in correct status
4. Notify customer via WhatsApp

**If one order with two charges (Razorpay duplicate payment):**
1. Refund the duplicate charge via Razorpay dashboard
2. Log as `PAYMENT_DUPLICATE` in `#ops-incidents`

---

## Runbook 6: Vendor Suspension

**Trigger conditions:**
- 3+ SLA breaches in 7 days
- Customer complaints about quality (>3 within 30 days)
- KYC document fraud detected by IDfy
- Vendor requested suspension themselves

**Steps:**
```sql
-- Suspend vendor (hides from catalog immediately)
UPDATE vendors 
SET is_active = false, status = 'SUSPENDED', suspension_reason = '[REASON]', updated_at = NOW()
WHERE id = '[vendor_id]';
```

**In-flight orders when suspended:**
1. Check for active orders: `SELECT * FROM orders WHERE vendor_id = '[vendor_id]' AND status NOT IN ('DELIVERED', 'CANCELLED', 'REFUNDED')`
2. Contact each affected customer
3. Cancel + refund each order individually via Runbook 3

**Reactivation (after review):**
- Requires: ops sign-off + repeat dummy order (Runbook in VENDOR_ONBOARDING_SOP.md)
- Same SQL: `UPDATE vendors SET is_active = true, status = 'ACTIVE'...`

---

## Emergency Contacts

| Service | Contact | Type |
|---|---|---|
| Razorpay | helpdesk@razorpay.com + dashboard chat | Payment issues |
| Shadowfax | Partner portal + helpline | Rider/delivery issues |
| Porter | Partner dashboard | Rider/delivery issues |
| IDfy | dedicated account manager | KYC issues |
| Supabase | support.supabase.com | DB/infra issues |

---

## Daily Ops Checklist (5 minutes)

- [ ] Check Supabase logs for any RPC ERRORS in last 24h
- [ ] Check `orders` where `status = 'PLACED'` AND `created_at < NOW() - INTERVAL '30 min'` (stuck orders)
- [ ] Check `vendors` where `is_online = false` AND `updated_at < NOW() - INTERVAL '2 hours'` (stale offline)
- [ ] Check `vendor_payouts` due this week (trigger payout manually if cron failed)
- [ ] Verify Razorpay webhook is receiving events (Razorpay dashboard → Webhooks → Last event)

---

*Last updated: February 2026*
*Follow the best. Don't reinvent. This is the Swiggy 2026 way.*
