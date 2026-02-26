# WyshKit 2026: Vendor Onboarding SOP

> *"Every paying customer starts with a vendor who was onboarded well."*

---

## The Onboarding Funnel (4 Stages)

```
LEAD → QUALIFIED → ONBOARDED → LIVE
```

| Stage | Definition | Owner |
|---|---|---|
| **LEAD** | BD contacted vendor, interest confirmed | BD/Sales |
| **QUALIFIED** | Vendor has machine + product + can deliver in 60–120 min | BD |
| **ONBOARDED** | KYC done, products listed, dummy order completed | Ops |
| **LIVE** | First real order received | System |

---

## Stage 1: Qualifying a Vendor

**The 3-second qualifying criteria:**
1. Do they have the machine/tool (engraver, embroidery, etc.)?
2. Can they produce in ≤60 minutes post-approval?
3. Are they within the current city's serviceable zone?

**If any = No → Don't onboard.** A slow vendor destroys the SLA promise for everyone.

**Target vendor types for Phase 1 (Bengaluru):**
- Trophy & awards shops (engraving)
- Print studios (mugs, phone cases, custom merchandise)
- Custom embroidery shops (t-shirts, tote bags)
- Leather goods personalisation (wallets, belts)

---

## Stage 2: KYC & KYB (The "Docs-First" Flow)

**The Pattern**: Borrowed from IDFC First Bank & IDfy TrustStack. We don't ask for data; we ask for documents and extract the data to eliminate friction.

**The Workflow**:
1. **Upload**: Vendor's first action is uploading a clear photo of GSTIN, PAN, and a cancelled cheque.
2. **Extract (The Handshake)**:
   - **IDfy OCR**: Instantly parses GSTIN for Business Name, Address, and Entity Type.
   - **Bank Verification**: Parses Cheque/Bank Statement for Account Number and IFSC.
3. **Pre-fill**: The onboarding form is 90% pre-filled. The vendor only "corrects" if OCR missed a character.
4. **Validation**: API checks for active GST status and PAN-Bank mapping.

| Action | Tech Layer | User Friction |
|---|---|---|
| Manual Data Entry | ❌ Legacy | High (Type-heavy) |
| **Extraction-First** | ✅ WyshKit 2026 | Low (Verification-only) |

**The Law of 10s (Onboarding SLAs)**:
To maintain hyperlocal velocity, the onboarding funnel is governed by strict technical and operational SLAs:
1. **Extraction SLA (< 10s)**: IDfy OCR must return the extracted JSON within 10 seconds of document upload.
2. **Verification SLA (< 10m)**: Admin verification of the extracted data (matching docs to profile) must happen within 10 minutes for "High-Priority" nodes.
3. **Activation SLA (< 30m)**: Once verified and dummy order passed, status moves to `LIVE`.

---

## Technical Funnel (Status Machine)
| Status | Definition | Discovery? |
|---|---|---|
| `PENDING_DOCS` | Initial signup, no docs uploaded. | No |
| `UNDER_REVIEW` | Docs submitted, extraction complete. | No |
| `VERIFIED` | Admin approved, awaiting dummy order. | No |
| `LIVE` | 100% Verified + Dummy Order passed. | **Yes** |

---

## Stage 3: Product Listing (Done by Ops or Vendor)

### Mandatory Fields per Product
- Name (max 60 chars)
- Category (from the canonical categories table)
- Base price (INR, inc. GST)
- GST % (standard: 18% for handicrafts; 12% for some items — verify with chartered accountant)
- At least 3 images (1200×1200px minimum, white/neutral background)
- Production time in minutes (realistic, not aspirational)
- Stock quantity (or NULL for unlimited)
- Personalisation: enabled/disabled + fee (if enabled)

### Personalisation Schema (if enabled)
```json
{
  "personalization_schema": [
    {
      "field_id": "engraving_text",
      "type": "text",
      "label": "Text to engrave",
      "max_chars": 20,
      "instructions": "English only. No special characters except hyphens."
    },
    {
      "field_id": "logo",
      "type": "image_upload",
      "label": "Upload your logo (optional)",
      "instructions": "PNG with transparent background, min 300×300px",
      "required": false
    }
  ],
  "max_free_revisions": 2,
  "paid_revision_fee": 49,
  "preview_sla_hours": 2,
  "production_sla_mins": 10
}
```

**Maximum 3 fields per product.** Hick's Law applies to vendors too.

---

## Stage 4: The Dummy Order Test (Mandatory Before Going Live)

**Purpose**: Verify the vendor can complete the full workflow before real money is involved.

**Steps:**
1. Ops places a test order (test payment via bypass flag or internal credit)
2. Vendor receives notification → accepts
3. If personalised: ops submits dummy details
4. Vendor uploads a mockup within their defined SLA
5. Ops approves preview
6. Vendor marks order as PACKED
7. Internal rider (or ops) picks up and marks DELIVERED

**Pass criteria:**
- All steps completed within stated SLAs
- Preview quality acceptable (not a placeholder or blank image)
- Vendor can navigate the vendor app without assistance

**Fail → one retry.** Second fail → defer onboarding → ops training session.

---

## Commission Structure

Stored in `platform_settings` table. Never hardcoded.

| Vendor Tier | Commission Rate | Notes |
|---|---|---|
| First 10 orders | 0% | Acquisition incentive |
| Tier 1 (Active) | 15% | Default |
| Tier 2 (Trusted, 50+ orders, ≥4.0 ⭐) | 12% | Tier auto-promoted by cron |
| Tier 3 (Elite, 200+ orders, ≥4.5 ⭐) | 10% | Manual review + badge issued |

**Platform fee** (charged to customer): ₹5 flat — NOT re-negotiable per vendor. This covers Razorpay + infra.

**Payout cycle**: Every 7 days. Calculated from `vendor_payouts` table. Triggered by cron job.

---

## Vendor Pitch Script (BD Use)

> *"You already have the machine. You already know how to do the engraving.*
> *The problem is: no one can find you online.*
> *WyshKit puts you in front of customers who are already looking for exactly what you do — and they pay 100% upfront before you touch anything.*
> *No ghost orders. No WhatsApp chasing. Just paid orders, rider picks up, you keep 85–90%.*
> *First 10 orders: zero commission. On us."*

---

## DB: Vendor Status Lifecycle

```
PENDING_KYC → (kyc_status = VERIFIED) → ACTIVE
ACTIVE → (vendor_tier = 3) → ELITE
ACTIVE → (violation or inactivity) → SUSPENDED
SUSPENDED → (review passed) → ACTIVE
SUSPENDED → (permanent) → TERMINATED
```

`vendors.is_active`: computed from `status = ACTIVE AND kyc_status = VERIFIED AND is_online = true`

---

*Last updated: February 2026*
*Follow the best. Don't reinvent. This is the Swiggy 2026 way.*
