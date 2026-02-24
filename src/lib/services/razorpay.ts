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
        orders: { create: () => { throw new Error('Razorpay API keys missing.'); } },
        payments: { fetch: () => { throw new Error('Razorpay API keys missing.'); }, refund: () => { throw new Error('Razorpay API keys missing.'); } },
        invoices: { create: () => { throw new Error('Razorpay API keys missing.'); } },
        fundAccount: { create: () => { throw new Error('Razorpay API keys missing.'); } },
        contacts: { create: () => { throw new Error('Razorpay API keys missing.'); } },
        payouts: { create: () => { throw new Error('Razorpay API keys missing.'); } },
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

// ============================================
// RAZORPAY HELPERS
// ============================================

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
  const options: { amount?: number; notes?: Record<string, string> } = { notes };

  if (amount) options.amount = Math.round(amount);

  return getRazorpayInstance().payments.refund(payment_id, options);
}
