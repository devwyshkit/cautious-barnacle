# WyshKit 2026: Operator Runbook
> *"The system handles the happy path. Operators handle everything else."*

---

## The Swiggy 2026 Operator Doctrine
1. **Zero Manual SQL**: Production database state is only mutated via Atomic RPCs. `UPDATE` and `DELETE` on production tables is forbidden.
2. **Audit Mandatory**: Every manual intervention must be logged via `log_operator_action` (handled automatically by our Ops RPCs).
3. **Recovery is the Product**: Proactively offer an "SLA Salvation" (Credit + Auto-shift) before the customer complains.
4. **Time is Gravity**: The cost of a delay increases exponentially. Act within the Doherty Threshold (400ms intent, <15min resolution).

---

## Runbook 1: SLA Breach (Vendor Late on Preview/Production)

**Trigger**: Ops Slack alert (e.g., `SLA_BREACH_CRITICAL`)

**Steps:**
1. **Analyze**: Check the current status in the Dashboard.
2. **Active Salvation (Shift)**: If another vendor can fulfill, shift the order immediately.
   ```sql
   -- Use Atomic Salvation RPC (Shift + Credit + Notif + Log)
   SELECT salvation_shift_order_atomic(
     p_order_id => '[ORDER_ID]',
     p_new_vendor_id => '[NEW_VENDOR_ID]',
     p_reason => 'Original vendor breached SLA. Shifting to save order.',
     p_issue_token => true,
     p_token_amount => 50.00
   );
   ```
3. **Passive Salvation (Refund)**: If no shift is possible, cancel and issue an extra "Salvation Credit" to the wallet.
   ```sql
   -- Step A: Cancel the order
   SELECT transition_order('[ORDER_ID]', 'CANCELLED', '{"reason": "SLA_BREACH_AUTO_CANCEL"}');
   
   -- Step B: Issue extra wallet credit for the friction
   SELECT issue_wallet_credit_atomic(
     p_user_id => '[USER_ID]',
     p_amount => 50.00,
     p_reason => 'Compensation for SLA breach on order #[order_number]',
     p_order_id => '[ORDER_ID]'
   );
   ```

---

## Runbook 2: Vendor Goes Offline / Technical Failure

**Trigger**: Heartbeat failure or Vendor signal.

**Action:**
Use the `transition_order` RPC. Never update `orders.status` directly.
```sql
SELECT transition_order(
  p_order_id => '[ORDER_ID]',
  p_target_status => 'CANCELLED',
  p_metadata => '{"reason": "VENDOR_TECHNICAL_FAILURE"}'
);
```

---

## Runbook 3: Wallet Credits & Refunds

**Hierarchy:**
1. **Instant Wallet Credit**: Used for Goodwill, Salvation Tokens, or small disputes.
2. **Bank Refund (Razorpay)**: Standard for cancellations and large amounts.

**Wallet Credit Execution:**
```sql
SELECT issue_wallet_credit_atomic(
  p_user_id => '[USER_ID]',
  p_amount => [AMOUNT],
  p_reason => '[CLEAN_REASON_FOR_CUSTOMER]',
  p_order_id => '[OPTIONAL_ORDER_ID]'
);
```

---

## Runbook 4: Payment / Webhook Drift

**Symptom**: "Processing..." stuck on customer screen despite success in Razorpay dashboard.

**Action**:
1. Verify `payment_id` in Razorpay.
2. Manually force the payment bridge:
```sql
-- This creates/updates the internal status safely.
UPDATE orders 
SET payment_status = 'PAID', 
    payment_id = '[razorpay_payment_id]', 
    updated_at = NOW()
WHERE razorpay_order_id = '[razorpay_order_id]';

-- Log it!
SELECT log_operator_action('MANUAL_PAYMENT_RECOVERY', 'orders', id, NULL, NULL, 'Webhook failure recovery')
FROM orders WHERE razorpay_order_id = '[razorpay_order_id]';
```

---

## Emergency Infrastructure Controls

| Action | RPC / Command | Risk |
|---|---|---|
| **Suspend Vendor** | `UPDATE vendors SET is_active = false...` | High (Immediate de-listing) |
| **System Lockdown** | `UPDATE platform_settings SET orders_enabled = false` | Critical (Halts all commerce) |
| **Clear Cart** | `DELETE FROM cart_products WHERE user_id = '...'` | Low (Session purge) |

---

## Audit Checklist (Daily)
- [ ] `SELECT * FROM audit_logs WHERE created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC;`
- [ ] Verify that every `SALVATION_SHIFT` has a corresponding notification in `notifications` table.

---

*Last revised: Swiggy 2026 Doctrine Audit (Feb 2026)*
*Zero Manual SQL. Recovery is the Product.*
