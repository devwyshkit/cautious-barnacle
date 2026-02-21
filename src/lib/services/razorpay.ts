import Razorpay from 'razorpay';
import crypto from 'crypto';
import { logger } from '@/lib/logging/logger';

let razorpayInstance: Razorpay | null = null;

/**
 * WYSHKIT 2026: Razorpay Instance Factory with Validation
 * Validates API keys are configured before creating instance
 */
function getRazorpayInstance() {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      const errorMsg = 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined. Razorpay functionality will be disabled. Please set these environment variables.';
      logger.error(errorMsg, undefined, {
        hasKeyId: !!keyId,
        hasKeySecret: !!keySecret
      });

      // Return a mock instance that throws descriptive errors
      return {
        orders: { create: () => { throw new Error('Razorpay API keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.'); } },
        payments: { fetch: () => { throw new Error('Razorpay API keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.'); } },
        invoices: { create: () => { throw new Error('Razorpay API keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.'); } },
        fundAccount: { create: () => { throw new Error('Razorpay API keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.'); } },
        contacts: { create: () => { throw new Error('Razorpay API keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.'); } },
        payouts: { create: () => { throw new Error('Razorpay API keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.'); } },
      } as unknown as Razorpay;
    }

    // Validate key format (Razorpay key IDs typically start with 'rzp_')
    if (!keyId.startsWith('rzp_') && !keyId.startsWith('rzp_test_') && !keyId.startsWith('rzp_live_')) {
      logger.warn('RAZORPAY_KEY_ID format may be incorrect. Expected format: rzp_...', undefined, { keyIdPrefix: keyId.substring(0, 10) });
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
}

export interface RazorpayOrderOptions {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

/**
 * Creates a Razorpay order.
 * @param amountInPaise - Amount in PAISE (already multiplied by 100 by caller)
 */
export async function create_razorpay_order(
  amount_in_paise: number,
  currency: string = 'INR',
  receipt: string,
  notes?: Record<string, string>
) {
  // WYSHKIT 2026: Amount is already in paise from caller - no multiplication needed
  const options = {
    amount: Math.round(amount_in_paise),
    currency,
    receipt,
    notes,
  };

  const order = await getRazorpayInstance().orders.create(options);
  return order;
}

export async function verify_payment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): Promise<boolean> {
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_secret) {
    logger.error('RAZORPAY_KEY_SECRET is missing for verification', undefined, { razorpay_order_id });
    return false;
  }

  const expected_signature = crypto
    .createHmac('sha256', key_secret)
    .update(body.toString())
    .digest('hex');

  return expected_signature === razorpay_signature;
}

export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}

export async function fetch_payment(payment_id: string) {
  return getRazorpayInstance().payments.fetch(payment_id);
}

/**
 * Refunds a payment.
 * @param paymentId Razorpay payment ID
 * @param amount Amount in PAISE (optional, defaults to full amount if not provided)
 * @param notes Optional notes
 */
export async function refund_payment(payment_id: string, amount?: number, notes?: Record<string, string>) {
  const options: Record<string, any> = { notes };
  if (amount) options.amount = Math.round(amount);

  return getRazorpayInstance().payments.refund(payment_id, options);
}

export interface InvoiceLineItem {
  name: string;
  description?: string;
  amount: number;
  currency?: string;
  quantity: number;
}

export interface InvoiceCustomer {
  name: string;
  email?: string;
  contact?: string;
  billing_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  gstin?: string;
}

export async function create_invoice(
  customer: InvoiceCustomer,
  line_items: InvoiceLineItem[],
  options?: {
    type?: 'invoice' | 'link';
    description?: string;
    currency?: string;
    expire_by?: number;
    sms_notify?: boolean;
    email_notify?: boolean;
    partial_payment?: boolean;
  }
) {
  const invoice_data: Record<string, unknown> = {
    type: options?.type || 'invoice',
    description: options?.description || 'Order Invoice',
    customer: {
      name: customer.name,
      email: customer.email,
      contact: customer.contact,
      billing_address: customer.billing_address,
      gstin: customer.gstin,
    },
    line_items: line_items.map((item) => ({
      name: item.name,
      description: item.description,
      amount: Math.round(item.amount * 100),
      currency: item.currency || 'INR',
      quantity: item.quantity,
    })),
    currency: options?.currency || 'INR',
    sms_notify: options?.sms_notify ?? false,
    email_notify: options?.email_notify ?? true,
    partial_payment: options?.partial_payment ?? false,
  };

  if (options?.expire_by) {
    invoice_data.expire_by = options.expire_by;
  }

  return getRazorpayInstance().invoices.create(invoice_data as any);
}

