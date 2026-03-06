# WyshKit 2026: OPERATIONS — The Supply Chain

> **"Extraction-First KYC. SLA Discipline. Zero Manual SQL."**

## ❌ WHAT WE'RE **NOT**
- **NOT** a gifting marketplace (gifting is just ONE category)
- **NOT** quick commerce (we don't own inventory)

---

## Vendor Onboarding SOP

### The Funnel (4 Stages)

```
LEAD → QUALIFIED → ONBOARDED → LIVE
```

| Stage | Definition | Owner |
|---|---|---|
| **LEAD** | BD contacted vendor, interest confirmed | BD/Sales |
| **QUALIFIED** | Vendor has machine + can deliver in ≤60 mins + in serviceable zone | BD |
| **ONBOARDED** | KYC done, products listed, dummy order passed | Ops |
| **LIVE** | First real order received | System |

---

### Stage 1: Qualifying a Vendor

The 3-second qualify:
1. Do they have the machine (engraver, embroidery, etc.)?
2. Can they produce in ≤60 minutes post-approval?
3. Are they within the current serviceable zone?

**If any = No → Don't onboard.** One slow vendor destroys the SLA promise for the whole neighbourhood.

**Phase 1 target types (Bengaluru)**:
- Trophy & awards shops (laser engraving)
- Print studios (mugs, phone cases, identity-layer merchandise)
- Custom embroidery shops (t-shirts, tote bags)
- Leather personalisation shops (wallets, belts)
- Specialty workshops (3D printed keepsakes, engraved wood)

---

### Stage 2: KYC / KYB — Extraction-First (The IDfy Pattern)

**The Doctrine**: We don't ask for data — we ask for documents and extract the data. The vendor is a **Verifier**, not an Inputter.

**Workflow**:
1. **Upload**: Vendor uploads GSTIN, PAN, and cancelled cheque.
2. **Extract**: IDfy OCR parses GSTIN (Business Name, Address, Entity Type) + bank details (Account Number, IFSC) — within 10 seconds.
3. **Pre-fill**: Onboarding form is 90% pre-filled. Vendor corrects only OCR errors.
4. **Validate**: API checks active GST status and PAN-Bank mapping.

| Approach | Friction |
|---|---|
| Manual data entry (❌ Legacy) | High — vendor types everything |
| **Extraction-First (✅ WyshKit 2026)** | Low — vendor only verifies |

**Onboarding SLAs**:
- Extraction: <10 seconds (IDfy OCR returns JSON)
- Verification: <10 minutes for High-Priority nodes (ops reviews extracted data)
- Activation: <30 minutes from verified state to `LIVE`

---

### Stage 3: Vendor Status Machine

| Status | Definition | Publicly Discoverable? |
|---|---|---|
| `PENDING_DOCS` | Signed up, no docs uploaded | No |
| `UNDER_REVIEW` | Docs submitted, extraction complete | No |
| `VERIFIED` | Admin approved, dummy order pending | No |
| `LIVE` | Fully verified + dummy order passed | **Yes** |

Full lifecycle:
```
PENDING_KYC → (kyc_status = VERIFIED) → ACTIVE
ACTIVE      → (vendor_tier = 3)        → ELITE
ACTIVE      → (violation/inactivity)   → SUSPENDED
SUSPENDED   → (review passed)          → ACTIVE
SUSPENDED   → (permanent)              → TERMINATED
```

`vendors.is_active` = computed from `status = ACTIVE AND kyc_status = VERIFIED AND is_online = true`.

> **Bridge**: After onboarding completes (`LIVE` in the table above), the vendor enters the runtime lifecycle below as `ACTIVE`. The onboarding stages (`PENDING_DOCS` → `LIVE`) are pre-launch. The runtime states (`ACTIVE` → `ELITE` / `SUSPENDED` / `TERMINATED`) are post-launch.

---

### Stage 4: Product Listing

**Mandatory fields per product**:
- Name (max 60 chars)
- Category (from canonical categories table)
- Base price (INR, inclusive of GST)
- GST % (verify with CA: 18% for most handicrafts; 12% for some)
- Min 3 images (1200×1200px, white/neutral background)
- Production time in minutes (realistic, not aspirational)
- Stock quantity — `NULL` = unlimited (default). Must be `NULL` by default, never `0`. Only set an integer when the vendor has finite stock.
- **Add-ons**: Extra physical products (Gift wrap). Stockable.
- **Personalisation Service**: This is a **Price Toggle** on the product sheet (pre-payment), and a **Requirements Form** on the order tracking page (post-payment).
- **Constraints**: Max 4 variant groups. Max 4 options per group. (Hick's Law — enforced at listing time.)

**Personalisation Schema (if enabled)**:

Maximum 3 fields per product. These fields are collected **POST-PAYMENT** on `/orders/[id]`.

**Example 1 — Trophy/Engraving Vendor:**
```json
[
  {
    "id": "engraving_text",
    "type": "text",
    "label": "Text to engrave",
    "placeholder": "Enter text",
    "validation": "^.{1,20}$",
    "instructions": "English only. Max 20 chars. Hyphens allowed."
  },
  {
    "id": "color_choice",
    "type": "select",
    "label": "Primary Color",
    "options": ["Royal Gold", "Midnight Silver", "Rosewood"]
  }
]
```

**Example 2 — Embroidery Vendor:**
```json
[
  {
    "id": "embroidery_name",
    "type": "text",
    "label": "Name to embroider",
    "placeholder": "e.g. Priya",
    "validation": "^[A-Za-z ]{1,15}$",
    "instructions": "English letters only. Max 15 chars."
  },
  {
    "id": "logo_upload",
    "type": "image",
    "label": "Upload logo (optional)",
    "instructions": "PNG, transparent background, min 300×300px"
  },
  {
    "id": "thread_color",
    "type": "select",
    "label": "Thread Colour",
    "options": ["Navy Blue", "Burgundy", "Forest Green", "Black"]
  }
]
```

---

### Stage 5: Dummy Order (Mandatory Before LIVE)

**Purpose**: Verify the vendor can complete the full workflow before real money is involved.

**Steps**:
1. Ops places test order using a **test customer account** (internal credit or bypass flag — never a real customer account)
2. Vendor receives notification → accepts
3. **Post-payment requirements**: Ops lands on tracking page and submits dummy personalisation details
4. Vendor uploads a preview within their stated SLA
5. Ops approves preview via "Slide to Approve"
6. Vendor marks order `PACKED`
7. Internal rider (or ops) picks up → marks `DELIVERED`

**Pass criteria**:
- All steps completed within stated SLAs
- Preview quality acceptable (not blank or placeholder)
- Vendor navigates the vendor app without assistance

**Fail → one retry.** Second fail → defer onboarding → ops training session.

---

### Commission Structure

Stored in `platform_settings` table. **Never hardcoded.**

| Tier | Requirements | Commission Rate |
|---|---|---|
| First 10 orders | — | **0%** (acquisition incentive) |
| Tier 1 (Active) | KYC verified, first order done | 15% |
| Tier 2 (Trusted) | 50+ orders, ≥4.0 ⭐ | 12% |
| Tier 3 (Elite) | 200+ orders, ≥4.5 ⭐, SLA breach ≤5% | 10% |

**Platform fee** (charged to customer): ₹5 flat. Not negotiable per vendor.
**Payout cycle**: Every 7 days. Triggered by cron job from `vendor_payouts` table.

**Vendor Tier Benefits**:
| Tier | Badge | Feed Position | Commission |
|---|---|---|---|
| 0 — Onboarding | None | Ops-visible only | N/A |
| 1 — Active | None | Standard | 15% |
| 2 — Trusted | None | Priority ranking | 12% |
| 3 — Elite | "Elite Vendor" badge | Top feed position | 10% |

### Vendor Pitch Script (BD)

> *"You already have the machine. You already know how to do the engraving.
> The problem is: no one can find you online.
> WyshKit puts you in front of local customers who are already looking for products like yours — and they pay 100% upfront before you touch anything.
> We follow the **Apple Personalisation Model**: the product exists, you just add the identity (name, logo, memory). No long design hours. Just 10 minutes of production.
> Just like Swiggy brings food orders, we bring product orders to your workshop. We handle the delivery; you just provide the product and personalisation.
> First 10 orders: zero commission. On us."*

---

## Operator Runbook

> *"The system handles the happy path. Operators handle everything else."*

### The Operator Doctrine

1. **Zero Manual SQL** — Production database state is only mutated via Atomic RPCs. `UPDATE`/`DELETE` on production tables is forbidden. No exceptions.
2. **Audit Mandatory** — Every manual intervention is logged via `log_operator_action` (handled automatically by Ops RPCs).
3. **Recovery is the Product** — Proactively offer "SLA Salvation" (Credit + Auto-shift) before the customer complains.
4. **Time is Gravity** — The cost of a delay grows exponentially. Act within 15 minutes of an alert.

---

### Runbook 1: SLA Breach (Vendor Late on Preview / Production)

**Trigger**: Ops Slack alert (`SLA_BREACH_CRITICAL`)

**Passive Salvation (Refund + Credit)** — the standard response:
```sql
-- Step A: Cancel
SELECT transition_order('[ORDER_ID]', 'CANCELLED', '{"reason": "SLA_BREACH_AUTO_CANCEL"}');

-- Step B: Issue goodwill wallet credit
SELECT issue_wallet_credit_atomic(
  p_user_id  => '[USER_ID]',
  p_amount   => 50.00,
  p_reason   => 'Compensation for SLA breach on order #[order_number]',
  p_order_id => '[ORDER_ID]'
);
```

---

> **Phase 2 — Not Yet Deployed**
>
> **Active Salvation (Shift + Credit)** — when another vendor can fulfill:
> `salvation_shift_order_atomic` is not yet deployed. Escalate to engineering before attempting.
> ```sql
> SELECT salvation_shift_order_atomic(
>   p_order_id    => '[ORDER_ID]',
>   p_new_vendor_id => '[NEW_VENDOR_ID]',
>   p_reason      => 'Original vendor breached SLA. Shifting to save order.',
>   p_issue_token => true,
>   p_token_amount => 50.00
> );
> ```

---

### Runbook 2: Vendor Goes Offline / Technical Failure

**Never update `orders.status` directly.** Use the state machine:

```sql
SELECT transition_order(
  p_order_id      => '[ORDER_ID]',
  p_target_status => 'CANCELLED',
  p_metadata      => '{"reason": "VENDOR_TECHNICAL_FAILURE"}'
);
```

---

### Runbook 3: Wallet Credits & Refunds

**Hierarchy**:
1. **Instant Wallet Credit** — Goodwill, Salvation tokens, small disputes.
2. **Bank Refund (Razorpay)** — Cancellations, large amounts.

```sql
SELECT issue_wallet_credit_atomic(
  p_user_id  => '[USER_ID]',
  p_amount   => [AMOUNT],
  p_reason   => '[CLEAN_REASON_FOR_CUSTOMER]',
  p_order_id => '[OPTIONAL_ORDER_ID]'
);
```

---

### Runbook 4: Payment / Webhook Drift

**Symptom**: "Processing..." stuck on customer screen; Razorpay dashboard shows success.

**Never run a raw UPDATE on orders.** Use the atomic recovery RPC:
```sql
SELECT recover_payment_atomic(
  p_razorpay_order_id   => '[razorpay_order_id]',
  p_razorpay_payment_id => '[razorpay_payment_id]',
  p_operator_note       => 'Manual recovery: webhook failure'
);
```

> [!CAUTION]
> If `recover_payment_atomic` does not exist:
> 1. **Do NOT run a raw UPDATE.** A partial write without the state machine creates phantom state.
> 2. Log in Slack with order ID + Razorpay payment ID.
> 3. Escalate to engineering immediately.
> 4. Inform the customer: "Payment confirmed. Order processing. Our team is resolving a sync delay."
> 5. Engineering deploys the RPC → ops retries this runbook.

---

### Emergency Controls

> [!CAUTION]
> Zero Manual SQL applies in emergencies too. Never run raw `UPDATE`/`DELETE` on production — not even under pressure. Partial writes without the state machine and audit trail create phantom state that is worse than the original incident.

| Action | Correct Approach |
|---|---|
| Suspend vendor | Ops Dashboard → Vendor → Deactivate (calls `suspend_vendor_atomic` internally) |
| System lockdown | Ops Dashboard → Settings → Disable new orders (`platform_settings.orders_enabled = false`) |
| Clear user cart | `execute_cart_mutation(p_mode='CLEAR')` with the user's session |

---

### Ops Slack Webhook Payload (SLA Breach)

```json
{
  "event": "SLA_BREACH_CRITICAL",
  "order_id": "...",
  "order_number": "WK-YYYYMMDD-XXXX",
  "vendor_name": "...",
  "vendor_phone": "...",
  "customer_name": "...",
  "minutes_overdue": 60
}
```

---

### Daily Audit Checklist

> [!NOTE]
> Read-only `SELECT` queries below are exempt from the Zero Manual SQL doctrine (which prohibits `UPDATE`/`DELETE` mutations only).

- [ ] `SELECT * FROM audit_logs WHERE created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC;`
- [ ] Verify every `SALVATION_SHIFT` has a corresponding entry in the `notifications` table.

---

*WyshKit 2026 — Zero Manual SQL. Recovery is the Product.*