// ============================================
// RAZORPAY X (PAYOUTS) - Partner Payouts
// ============================================

export interface PayoutContact {
  name: string;
  email?: string;
  contact?: string;
  type: 'vendor' | 'customer' | 'employee' | 'self';
  reference_id?: string;
  notes?: Record<string, string>;
}

export interface FundAccount {
  contact_id: string;
  account_type: 'bank_account' | 'vpa';
  bank_account?: {
    name: string;
    ifsc: string;
    account_number: string;
  };
  vpa?: {
    address: string;
  };
}

export interface PayoutRequest {
  account_number: string;
  fund_account_id: string;
  amount: number;
  currency?: string;
  mode: 'IMPS' | 'NEFT' | 'RTGS' | 'UPI';
  purpose: 'payout' | 'salary' | 'refund' | 'cashback' | 'vendor_bill';
  queue_if_low_balance?: boolean;
  reference_id?: string;
  narration?: string;
  notes?: Record<string, string>;
}

export async function create_payout_contact(contact: PayoutContact) {
  const razorpay = getRazorpayInstance();
  return (razorpay as any).contacts.create(contact);
}

export async function create_fund_account(fund_account: FundAccount) {
  const razorpay = getRazorpayInstance();
  return (razorpay as any).fundAccount.create(fund_account);
}

export async function create_payout(payout: PayoutRequest) {
  const razorpay = getRazorpayInstance();
  const payout_data = {
    ...payout,
    amount: Math.round(payout.amount * 100),
    currency: payout.currency || 'INR',
    queue_if_low_balance: payout.queue_if_low_balance ?? true,
  };
  return (razorpay as any).payouts.create(payout_data);
}

export async function initiate_partner_payout(
  partner: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    payout_contact_id?: string;
    payout_fund_account_id?: string;
    payout_account_number: string;
    payout_ifsc: string;
    payout_account_name: string;
    payout_mode?: string;
  },
  amount: number,
  order_id: string,
  order_number: string
) {
  let contact_id = partner.payout_contact_id;
  let fund_account_id = partner.payout_fund_account_id;

  if (!contact_id) {
    const contact = await create_payout_contact({
      name: partner.name,
      email: partner.email,
      contact: partner.phone,
      type: 'vendor',
      reference_id: partner.id,
    });
    contact_id = contact.id;
  }

  if (!fund_account_id && contact_id) {
    const fund_account = await create_fund_account({
      contact_id: contact_id,
      account_type: 'bank_account',
      bank_account: {
        name: partner.payout_account_name,
        ifsc: partner.payout_ifsc,
        account_number: partner.payout_account_number,
      },
    });
    fund_account_id = fund_account.id;
  }

  if (!fund_account_id) {
    throw new Error('Failed to create fund account');
  }

  const razorpay_account_number = process.env.RAZORPAY_X_ACCOUNT_NUMBER;
  if (!razorpay_account_number) {
    throw new Error('RAZORPAY_X_ACCOUNT_NUMBER not configured');
  }

  const payout = await create_payout({
    account_number: razorpay_account_number,
    fund_account_id: fund_account_id,
    amount: amount,
    mode: (partner.payout_mode as 'IMPS' | 'NEFT' | 'RTGS' | 'UPI') || 'IMPS',
    purpose: 'vendor_bill',
    reference_id: order_id,
    narration: `WyshKit Order #${order_number}`,
    notes: {
      order_id: order_id,
      partner_id: partner.id,
    },
  });

  return {
    payout_id: payout.id,
    contact_id: contact_id,
    fund_account_id: fund_account_id,
    status: payout.status,
  };
}
